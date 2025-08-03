import { GeminiAIProvider } from "../../providers/gemini.provider";
import { AddPolicyCommandPayload } from "./AddPolicyCommandPayload";
import { IPolicy } from "./policy.model";
import { PolicyRepository } from "./policy.repository";

export class AddProductCommandHandler {
  private policyRepository: PolicyRepository;
  private geminiAIProvider: GeminiAIProvider;

  constructor() {
    this.policyRepository = new PolicyRepository();
    this.geminiAIProvider = new GeminiAIProvider();
  }

  async execute(payload: AddPolicyCommandPayload): Promise<IPolicy> {
    const { content, sellerId, type, title } = payload;
    const embeddingPolicy = await this.geminiAIProvider.createEmbeddings(payload.content);

    console.log("Politika veri tabanına kaydediliyor...")
    const newPolicy = await this.policyRepository.create({
        sellerId,
        type,
        title,
        content,
        embedding: embeddingPolicy
    });

    return newPolicy;
  }
}