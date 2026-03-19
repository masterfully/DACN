/// <reference path="./types/express.d.ts" />
import "dotenv/config";
import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import apiRouter from "./routes";

var cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(requestLogger);

app.use("/api", apiRouter);

app.use(errorHandler);

const port = Number(process.env.PORT ?? 8080);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
