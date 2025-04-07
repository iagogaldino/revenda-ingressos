"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePaymentProvider = void 0;
class BasePaymentProvider {
    apiKey;
    apiSecret;
    constructor(apiKey, apiSecret) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }
    async logPaymentOperation(operation, data) {
        console.log(`[${this.constructor.name}] ${operation}:`, data);
    }
}
exports.BasePaymentProvider = BasePaymentProvider;
