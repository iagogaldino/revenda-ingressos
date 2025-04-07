"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenPixProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const base_payment_provider_1 = require("./base-payment.provider");
class OpenPixProvider extends base_payment_provider_1.BasePaymentProvider {
    baseUrl = 'https://api.openpix.com.br/api/v1';
    async initializePayment(amount, orderId, payer, commentPayment) {
        try {
            await this.logPaymentOperation('initializePayment', { amount, orderId });
            // Multiplica o valor por 100 para converter para centavos e usa Math.round() para evitar problemas de precisão
            const amountInCents = Math.round(amount * 100);
            const payload = {
                correlationID: orderId,
                value: amountInCents.toString(), // Convertido para string
                comment: commentPayment, // `Pagamento do pedido ${orderId}`,
                customer: {
                    name: payer.name,
                    email: payer.email,
                    phone: payer.phone
                }
            };
            // console.log('payload', payload);
            const response = await axios_1.default.post(`${this.baseUrl}/charge`, payload, {
                headers: {
                    Authorization: this.apiKey,
                    'Content-Type': 'application/json'
                }
            });
            console.log('response', response.data);
            return {
                success: true,
                paymentUrl: response.data.qrCodeImage,
                qrCode: response.data.brCode,
                pixKey: response.data.pixKey,
                transactionId: response.data.id,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async confirmPayment(paymentId) {
        try {
            await this.logPaymentOperation('confirmPayment', { paymentId });
            return {
                success: true,
                transactionId: paymentId
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async cancelPayment(paymentId) {
        try {
            await this.logPaymentOperation('cancelPayment', { paymentId });
            return { success: true };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async getPaymentStatus(paymentId) {
        try {
            await this.logPaymentOperation('getPaymentStatus', { paymentId });
            const response = await axios_1.default.get(`${this.baseUrl}/charge/${paymentId}`, {
                headers: {
                    Authorization: this.apiKey
                }
            });
            let status;
            switch (response.data.status) {
                case 'COMPLETED':
                    status = 'completed';
                    break;
                case 'CANCELLED':
                    status = 'cancelled';
                    break;
                case 'FAILED':
                    status = 'failed';
                    break;
                default:
                    status = 'pending';
            }
            return { status };
        }
        catch (error) {
            return {
                status: 'failed',
                error: error.message
            };
        }
    }
}
exports.OpenPixProvider = OpenPixProvider;
