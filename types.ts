
export interface BusinessInput {
  businessName: string;
  industry: string;
  description: string;
  targetAudience: string;
  goals: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface MarketingMix {
  productStrategy: string;
  priceStrategy: string;
  placeStrategy: string;
  promotionStrategy: string;
}

export interface ActionItem {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  difficulty: 'High' | 'Medium' | 'Low';
}

export interface RiskItem {
  riskType: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface Competitor {
  name: string;
  strengths: string;
  weaknesses: string;
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
  marketGap: string;
}

export interface InvestmentItem {
  area: string;
  reasoning: string;
  priority: 'High' | 'Medium' | 'Low';
  kpis: string[];
}

export interface ContentIdea {
  platform: string;
  contentType: string;
  topic: string;
  description: string;
}

export interface MarketingPlan {
  executiveSummary: string;
  marketAnalysis: string;
  competitorAnalysis: CompetitorAnalysis;
  targetPersona: string;
  swot: SWOT;
  marketingMix: MarketingMix;
  contentStrategy: ContentIdea[];
  actionPlan: ActionItem[];
  riskAnalysis: RiskItem[];
  investmentRecommendations: InvestmentItem[];
  estimatedGrowth: number[]; // Array of 6 numbers representing predicted growth percentage over 6 months
}

export interface HistoryItem {
  id: string;
  date: string;
  businessName: string;
  industry: string;
  plan: MarketingPlan;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}