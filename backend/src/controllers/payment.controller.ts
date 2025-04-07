import { NextFunction, Request, Response } from "express";
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

  async initializePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { provider, amount, orderId, payer, commentPayment } = req.body;

      if (!Object.values(Providers).includes(provider)) {
        res.status(400).json({ error: "Invalid payment provider specified" });
        return;
      }

      const result = await this.paymentService.processPayment(
        provider,
        amount,
        orderId,
        payer,
        commentPayment
      );

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = {
        success: false,
        statusFileSent: { error: false, message: "" },
      };
      const provider = req.params.provider as Providers;

      if (!Object.values(Providers).includes(provider)) {
        res.status(400).json({ error: "Invalid provider specified" });
        return;
      }

      if (provider === Providers.OpenPIX) {
        const { correlationID, status } = req.body;

        if (!correlationID || typeof correlationID !== "string") {
          res
            .status(400)
            .json({ error: "Invalid or missing correlationID" });
        }

        if (!["COMPLETED", "CANCELLED"].includes(status)) {
          res.status(400).json({ error: "Invalid status received" });
        }

        const saleId = Number(correlationID.replace("sale_", ""));
        console.log(provider, correlationID, status);

        const sale = await this.saleService.getSaleById(saleId);
        if (sale && sale.id) {
          const { id, buyer_phone, buyer_email, ticket_id } = sale;

          switch (sale.status) {
            case "approved":
              res
                .status(400)
                .json({ error: `A venda ${saleId} já está aprovada` });
            case "cancelled":
              res
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
              res
                .status(400)
                .json({ error: "Status de venda desconhecido" });
          }
        } else {
          res
            .status(404)
            .json({ error: `Venda não encontrada: ${saleId}` });
        }
      }

      response.success = true;
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}
