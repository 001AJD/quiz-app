import { body, validationResult } from "express-validator";

const validateNewQuizPayload = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ errors: errors.array() }).end();
	} else {
		next();
	}
};

const newQuizValidationRules = () => {
	return [
		body("title").exists().isString(),
		body("questions").custom((value) => {
			if (!Array.isArray(value) || value.length === 0) {
				throw new Error(
					`Invalid questions field; it should be a non-empty array.`
				);
			}

			value.forEach((question, index) => {
				if (typeof question !== "object" || question === null) {
					throw new Error(`Question at index ${index} should be an object.`);
				}

				// Check for 'text' property
				if (!question.text || typeof question.text !== "string") {
					throw new Error(
						`Question at index ${index} must have a 'text' field of type string.`
					);
				}

				// Check for 'options' property
				if (
					!Array.isArray(question.options) ||
					question.options.length === 0 ||
					!question.options.every((opt) => typeof opt === "string")
				) {
					throw new Error(
						`Question at index ${index} must have an 'options' field as a non-empty array of strings.`
					);
				}

				// Check for 'correctOption' property
				if (
					typeof question.correctOption !== "number" ||
					question.correctOption < 0 ||
					question.correctOption >= question.options.length
				) {
					throw new Error(
						`Question at index ${index} must have a 'correctOption' field that is a number within the range of options array indices.`
					);
				}
			});

			return true; // Return true if all validations pass
		}),
	];
};

export { newQuizValidationRules, validateNewQuizPayload };
