"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const path_1 = __importDefault(require("path"));
const sale_service_1 = require("../services/sale.service");
const sale_repository_1 = require("../repositories/sale.repository");
class TicketController {
    ticketService;
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    async create(req, res, next) {
        try {
            const userID = req.userId;
            const ticketData = req.body;
            const result = await this.ticketService.createTicket(ticketData);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const ticketId = Number(req.params.id);
            const ticketData = req.body;
            const result = await this.ticketService.updateTicket(ticketId, ticketData);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteTicket(req, res, next) {
        try {
            const ticketId = Number(req.params.id);
            await this.ticketService.deleteTicket(ticketId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    async getAllTickets(req, res, next) {
        try {
            const tickets = await this.ticketService.getAllTickets();
            res.status(200).json(tickets);
        }
        catch (error) {
            next(error);
        }
    }
    async getTicketById(req, res, next) {
        try {
            const ticketId = Number(req.params.id);
            const ticket = await this.ticketService.getTicketById(ticketId);
            res.status(200).json(ticket);
        }
        catch (error) {
            next(error);
        }
    }
    async downloadTicket(req, res, next) {
        try {
            const id = req.tokenDecoded?.saleID;
            if (!id) {
                res.status(404).json({ success: false, error: "Error sale id" });
            }
            const saleService = new sale_service_1.SaleService(new sale_repository_1.SaleRepository());
            const sale = await saleService.getSaleById(Number(id));
            if (!sale) {
                res.status(404).json({ success: false, error: "Sale not found" });
            }
            else {
                if (sale.status !== "approved") {
                    res
                        .status(403)
                        .json({ success: false, error: "Payment not approved" });
                }
                const ticket = await this.ticketService.getTicketById(sale.ticket_id);
                if (!ticket || !ticket.file) {
                    res
                        .status(404)
                        .json({ success: false, error: "Ticket file not found" });
                }
                else {
                    const filePath = path_1.default.join(__dirname, "../../uploads", ticket.file);
                    const originalFileName = ticket.file.split("-").slice(2).join("-");
                    res.setHeader("Content-Type", "application/octet-stream");
                    res.setHeader("Content-Disposition", `attachment; filename="${originalFileName}"`);
                    res.sendFile(filePath);
                }
            }
        }
        catch (error) {
            next(error);
        }
    }
    async getTicketsBySeller(req, res, next) {
        try {
            const userID = req.userId;
            const tickets = await this.ticketService.getTicketsBySellerId(userID);
            res.status(200).json(tickets);
        }
        catch (error) {
            next(error);
        }
    }
    async getTicketsBySellerId(req, res, next) {
        try {
            const sellerId = Number(req.params.sellerId);
            const tickets = await this.ticketService.getTicketsBySellerId(sellerId);
            res.status(200).json(tickets);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TicketController = TicketController;
