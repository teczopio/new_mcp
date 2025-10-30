/**
 * Zopio MCP - Type Definitions
 */

export interface UserProfile {
  technicalLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  hasBackendExperience: boolean;
  hasFrontendExperience: boolean;
  hasDevOpsExperience: boolean;
  preferredLanguages: string[];
  budget: 'low' | 'medium' | 'high' | 'unlimited';
  timeline: 'urgent' | 'normal' | 'flexible';
  confidence: number; // 0-100
}

export interface ProjectRequirement {
  projectName: string;
  projectType: string;
  description: string;
  features: string[];
  userRoles: UserRole[];
  estimatedComplexity: 'simple' | 'medium' | 'complex' | 'enterprise';
  clarityScore: number; // 0-100
}

export interface UserRole {
  name: string;
  permissions: string[];
  description: string;
}

export interface FrameworkDecision {
  components: ZopioComponent[];
  reasoning: string;
  estimatedCost: CostEstimate;
  requiredServices: ServiceRequirement[];
  alternatives: Alternative[];
}

export interface ZopioComponent {
  name: string;
  type: 'core' | 'optional' | 'recommended';
  description: string;
  dependencies: string[];
}

export interface CostEstimate {
  monthly: number;
  setup: number;
  breakdown: CostBreakdown[];
  currency: string;
}

export interface CostBreakdown {
  service: string;
  cost: number;
  frequency: 'monthly' | 'one-time' | 'per-use';
  required: boolean;
  alternatives?: string[];
}

export interface ServiceRequirement {
  name: string;
  provider: string;
  purpose: string;
  apiKeyRequired: boolean;
  paymentRequired: boolean;
  estimatedCost: number;
  setupInstructions: string;
  alternatives: string[];
}

export interface Alternative {
  description: string;
  costSavings: number;
  tradeoffs: string[];
}

export interface ConversationState {
  stage: 'profiling' | 'requirements' | 'clarification' | 'decision' | 'cost-review' | 'installation';
  userProfile?: UserProfile;
  projectRequirement?: ProjectRequirement;
  frameworkDecision?: FrameworkDecision;
  questionsAsked: string[];
  answersReceived: Record<string, any>;
  currentQuestion?: string;
  apiKeys?: Record<string, string>;
}
