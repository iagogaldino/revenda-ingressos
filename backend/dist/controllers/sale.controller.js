"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleController = void 0;
const token_service_1 = require("./../services/token.service");
const ticket_service_1 = require("./../services/ticket.service");
const ticket_repository_1 = require("./../repositories/ticket.repository");
class SaleController {
    saleService;
    constructor(saleService) {
        this.saleService = saleService;
    }
    async createSale(req, res, next) {
        try {
            const sale = await this.saleService.createSale(req.body);
            res.status(201).json({
                sale,
                payment: {
                    qrCodeUrl: sale.paymentUrl,
                    status: 'pending'
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getSaleStatus(req, res, next) {
        try {
            const saleId = parseInt(req.params.id);
            if (isNaN(saleId)) {
                res.status(400).json({ error: 'Invalid sale ID' });
                return;
            }
            const sale = await this.saleService.getSaleById(saleId);
            if (!sale) {
                res.status(404).json({ error: 'Sale not found' });
                return;
            }
            const ticketRepository = new ticket_repository_1.TicketRepository();
            const ticketService = new ticket_service_1.TicketService(ticketRepository);
            const ticket = await ticketService.getTicketById(sale.ticket_id);
            const token = new token_service_1.TokenService().generateToken({ saleID: sale.id });
            res.json({
                token: sale.status === 'approved' ? token : null,
                ticket: sale.status === 'approved' ? ticket?.file : null,
                saleId: sale.id,
                status: sale.status,
                payment: {
                    status: sale.status === 'approved' ? 'completed' :
                        sale.status === 'cancelled' ? 'cancelled' : 'pending'
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.SaleController = SaleController;
