"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const crypto_1 = __importDefault(require("crypto"));
class PaymentService {
    ticketService;
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    validateWebhook(signature, payload) {
        const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
        const computedSignature = crypto_1.default
            .createHmac('sha256', webhookSecret || '')
            .update(JSON.stringify(payload))
            .digest('hex');
        return crypto_1.default.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature));
    }
    async updateTicketStatus(webhookData) {
        const ticket = await this.ticketService.getTicketById(webhookData.ticketId);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        const paymentStatus = webhookData.status;
        await this.ticketService.updateTicket(webhookData.ticketId, { ...paymentStatus });
    }
}
exports.PaymentService = PaymentService;
