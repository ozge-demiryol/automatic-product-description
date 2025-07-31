import { PolicyType } from "./policy.model";

export interface AddPolicyCommandPayload {
    sellerId: string;
    type: PolicyType;
    title?: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}