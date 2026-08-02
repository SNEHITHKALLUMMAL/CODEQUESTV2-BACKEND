"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAnswer = normalizeAnswer;
exports.gradeQuiz = gradeQuiz;
function normalizeAnswer(value) {
    return value.trim().toLowerCase();
}
/**
 * Pure grading function — no I/O, no Mongoose. Deliberately separated from
 * quiz.service.ts so the scoring algorithm (the one piece of business logic
 * where a bug would silently give someone the wrong score) can be unit
 * tested directly without mocking a database.
 */
function gradeQuiz(questions, answers, passingScorePercent) {
    const questionMap = new Map(questions.map((q) => [q.id, q]));
    let earnedPoints = 0;
    let totalPoints = 0;
    const gradedAnswers = [];
    const feedback = [];
    for (const answer of answers) {
        const question = questionMap.get(answer.questionId);
        if (!question) {
            throw new Error(`Question ${answer.questionId} does not belong to this quiz`);
        }
        totalPoints += question.points;
        const isCorrect = normalizeAnswer(answer.submittedAnswer) === normalizeAnswer(question.correctAnswer);
        if (isCorrect)
            earnedPoints += question.points;
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
//# sourceMappingURL=gradeQuiz.js.map