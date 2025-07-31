export interface IntentResult {
  intent: string;
  entities: { order_id?: string };
}