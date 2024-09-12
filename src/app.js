import express from "express";
import helmet from "helmet";
import { router as quizRouter } from "./routes/routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(helmet());

// routers
app.use("/quiz/v1", quizRouter);

// application listen on port 3000
app.listen(3000, () => {
	console.log("listening on port 3000");
});
