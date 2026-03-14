export interface IAiProvider {
  processMessage(message: string): Promise<string>;
}