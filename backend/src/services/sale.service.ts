import { response } from "express";
import { ISale, ISaleDTO, ISaleService, Sale } from "../interfaces/sale.interface";
import { SaleRepository } from "../repositories/sale.repository";
import { TicketRepository } from "../repositories/ticket.repository";
import { Utils } from "../utils/utils";
import { PaymentService } from "./payment/payment.service";
import { SendFileWhatsApp } from "./send-file-whatsapp";
import { TicketService } from "./ticket.service";
import { ITicket } from "../interfaces/ticket.interface";
import path from "path";

export class SaleService implements ISaleService {
  private paymentService: PaymentService;
  private urlApiWhatsApp = process.env.API_WHATSAPP_URL || "";
  private phoneNumber = process.env.PHONENUMBERID || "";

  constructor(private saleRepository: SaleRepository) {
    this.paymentService = new PaymentService();
  }

  async createSale(saleData: ISale): Promise<ISaleDTO & { paymentUrl?: string, qrCode: string }> {
    try {
      const sale = await this.saleRepository.create({
        id: saleData?.id,
        ticket_id: saleData.ticketId,
        buyer_email: saleData.buyerEmail,
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
    } catch (error: any) {
      console.error("Erro ao criar venda:", error.message);
      throw new Error(`Erro ao criar venda: ${error.message}`);
    }
  }

  private async generatePayment(sale: ISaleDTO) {
    try {
      return await this.paymentService.processPayment(
        "openpix",
        sale.amount,
        `sale_${sale.id}`,
        {
          email: 'iago_galdino@hotmail.com', //sale.buyer_email,
          name: 'Revenda ticket',
          phone: sale.buyer_phone
        }
      );
    } catch (error: any) {
      console.error("Erro ao processar pagamento:", error.message);
      throw new Error(`Erro ao processar pagamento: ${error.message}`);
    }
  }

  async getSaleById(id: number): Promise<ISaleDTO | null> {
    return this.saleRepository.findById(id);
  }

  async updateSaleStatus(id: number, status: ISaleDTO["status"]): Promise<ISaleDTO> {
    return this.saleRepository.update(id, { status });
  }

  private formatPhoneNumber(phone: string): string {
    const cleanedPhone = Utils.extractNumbers(phone);
    return `55${cleanedPhone}@c.us`;
  }

  private async getTicketById(ticketId: number): Promise<ITicket | null> {
    const ticketRepository = new TicketRepository();
    return await new TicketService(ticketRepository).getTicketById(ticketId);
  }

  private async convertFileToBase64(filePath: string): Promise<string> {
    try {
      const fileFullPath = path.resolve(__dirname, "../../uploads", filePath);
      return await Utils.convertFileToBase64(fileFullPath);
    } catch (error: any) {
      throw new Error(
        `Erro ao converter o arquivo para Base64: ${error.message}`
      );
    }
  }

  private async sendFile(
    clientBuyer: string,
    base64: string,
    fileName: string,
    caption: string
  ) {
    try {
      await new SendFileWhatsApp(this.urlApiWhatsApp)
        .sendFileBase64(
          this.phoneNumber,
          clientBuyer,
          base64,
          fileName,
          caption
        )
        .catch((error) => {
          return error.message;
        });
    } catch (error: any) {
      return new Error(error.message);
    }
  }

  async aproveSale(id: number, buyer_phone: string, buyer_email: string, ticket_id: number): Promise<any> {
    try {
      await this.updateSaleStatus(id, "approved");

      const clientBuyer = this.formatPhoneNumber(buyer_phone);
      const caption = `Olá, ${buyer_email}, aqui está o seu ingresso!`;

      const ticket = await this.getTicketById(ticket_id);

      if (ticket && ticket.file) {
        const base64 = await this.convertFileToBase64(ticket.file);

        const ext = ticket.file.split(".")[1];
        const fileName = `ingresso.${ext}`;
        const result = await this.sendFile(
          clientBuyer,
          base64,
          fileName,
          caption,
        );

        if (result instanceof Error) {
          console.error("Error sending WhatsApp file:", result.message);
          return result.message;
        }
      }
    } catch (error: any) {
      console.error("Error updating sale to approved:", error.message);
      return error.message;
    }
  }
}
