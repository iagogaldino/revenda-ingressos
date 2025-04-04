import axios, { AxiosResponse } from "axios";

export class SendFileWhatsApp {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;

    if (!this.apiUrl) {
      throw new Error("API URL is required");
    }
  }

  async sendFileBase64(
    sessionId: string,
    to: string,
    base64: string,
    fileName: string,
    caption: string = ""
  ): Promise<any> {
    try {
      const endpoint = `${this.apiUrl}/sessions/${sessionId}/files`;
      console.log('endpoint', endpoint);
      const response: AxiosResponse = await axios.post(endpoint, {
        to,
        base64,
        fileName,
        caption,
      });

      return response.data;
    } catch (error: any) {
      console.error("Error sending image:", error.message);
      throw new Error(`Failed to send image: ${error.message}`);
    }
  }
}
