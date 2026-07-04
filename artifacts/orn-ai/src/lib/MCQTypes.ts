
// artifacts\orn-ai\src\lib\MCQTypes.ts
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  timeLimitSeconds: number;
  status: 'Draft' | 'Published' | 'Archived';
}

export interface Assessment {
  id: string;
  name: string;
  role: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  durationMinutes: number;
  passingPercentage: number;
  instructions: string;
  description: string;
  isPublished: boolean;
  questions: Question[];
}