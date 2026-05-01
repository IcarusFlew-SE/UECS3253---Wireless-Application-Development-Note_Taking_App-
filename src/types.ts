export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isSynced: boolean; // for future cloud sync tracking
}
 
export interface ValidationResult {
  valid: boolean;
  error?: string;
}