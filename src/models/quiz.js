import RedisClient from "../services/redis.js";
import * as helper from "./helper.js";

const redisClient = new RedisClient();

export const saveNewQuiz = async (newQuiz) => {
	await redisClient.connect();
	await redisClient.set(`quiz_${newQuiz.id}`, newQuiz);
	await redisClient.disconnect();
	return newQuiz;
};

export const getQuizById = async (id) => {
	await redisClient.connect();
	const quiz = await redisClient.get(`quiz_${id}`);
	await redisClient.disconnect();
	return quiz;
};

export const submitAnswer = async (answerPayload) => {
	const { quizId, userId, questionId } = answerPayload;

	await redisClient.connect();
	const quiz = await redisClient.get(`quiz_${quizId}`);
	if (!quiz) {
		return null;
	}
	let user = await redisClient.get(`user_${userId}`);
	if (!user) {
		const result = helper.generateUserResultObj(quiz, answerPayload);
		console.log("user");
		console.log(result);
		await redisClient.set(`user_${userId}`, result.user);
		await redisClient.disconnect();
		return result.correctAnswer;
	} else {
		// check if user has already submitted the answer
		if (helper.checkIfAlreadyAnswered(user, quiz, questionId)) {
			throw new Error("question already answered");
		}
		const result = helper.updateUserResultObj(quiz, answerPayload, user);
		await redisClient.set(`user_${userId}`, result.user);
		await redisClient.disconnect();
		return result.correctAnswer;
	}
};

export const getResult = async ({ userId, quizId }) => {
	await redisClient.connect();
	const user = await redisClient.get(`user_${userId}`);
	await redisClient.disconnect();
	if (user.hasOwnProperty(`quiz_${quizId}`)) {
		return user[`quiz_${quizId}`];
	} else {
		return null;
	}
};
