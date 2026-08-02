"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionType = exports.ImportanceLevel = exports.CourseSlug = exports.DifficultyLevel = exports.QuizStatus = exports.CertificateStatus = exports.EnrollmentStatus = exports.CourseStatus = exports.ProgressStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["STUDENT"] = "STUDENT";
    UserRole["INSTRUCTOR"] = "INSTRUCTOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var ProgressStatus;
(function (ProgressStatus) {
    ProgressStatus["NOT_STARTED"] = "NOT_STARTED";
    ProgressStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ProgressStatus["COMPLETED"] = "COMPLETED";
})(ProgressStatus || (exports.ProgressStatus = ProgressStatus = {}));
var CourseStatus;
(function (CourseStatus) {
    CourseStatus["DRAFT"] = "DRAFT";
    CourseStatus["PUBLISHED"] = "PUBLISHED";
    CourseStatus["ARCHIVED"] = "ARCHIVED";
})(CourseStatus || (exports.CourseStatus = CourseStatus = {}));
var EnrollmentStatus;
(function (EnrollmentStatus) {
    EnrollmentStatus["ACTIVE"] = "ACTIVE";
    EnrollmentStatus["COMPLETED"] = "COMPLETED";
    EnrollmentStatus["CANCELLED"] = "CANCELLED";
})(EnrollmentStatus || (exports.EnrollmentStatus = EnrollmentStatus = {}));
var CertificateStatus;
(function (CertificateStatus) {
    CertificateStatus["ISSUED"] = "ISSUED";
    CertificateStatus["REVOKED"] = "REVOKED";
})(CertificateStatus || (exports.CertificateStatus = CertificateStatus = {}));
var QuizStatus;
(function (QuizStatus) {
    QuizStatus["NOT_STARTED"] = "NOT_STARTED";
    QuizStatus["IN_PROGRESS"] = "IN_PROGRESS";
    QuizStatus["COMPLETED"] = "COMPLETED";
})(QuizStatus || (exports.QuizStatus = QuizStatus = {}));
var DifficultyLevel;
(function (DifficultyLevel) {
    DifficultyLevel["BEGINNER"] = "BEGINNER";
    DifficultyLevel["INTERMEDIATE"] = "INTERMEDIATE";
    DifficultyLevel["ADVANCED"] = "ADVANCED";
})(DifficultyLevel || (exports.DifficultyLevel = DifficultyLevel = {}));
var CourseSlug;
(function (CourseSlug) {
    CourseSlug["HTML"] = "html";
    CourseSlug["CSS"] = "css";
})(CourseSlug || (exports.CourseSlug = CourseSlug = {}));
var ImportanceLevel;
(function (ImportanceLevel) {
    ImportanceLevel["LOW"] = "LOW";
    ImportanceLevel["STANDARD"] = "STANDARD";
    ImportanceLevel["MEDIUM"] = "MEDIUM";
    ImportanceLevel["HIGH"] = "HIGH";
    ImportanceLevel["IMPORTANT"] = "IMPORTANT";
    ImportanceLevel["CRITICAL"] = "CRITICAL";
})(ImportanceLevel || (exports.ImportanceLevel = ImportanceLevel = {}));
var QuestionType;
(function (QuestionType) {
    QuestionType["MCQ"] = "MCQ";
    QuestionType["MULTIPLE_CHOICE"] = "MULTIPLE_CHOICE";
    QuestionType["TRUE_FALSE"] = "TRUE_FALSE";
    QuestionType["FILL_BLANK"] = "FILL_BLANK";
    QuestionType["SHORT_ANSWER"] = "SHORT_ANSWER";
    QuestionType["CODE"] = "CODE";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
//# sourceMappingURL=enums.js.map