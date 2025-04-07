"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const providers_enum_1 = require("../../models/providers.enum");
const mercadopago_provider_1 = require("./mercadopago.provider");
const openpix_provider_1 = require("./openpix.provider");
class PaymentService {
    providers = new Map();
    constructor() {
        // Register payment providers
        this.registerProvider(providers_enum_1.Providers.MercadoPago, new mercadopago_provider_1.MercadoPagoProvider(process.env.MERCADOPAGO_API_KEY || '', process.env.MERCADOPAGO_API_SECRET || ''));
        this.registerProvider(providers_enum_1.Providers.OpenPIX, new openpix_provider_1.OpenPixProvider(process.env.OPENPIX_APP_ID || '', '' // OpenPix doesn't use secret
        ));
    }
    registerProvider(name, provider) {
        this.providers.set(name.toLowerCase(), provider);
    }
    getProvider(name) {
        const provider = this.providers.get(name.toLowerCase());
        if (!provider) {
            throw new Error(`Payment provider '${name}' not found`);
        }
        return provider;
    }
    async processPayment(providerName, amount, orderId, payer, commentPayment) {
        const provider = this.getProvider(providerName);
        return provider.initializePayment(Number(amount), orderId, payer, commentPayment);
    }
    async confirmPayment(providerName, paymentId) {
        const provider = this.getProvider(providerName);
        return provider.confirmPayment(paymentId);
    }
    async cancelPayment(providerName, paymentId) {
        const provider = this.getProvider(providerName);
        return provider.cancelPayment(paymentId);
    }
    async getPaymentStatus(providerName, paymentId) {
        const provider = this.getProvider(providerName);
        return provider.getPaymentStatus(paymentId);
    }
}
exports.PaymentService = PaymentService;
