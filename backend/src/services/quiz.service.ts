import { Types } from "mongoose";
import { Quiz } from "../models/Quiz.model";
import { QuizAttempt } from "../models/QuizAttempt.model";
import { ApiError } from "../utils/ApiError";
import { QuestionType } from "../../shared/types/enums";
import { gradeQuiz } from "../utils/gradeQuiz";
import type { SubmitQuizInput } from "../validators/course.validators";

export interface QuestionForAttempt {
  _id: string;
  type: QuestionType;
  question: string;
  options: string[];
  points: number;
}

export const quizService = {
  async getForAttempt(moduleId: string) {
    const quiz = await Quiz.findOne({ moduleId, isPublished: true });
    if (!quiz) throw ApiError.notFound("No quiz found for this module");

    const questions: QuestionForAttempt[] = quiz.questions.map((q) => ({
      _id: q._id.toString(),
      type: q.type,
      question: q.question,
      options: q.options,
      points: q.points,
    }));

    return {
      id: quiz._id.toString(),
      moduleId: quiz.moduleId.toString(),
      title: quiz.title,
      passingScorePercent: quiz.passingScorePercent,
      questions,
    };
  },

  async submit(userId: string, quizId: string, input: SubmitQuizInput) {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) throw ApiError.notFound("Quiz not found");

    if (input.answers.length !== quiz.questions.length) {
      throw ApiError.badRequest(
        `This quiz has ${quiz.questions.length} questions; received ${input.answers.length} answers`
      );
    }

    const gradableQuestions = quiz.questions.map((q) => ({
      id: q._id.toString(),
      correctAnswer: q.correctAnswer,
      points: q.points,
      explanation: q.explanation,
    }));

    let result;
    try {
      result = gradeQuiz(gradableQuestions, input.answers, quiz.passingScorePercent);
    } catch (err) {
      throw ApiError.badRequest((err as Error).message);
    }

    const previousAttempts = await QuizAttempt.countDocuments({ userId, quizId });

    const attempt = await QuizAttempt.create({
      userId,
      quizId,
      moduleId: quiz.moduleId,
      answers: result.gradedAnswers.map((a) => ({
        questionId: new Types.ObjectId(a.questionId),
        submittedAnswer: a.submittedAnswer,
        isCorrect: a.isCorrect,
      })),
      scorePercent: result.scorePercent,
      passed: result.passed,
      attemptNumber: previousAttempts + 1,
      durationSeconds: input.durationSeconds,
    });

    return {
      attemptId: attempt._id.toString(),
      scorePercent: result.scorePercent,
      passed: result.passed,
      passingScorePercent: quiz.passingScorePercent,
      attemptNumber: attempt.attemptNumber,
      feedback: result.feedback,
    };
  },

  async getAttempts(userId: string, quizId: string) {
    return QuizAttempt.find({ userId, quizId }).sort({ attemptNumber: -1 });
  },

  async getBest(userId: string, quizId: string) {
    const best = await QuizAttempt.findOne({ userId, quizId }).sort({ scorePercent: -1, attemptNumber: 1 });
    const attemptCount = await QuizAttempt.countDocuments({ userId, quizId });
    return { best, attemptCount };
  },
};
