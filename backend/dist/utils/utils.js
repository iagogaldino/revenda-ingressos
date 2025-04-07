"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Utils {
    /**
     * Converte um arquivo em Base64.
     * @param filePath Caminho completo para o arquivo.
     * @returns Uma string Base64 representando o conteúdo do arquivo.
     */
    static async convertFileToBase64(filePath) {
        console.log("convertFileToBase64", filePath);
        try {
            const fileExtension = path_1.default.extname(filePath).substring(1); // Ex.: "png", "pdf", "jpg"
            const mimeType = getMimeType(fileExtension);
            if (!mimeType) {
                throw new Error("Tipo de arquivo não suportado.");
            }
            const fileBuffer = await fs_1.default.promises.readFile(filePath); // Lê o arquivo como um Buffer
            const base64String = fileBuffer.toString("base64");
            const base64File = `data:${mimeType};base64,${base64String}`;
            return base64File;
        }
        catch (error) {
            throw new Error(`Erro ao converter o arquivo em Base64: ${error.message}`);
        }
    }
    /**
     * Extrai apenas os números de uma string.
     * @param input A string que você quer processar.
     * @returns Uma string contendo apenas os números.
     */
    static extractNumbers(input) {
        return input.replace(/\D/g, ""); // Remove todos os caracteres que não são dígitos.
    }
}
exports.Utils = Utils;
/**
 * Retorna o MIME type com base na extensão do arquivo.
 * @param extension Extensão do arquivo (ex.: "png", "pdf").
 * @returns O MIME type correspondente ou null se não for encontrado.
 */
function getMimeType(extension) {
    const mimeTypes = {
        png: "image/png",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        gif: "image/gif",
        pdf: "application/pdf",
        txt: "text/plain",
        mp4: "video/mp4",
        mp3: "audio/mpeg",
        json: "application/json",
        csv: "text/csv",
    };
    return mimeTypes[extension.toLowerCase()] || null;
}
