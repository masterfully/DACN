/// <reference path="./types/express.d.ts" />
import "dotenv/config";
import express from "express";
import apiRouter from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use("/api", apiRouter);

app.use(errorHandler);

const port = Number(process.env.PORT ?? 8080);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
