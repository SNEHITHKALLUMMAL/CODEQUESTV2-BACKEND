export interface GradableQuestion {
  id: string;
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface SubmittedAnswer {
  questionId: string;
  submittedAnswer: string;
}

export interface GradedAnswer {
  questionId: string;
  submittedAnswer: string;
  isCorrect: boolean;
}

export interface QuestionFeedback {
  questionId: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export interface GradeResult {
  scorePercent: number;
  passed: boolean;
  earnedPoints: number;
  totalPoints: number;
  gradedAnswers: GradedAnswer[];
  feedback: QuestionFeedback[];
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}

export function gradeQuiz(
  questions: GradableQuestion[],
  answers: SubmittedAnswer[],
  passingScorePercent: number
): GradeResult {
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  let earnedPoints = 0;
  let totalPoints = 0;
  const gradedAnswers: GradedAnswer[] = [];
  const feedback: QuestionFeedback[] = [];

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) {
      throw new Error(`Question ${answer.questionId} does not belong to this quiz`);
    }

    totalPoints += question.points;
    const isCorrect = normalizeAnswer(answer.submittedAnswer) === normalizeAnswer(question.correctAnswer);
    if (isCorrect) earnedPoints += question.points;

    gradedAnswers.push({ questionId: question.id, submittedAnswer: answer.submittedAnswer, isCorrect });
    feedback.push({
      questionId: question.id,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation ?? "",
    });
  }

  const scorePercent = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = scorePercent >= passingScorePercent;

  return { scorePercent, passed, earnedPoints, totalPoints, gradedAnswers, feedback };
}
