"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const sale_service_1 = require("../services/sale.service");
const sale_repository_1 = require("../repositories/sale.repository");
const providers_enum_1 = require("../models/providers.enum");
class PaymentController {
    paymentService;
    saleService;
    constructor(paymentService) {
        this.paymentService = paymentService;
        this.saleService = new sale_service_1.SaleService(new sale_repository_1.SaleRepository());
    }
    async initializePayment(req, res, next) {
        try {
            const { provider, amount, orderId, payer, commentPayment } = req.body;
            // Verifica se o provider é válido
            if (!Object.values(providers_enum_1.Providers).includes(provider)) {
                return res
                    .status(400)
                    .json({ error: "Invalid payment provider specified" });
            }
            // Processa o pagamento via PaymentService
            const result = await this.paymentService.processPayment(provider, amount, orderId, payer, commentPayment);
            res.json(result);
        }
        catch (error) {
            console.error("Payment initialization error:", error);
            res.status(500).json({ error: "Payment initialization failed" });
        }
    }
    async handleWebhook(req, res, next) {
        try {
            const response = {
                success: false,
                statusFileSent: { error: false, message: "" },
            };
            const provider = req.params.provider;
            // Verifica se o provider é válido
            if (!Object.values(providers_enum_1.Providers).includes(provider)) {
                return res.status(400).json({ error: "Invalid provider specified" });
            }
            if (provider === providers_enum_1.Providers.OpenPIX) {
                const { correlationID, status } = req.body;
                if (!correlationID || typeof correlationID !== "string") {
                    return res
                        .status(400)
                        .json({ error: "Invalid or missing correlationID" });
                }
                if (!["COMPLETED", "CANCELLED"].includes(status)) {
                    return res.status(400).json({ error: "Invalid status received" });
                }
                const saleId = Number(correlationID.replace("sale_", ""));
                console.log(provider, correlationID, status);
                const sale = await this.saleService.getSaleById(saleId);
                if (sale && sale.id) {
                    const { id, buyer_phone, buyer_email, ticket_id } = sale;
                    switch (sale.status) {
                        case "approved":
                            return res
                                .status(400)
                                .json({ error: `A venda ${saleId} já está aprovada` });
                        case "cancelled":
                            return res
                                .status(400)
                                .json({ error: `A venda ${saleId} já foi cancelada` });
                        case "pending":
                            if (status === "COMPLETED") {
                                await this.saleService.aproveSale(id, buyer_phone, buyer_email, ticket_id);
                            }
                            else if (status === "CANCELLED") {
                                await this.saleService.updateSaleStatus(saleId, "cancelled");
                            }
                            break;
                        default:
                            return res
                                .status(400)
                                .json({ error: "Status de venda desconhecido" });
                    }
                }
                else {
                    return res
                        .status(404)
                        .json({ error: `Venda não encontrada: ${saleId}` });
                }
            }
            response.success = true;
            res.json(response);
        }
        catch (error) {
            console.error("Webhook handling error:", error);
            res.status(500).json({ error: `Falha ao processar o webhook. ${error}` });
        }
    }
}
exports.PaymentController = PaymentController;
