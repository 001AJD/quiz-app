/*
 * router file to contain all the api endpoint needed for quiz application
 */

import express from "express";
import * as controller from "../controllers/index.js";
import {
	newQuizValidationRules,
	validateNewQuizPayload,
} from "../validators/new-quiz.js";

import {
	validateUUID,
	UUIDValidationRules,
} from "../validators/get-quiz-by-id.js";

const router = express.Router();

router.post(
	"/create-quiz",
	newQuizValidationRules(),
	validateNewQuizPayload,
	controller.createQuiz
);

router.get("/:id", UUIDValidationRules(), validateUUID, controller.getQuizById);
router.post("/:id/question/:questionId", controller.submitAnswerByQuestionId);
router.get("/:quizId/user/:userId/result", controller.getQuizResultByUserId);

export { router };
