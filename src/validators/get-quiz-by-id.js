import { validationResult, param } from "express-validator";
import { validate as uuidValidate } from "uuid";

const validateUUID = (req, res, next) => {
	// check if any error as per the validation rule, if yes then throw 400 bad request
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.status(400).json({ errors: errors.array() }).end();
	} else {
		next();
	}
};

const UUIDValidationRules = () => {
	// validation rules for get quiz by id route
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
