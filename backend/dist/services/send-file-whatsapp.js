"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendFileWhatsApp = void 0;
const axios_1 = __importDefault(require("axios"));
class SendFileWhatsApp {
    apiUrl;
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        if (!this.apiUrl) {
            throw new Error("API URL is required");
        }
    }
    async sendFileBase64(sessionId, to, base64, fileName, caption = "") {
        try {
            const endpoint = `${this.apiUrl}/sessions/${sessionId}/files`;
            console.log('endpoint', endpoint);
            const response = await axios_1.default.post(endpoint, {
                to,
                base64,
                fileName,
                caption,
            });
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to send image: ${error}`);
        }
    }
}
exports.SendFileWhatsApp = SendFileWhatsApp;
