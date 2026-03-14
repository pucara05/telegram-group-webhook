export interface IAiProvider {
  processMessage(message: string, chatId: string): Promise<string>;
}