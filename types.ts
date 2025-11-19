export interface BudgetLineItem {
  item: string;
  category: string;
  estimatedCost: number;
  estimatedHours: number;
}

export interface Milestone {
  title: string;
  description: string;
  weekEstimate: number;
}

export interface UserStory {
  role: string;
  action: string;
  benefit: string;
  priority: string;
}

export interface AnalysisResult {
  projectName: string;
  summary: string;
  budget: BudgetLineItem[];
  milestones: Milestone[];
  userStories: UserStory[];
}

export enum AnalysisStatus {
  IDLE,
  ANALYZING,
  SUCCESS,
  ERROR
}