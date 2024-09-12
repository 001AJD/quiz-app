import { validationResult, param } from "express-validator";
import { validate as uuidValidate } from "uuid";

const validateUUID = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ errors: errors.array() }).end();
	} else {
		next();
	}
};

const UUIDValidationRules = () => {
	return [
		param("id").custom((value) => {
			if (!uuidValidate(value)) {
				throw new Error(`Invalid UUID format for id: ${value}`);
			}
			return true;
		}),
	];
};

export { UUIDValidationRules, validateUUID };
