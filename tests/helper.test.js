import { expect } from "chai";
import { checkIfAlreadyAnswered } from "../src/models/helper.js";

describe("Test suite for helper function", () => {
	it("Should return true if answer is already answered", (done) => {
		const user = {
			"quiz_58a3bf5b-70b6-4e76-a4ee-8847b0686e2c": {
				score: 0,
				answers: [
					{
						questionId: "2f7e1cbc-c2c4-4147-b638-8c198e24a74f",
						selectedOption: 3,
						is_correct: true,
					},
				],
			},
		};

		const quiz = {
			id: "58a3bf5b-70b6-4e76-a4ee-8847b0686e2c",
			title: "Country Capital",
			questions: [
				{
					id: "2f7e1cbc-c2c4-4147-b638-8c198e24a74f",
					text: "What is the capital of India?",
					options: ["Delhi", "Mumbai", "Pune", "Bengaluru"],
					correctOption: 3,
				},
				{
					id: "fef666d7-e93c-4ada-8949-f4c0c3b43478",
					text: "What is the capital of United States?",
					options: ["Washington", "New York", "LA", "Boston"],
					correctOption: 0,
				},
			],
		};
		const questionId = "2f7e1cbc-c2c4-4147-b638-8c198e24a74f";
		const expectedResult = true;
		const result = checkIfAlreadyAnswered(user, quiz, questionId);
		expect(result).to.be.equal(expectedResult);
		done();
	});

	it("Should return true if answer is already answered", (done) => {
		const user = {
			"quiz_58a3bf5b-70b6-4e76-a4ee-8847b0686e2c": {
				score: 0,
				answers: [
					{
						questionId: "2f7e1cbc-c2c4-4147-b638-8c198e24a74f",
						selectedOption: 3,
						is_correct: true,
					},
				],
			},
		};

		const quiz = {
			id: "58a3bf5b-70b6-4e76-a4ee-8847b0686100",
			title: "Country Capital",
			questions: [
				{
					id: "2f7e1cbc-c2c4-4147-b638-8c198e24a74f",
					text: "What is the capital of India?",
					options: ["Delhi", "Mumbai", "Pune", "Bengaluru"],
					correctOption: 3,
				},
				{
					id: "fef666d7-e93c-4ada-8949-f4c0c3b43478",
					text: "What is the capital of United States?",
					options: ["Washington", "New York", "LA", "Boston"],
					correctOption: 0,
				},
			],
		};
		const questionId = "2f7e1cbc-c2c4-4147-b638-8c198e24a100";
		const expectedResult = false;
		const result = checkIfAlreadyAnswered(user, quiz, questionId);
		expect(result).to.be.equal(expectedResult);
		done();
	});
});
