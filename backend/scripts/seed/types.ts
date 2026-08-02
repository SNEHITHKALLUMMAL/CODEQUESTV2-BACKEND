import { ImportanceLevel, QuestionType } from "../../shared/types/enums";

export interface QuizQuestionSeed {
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizSeed {
  title: string;
  questions: QuizQuestionSeed[];
}

export interface PracticalSeed {
  title: string;
  /** short hint used to generate a real instructions paragraph + starter code */
  instructionsHint: string;
}

export interface ModuleSeed {
  slug: string;
  title: string;
  importance: ImportanceLevel;
  topics: string[]; // topic titles, in order
  practicals: PracticalSeed[];
  quiz: QuizSeed;
}

export interface CourseSeed {
  slug: "html" | "css";
  title: string;
  description: string;
  order: number;
  modules: ModuleSeed[];
}
