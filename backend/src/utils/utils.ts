import fs from "fs";
import path from "path";

export class Utils {
  /**
   * Converte um arquivo em Base64.
   * @param filePath Caminho completo para o arquivo.
   * @returns Uma string Base64 representando o conteúdo do arquivo.
   */
  static async convertFileToBase64(filePath: string): Promise<string> {
    console.log("convertFileToBase64", filePath);
    try {
      const fileExtension = path.extname(filePath).substring(1); // Ex.: "png", "pdf", "jpg"
      const mimeType = getMimeType(fileExtension);

      if (!mimeType) {
        throw new Error("Tipo de arquivo não suportado.");
      }

      const fileBuffer = await fs.promises.readFile(filePath); // Lê o arquivo como um Buffer
      const base64String = fileBuffer.toString("base64");
      const base64File = `data:${mimeType};base64,${base64String}`;

      return base64File;
    } catch (error: any) {
      throw new Error(
        `Erro ao converter o arquivo em Base64: ${error.message}`
      );
    }
  }

  /**
   * Extrai apenas os números de uma string.
   * @param input A string que você quer processar.
   * @returns Uma string contendo apenas os números.
   */
  static extractNumbers(input: string): string {
    return input.replace(/\D/g, ""); // Remove todos os caracteres que não são dígitos.
  }
}

/**
 * Retorna o MIME type com base na extensão do arquivo.
 * @param extension Extensão do arquivo (ex.: "png", "pdf").
 * @returns O MIME type correspondente ou null se não for encontrado.
 */
function getMimeType(extension: string): string | null {
  const mimeTypes: { [key: string]: string } = {
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
