export interface AIProvider {
  generateProductDescription(productName: string,
    category: string,
    keywords: string[], tone: string): Promise<string>;
}