import { Request, Response } from "express";
import { PaymentService } from "../services/payment/payment.service";
import { SaleService } from "../services/sale.service";
import { SaleRepository } from "../repositories/sale.repository";
import { Providers } from "../models/providers.enum";
import { SendFileWhatsApp } from "../services/send-file-whatsapp";
import { Utils } from "../utils/utils";
import { TicketService } from "../services/ticket.service";
import { TicketRepository } from "../repositories/ticket.repository";

export class PaymentController {
  private saleService: SaleService;

  constructor(private paymentService: PaymentService) {
    this.saleService = new SaleService(new SaleRepository());
  }

  async initializePayment(req: Request, res: Response) {
    try {
      const { provider, amount, orderId, payer, commentPayment } = req.body;

      // Verifica se o provider é válido
      if (!Object.values(Providers).includes(provider)) {
        return res
          .status(400)
          .json({ error: "Invalid payment provider specified" });
      }

      // Processa o pagamento via PaymentService
      const result = await this.paymentService.processPayment(
        provider,
        amount,
        orderId,
        payer,
        commentPayment
      );

      res.json(result);
    } catch (error) {
      console.error("Payment initialization error:", error);
      res.status(500).json({ error: "Payment initialization failed" });
    }
  }

  async handleWebhook(req: Request, res: Response) {
    try {
      const response = {
        success: false,
        statusFileSent: { error: false, message: "" },
      };
      const provider = req.params.provider as Providers;

      // Verifica se o provider é válido
      if (!Object.values(Providers).includes(provider)) {
        return res.status(400).json({ error: "Invalid provider specified" });
      }

      if (provider === Providers.OpenPIX) {
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
                await this.saleService.aproveSale(
                  id,
                  buyer_phone,
                  buyer_email,
                  ticket_id
                );
              } else if (status === "CANCELLED") {
                await this.saleService.updateSaleStatus(saleId, "cancelled");
              }
              break;
            default:
              return res
                .status(400)
                .json({ error: "Status de venda desconhecido" });
          }
        } else {
          return res
            .status(404)
            .json({ error: `Venda não encontrada: ${saleId}` });
        }
      }

      response.success = true;
      res.json(response);
    } catch (error) {
      console.error("Webhook handling error:", error);
      res.status(500).json({ error: `Falha ao processar o webhook. ${error}` });
    }
  }
}
