import RedisClient from "../services/redis.js";
import * as helper from "./helper.js";

const redisClient = new RedisClient();

export const saveNewQuiz = async (newQuiz) => {
	// connect to redis
	await redisClient.connect();
	// save the new quiz
	await redisClient.set(`quiz_${newQuiz.id}`, newQuiz);
	// disconnect connection after operation is completed
	await redisClient.disconnect();
	return newQuiz;
};

export const getQuizById = async (id) => {
	// find the quiz by quiz id and return
	await redisClient.connect();
	const quiz = await redisClient.get(`quiz_${id}`);
	await redisClient.disconnect();
	return quiz;
};

export const submitAnswer = async (answerPayload) => {
	// submit answer to the quiz question based on questionId, userId
	const { quizId, userId, questionId } = answerPayload;

	await redisClient.connect();
	const quiz = await redisClient.get(`quiz_${quizId}`);
	if (!quiz) {
		// if the quiz id does not match in databse then return null
		return null;
	}
	// check if user's previous result object is present
	let user = await redisClient.get(`user_${userId}`);
	if (!user) {
		// if result object is not present create a new one
		const result = helper.generateUserResultObj(quiz, answerPayload);
		console.log("user");
		console.log(result);
		await redisClient.set(`user_${userId}`, result.user);
		await redisClient.disconnect();
		return result.correctAnswer;
	} else {
		// if result object is already present
		// then first check if user has already submitted the answer
		if (helper.checkIfAlreadyAnswered(user, quiz, questionId)) {
			throw new Error("question already answered");
		}
		// if not already submitted the answer then update the existing user result object to add new answer
		const result = helper.updateUserResultObj(quiz, answerPayload, user);
		await redisClient.set(`user_${userId}`, result.user);
		await redisClient.disconnect();
		return result.correctAnswer;
	}
};

export const getResult = async ({ userId, quizId }) => {
	// get the user result by userid and quizid
	await redisClient.connect();
	const user = await redisClient.get(`user_${userId}`);
	await redisClient.disconnect();
	if (user.hasOwnProperty(`quiz_${quizId}`)) {
		return user[`quiz_${quizId}`];
	} else {
		return null;
	}
};
