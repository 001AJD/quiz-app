import { randomUUID } from "crypto";
import * as models from "../models/quiz.js";

export const createQuiz = async (req, res) => {
	// controller to create a new quiz and save to database (in-memory)
	const newQuiz = {
		id: randomUUID(),
		title: req.body.title,
		questions: req.body.questions.map((que) => {
			return {
				id: randomUUID(),
				...que,
			};
		}),
	};
	try {
		const response = await models.saveNewQuiz(newQuiz);
		res.json(response);
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};

export const getQuizById = async (req, res) => {
	const response = await models.getQuizById(req.params.id);
	if (response) {
		res.json(response);
	} else {
		res
			.status(404)
			.json({ msg: "The requested quiz id does not exists" })
			.end();
	}
};

export const submitAnswerByQuestionId = async (req, res) => {
	try {
		const response = await models.submitAnswer({
			quizId: req.params.id,
			questionId: req.params.questionId,
			selectedOption: req.body.selectedOption,
			userId: req.get("user-id"),
		});
		if (response) {
			res.json(response);
		} else {
			res
				.status(404)
				.json({
					msg: "The user id, quiz id, or question id combination does not exists in the db",
				})
				.end();
		}
	} catch (err) {
		console.log(err.message);
		console.log(err.stack);
		res.status(500).json({ msg: err.message }).end();
	}
};

export const getQuizResultByUserId = async (req, res) => {
	const { userId, quizId } = req.params;
	console.log(`user_${userId}`);
	console.log(`quiz_${quizId}`);
	try {
		const response = await models.getResult({ userId, quizId });
		if (response) {
			res.status(200).json(response);
		} else {
			res
				.status(404)
				.json({ msg: "User id and quiz id combination does not exists" });
		}
	} catch (err) {
		res.status(500).json({ msg: err.message });
	}
};
