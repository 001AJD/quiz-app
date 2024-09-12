export const generateUserResultObj = (quiz, answerPayload) => {
	const { quizId, questionId, selectedOption } = answerPayload;
	const answer = evaluateAnswer(quiz, questionId, selectedOption);
	return {
		user: {
			[`quiz_${quizId}`]: {
				score: answer.isCorrect === true ? 1 : 0,
				answers: [
					{
						questionId,
						selectedOption,
						is_correct: answer.isCorrect,
					},
				],
			},
		},
		correctAnswer: {
			msg: answer.isCorrect
				? "Your Answer is correct"
				: "Oops! You have given wrong answer. Correct answer is mentioned below",
			index: answer.correctAnswer,
			text: answer.text,
		},
	};
};

const evaluateAnswer = (quiz, questionId, selectedOption) => {
	const { questions } = quiz;
	console.log("quiz found");
	console.log(quiz);
	const question = questions.find((question) => question.id === questionId);
	console.log("print questions");
	console.log(question);
	return {
		isCorrect: question.correctOption === selectedOption,
		correctAnswer: question.correctOption,
		text: question.options[question.correctOption],
	};
};

export const updateUserResultObj = (quiz, answerPayload, user) => {
	const { quizId, questionId, selectedOption } = answerPayload;
	const answer = evaluateAnswer(quiz, questionId, selectedOption);
	const answerObj = {
		questionId,
		selectedOption,
		is_correct: answer.isCorrect,
	};
	if (user.hasOwnProperty(`quiz_${quizId}`)) {
		let { answers, score } = user[`quiz_${quizId}`];
		answers.push(answerObj);
		answer.isCorrect === true ? (score += 1) : score;
		user[`quiz_${quizId}`].score = score;
		user[`quiz_${quizId}`].answers = answers;
	} else {
		user[`quiz_${quizId}`] = {
			score: answer.isCorrect ? 1 : 0,
			answers: [answerObj],
		};
	}

	return {
		user,
		correctAnswer: {
			msg: answer.isCorrect
				? "Your Answer is correct"
				: "Oops! You have given wrong answer. Correct answer is mentioned below",
			index: answer.correctAnswer,
			text: answer.text,
		},
	};
};

export const checkIfAlreadyAnswered = (user, quiz, questionId) => {
	console.log("quiz*****");
	console.log(quiz);
	console.log(`quiz_${quiz.id}`);
	console.log("*&&&&&^^^^^^#####");
	console.log(user.hasOwnProperty(`quiz_${quiz.id}`));
	// check if user has attempted any question from the quiz
	if (!user.hasOwnProperty(`quiz_${quiz.id}`)) {
		console.log("passed");
		return false;
	}
	// check if user has answered the curent question
	const { answers } = user[`quiz_${quiz.id}`];
	const result = answers.find((answer) => answer.questionId === questionId);
	return result.questionId === questionId;
};
