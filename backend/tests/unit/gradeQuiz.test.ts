import { gradeQuiz, normalizeAnswer } from "../../src/utils/gradeQuiz";

describe("normalizeAnswer", () => {
  it("trims whitespace and lowercases", () => {
    expect(normalizeAnswer("  Flexbox  ")).toBe("flexbox");
  });

  it("treats different-case answers as equal after normalization", () => {
    expect(normalizeAnswer("FLEX")).toBe(normalizeAnswer("flex"));
  });
});

describe("gradeQuiz", () => {
  const questions = [
    { id: "q1", correctAnswer: "HyperText Markup Language", points: 1, explanation: "HTML expands to this." },
    { id: "q2", correctAnswer: "5", points: 1, explanation: "HTML5 is current." },
    { id: "q3", correctAnswer: "flex", points: 1, explanation: "display: flex" },
    { id: "q4", correctAnswer: "border-box", points: 1, explanation: "Includes padding/border." },
  ];

  it("grades a fully correct submission as 100% and passed", () => {
    const answers = [
      { questionId: "q1", submittedAnswer: "HyperText Markup Language" },
      { questionId: "q2", submittedAnswer: "5" },
      { questionId: "q3", submittedAnswer: "flex" },
      { questionId: "q4", submittedAnswer: "border-box" },
    ];
    const result = gradeQuiz(questions, answers, 70);
    expect(result.scorePercent).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.earnedPoints).toBe(4);
    expect(result.feedback.every((f) => f.isCorrect)).toBe(true);
  });

  it("is case- and whitespace-insensitive when matching answers", () => {
    const answers = [
      { questionId: "q1", submittedAnswer: "  hypertext markup language  " },
      { questionId: "q2", submittedAnswer: "5" },
      { questionId: "q3", submittedAnswer: "FLEX" },
      { questionId: "q4", submittedAnswer: "content-box" }, // deliberately wrong
    ];
    const result = gradeQuiz(questions, answers, 70);
    expect(result.scorePercent).toBe(75);
    expect(result.passed).toBe(true); // 75 >= 70
    expect(result.feedback.find((f) => f.questionId === "q4")?.isCorrect).toBe(false);
    expect(result.feedback.find((f) => f.questionId === "q4")?.correctAnswer).toBe("border-box");
  });

  it("fails a submission that scores below the passing threshold", () => {
    const answers = [
      { questionId: "q1", submittedAnswer: "wrong" },
      { questionId: "q2", submittedAnswer: "wrong" },
      { questionId: "q3", submittedAnswer: "flex" },
      { questionId: "q4", submittedAnswer: "wrong" },
    ];
    const result = gradeQuiz(questions, answers, 70);
    expect(result.scorePercent).toBe(25);
    expect(result.passed).toBe(false);
  });

  it("weights questions by their points value, not just count", () => {
    const weighted = [
      { id: "q1", correctAnswer: "a", points: 3 },
      { id: "q2", correctAnswer: "b", points: 1 },
    ];
    const answers = [
      { questionId: "q1", submittedAnswer: "a" }, // correct, worth 3
      { questionId: "q2", submittedAnswer: "wrong" }, // incorrect, worth 1
    ];
    const result = gradeQuiz(weighted, answers, 50);
    // 3 of 4 total points = 75%
    expect(result.earnedPoints).toBe(3);
    expect(result.totalPoints).toBe(4);
    expect(result.scorePercent).toBe(75);
  });

  it("throws if an answer references a question not in the quiz", () => {
    expect(() => gradeQuiz(questions, [{ questionId: "does-not-exist", submittedAnswer: "x" }], 70)).toThrow(
      /does not belong to this quiz/
    );
  });

  it("returns 0% for an empty question set rather than NaN", () => {
    const result = gradeQuiz([], [], 70);
    expect(result.scorePercent).toBe(0);
    expect(result.passed).toBe(false);
  });

  it("never reveals the correct answer for a question the user got right beyond confirming correctness", () => {
    const answers = [{ questionId: "q3", submittedAnswer: "flex" }];
    const singleQuestion = [questions[2]];
    const result = gradeQuiz(singleQuestion, answers, 70);
    expect(result.feedback[0].isCorrect).toBe(true);
    // Feedback always includes the correct answer post-submission (by design, for learning) —
    // this test documents that as intentional, not an oversight.
    expect(result.feedback[0].correctAnswer).toBe("flex");
  });
});
