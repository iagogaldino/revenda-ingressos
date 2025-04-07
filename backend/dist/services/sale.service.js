"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleService = void 0;
const ticket_repository_1 = require("../repositories/ticket.repository");
const utils_1 = require("../utils/utils");
const payment_service_1 = require("./payment/payment.service");
const send_file_whatsapp_1 = require("./send-file-whatsapp");
const ticket_service_1 = require("./ticket.service");
const path_1 = __importDefault(require("path"));
class SaleService {
    saleRepository;
    paymentService;
    urlApiWhatsApp = process.env.API_WHATSAPP_URL || "";
    phoneNumber = process.env.PHONENUMBERID || "";
    constructor(saleRepository) {
        this.saleRepository = saleRepository;
        this.paymentService = new payment_service_1.PaymentService();
    }
    async createSale(saleData) {
        try {
            const sale = await this.saleRepository.create({
                id: saleData?.id,
                ticket_id: saleData.ticketId,
                buyer_name: saleData.buyerName,
                buyer_email: 'iago_galdino@hotmail.com', //saleData.buyerEmail,
                buyer_phone: saleData.buyerPhone,
                amount: saleData.amount,
                status: "pending",
                created_at: new Date(),
            });
            // Gerar o pagamento com OpenPix
            const payment = await this.generatePayment(sale);
            // Verifica se o pagamento foi gerado com sucesso
            if (!payment.success) {
                console.error("Erro ao gerar pagamento:", payment);
                throw new Error("Falha ao gerar o pagamento.");
            }
            // Retorna a venda com a URL de pagamento
            // console.log(payment);
            return {
                ...sale,
                qrCode: payment.qrCode || ''
            };
        }
        catch (error) {
            console.error("Erro ao criar venda:", error.message);
            throw new Error(`Erro ao criar venda: ${error.message}`);
        }
    }
    async generatePayment(sale) {
        const ticket = await new ticket_service_1.TicketService(new ticket_repository_1.TicketRepository()).getTicketById(sale.ticket_id);
        const commentPayment = `
    ${ticket?.event_name} -
    \n${ticket?.description}
    `;
        console.log('commentPayment', ticket);
        try {
            return await this.paymentService.processPayment("openpix", sale.amount, `sale_${sale.id}`, {
                email: sale.buyer_email, //sale.buyer_email,
                name: sale.buyer_name,
                phone: sale.buyer_phone
            }, commentPayment);
        }
        catch (error) {
            console.error("Erro ao processar pagamento:", error.message);
            throw new Error(`Erro ao processar pagamento: ${error.message}`);
        }
    }
    async getSaleById(id) {
        return this.saleRepository.findById(id);
    }
    async updateSaleStatus(id, status) {
        return this.saleRepository.update(id, { status });
    }
    formatPhoneNumber(phone) {
        const cleanedPhone = utils_1.Utils.extractNumbers(phone);
        return `55${cleanedPhone}@c.us`;
    }
    async getTicketById(ticketId) {
        const ticketRepository = new ticket_repository_1.TicketRepository();
        return await new ticket_service_1.TicketService(ticketRepository).getTicketById(ticketId);
    }
    async convertFileToBase64(filePath) {
        try {
            const fileFullPath = path_1.default.resolve(__dirname, "../../uploads", filePath);
            return await utils_1.Utils.convertFileToBase64(fileFullPath);
        }
        catch (error) {
            throw new Error(`Erro ao converter o arquivo para Base64: ${error.message}`);
        }
    }
    async sendFile(clientBuyer, base64, fileName, caption) {
        try {
            await new send_file_whatsapp_1.SendFileWhatsApp(this.urlApiWhatsApp)
                .sendFileBase64(this.phoneNumber, clientBuyer, base64, fileName, caption)
                .catch((error) => {
                return error.message;
            });
        }
        catch (error) {
            return new Error(error.message);
        }
    }
    async aproveSale(id, buyer_phone, buyer_email, ticket_id) {
        try {
            await this.updateSaleStatus(id, "approved");
            const clientBuyer = this.formatPhoneNumber(buyer_phone);
            const caption = `Olá, ${buyer_email}, aqui está o seu ingresso!`;
            const ticket = await this.getTicketById(ticket_id);
            if (ticket && ticket.file) {
                const base64 = await this.convertFileToBase64(ticket.file);
                const ext = ticket.file.split(".")[1];
                const fileName = `ingresso.${ext}`;
                const result = await this.sendFile(clientBuyer, base64, fileName, caption);
                if (result instanceof Error) {
                    console.error("Error sending WhatsApp file:", result.message);
                    return result.message;
                }
            }
        }
        catch (error) {
            console.error("Error updating sale to approved:", error.message);
            return error.message;
        }
    }
}
exports.SaleService = SaleService;
