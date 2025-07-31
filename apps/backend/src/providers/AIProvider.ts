import { ProductDescriptionRequest } from "./ProductDescriptionRequest";
export interface AIProvider {
  generateProductDescription(request: ProductDescriptionRequest): Promise<string>;
  createEmbeddings(text: string): Promise<number[]>
  startChat(chatConfig: any): any
}