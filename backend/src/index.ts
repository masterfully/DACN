import "dotenv/config";
import express from "express";
import { prisma } from "./prisma/prismaClient";

const app = express();
app.use(express.json());

app.get("/accounts", async (_req, res) => {
  const accounts = await prisma.account.findMany();
  res.json(accounts);
});

app.post("/accounts", async (req, res) => {
  const { username, password, role } = req.body;

  const account = await prisma.account.create({
    data: {
      Username: username,
      Password: password,
      Role: role ?? "STUDENT",
    },
  });

  res.json(account);
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
