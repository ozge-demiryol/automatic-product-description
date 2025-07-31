import { IntentResult } from "./IntentResult";

export function detectIntentAndEntities(userQuestion: string): IntentResult {
  const question = userQuestion.toLowerCase();

  const intents = [
    { name: "shipping_delay", keywords: ["geç geldi", "kargo gecikmesi", "siparişim geç"] },
    { name: "refund_request", keywords: ["iade", "para iadesi"] },
    { name: "order_status", keywords: ["sipariş durumu", "nerede", "kargo takip"] },
    { name: "product_info", keywords: ["hangi materyal", "özellikleri", "malzeme"] }
  ];

  let detectedIntent = "general";
  for (const intent of intents) {
    if (intent.keywords.some(k => question.includes(k))) {
      detectedIntent = intent.name;
      break;
    }
  }

  const orderIdMatch = question.match(/\b[A-Z0-9]{6,12}\b/);
  const order_id = orderIdMatch ? orderIdMatch[0] : undefined;

  return {
    intent: detectedIntent,
    entities: { order_id }
  };
}
