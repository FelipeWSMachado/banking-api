// src/server.ts
import express from "express";
import { accountRoutes } from "./routes/accountRoutes";
import { createAccountsTable } from "./infrastructure/database/migrations/createAccountsTable";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
createAccountsTable();

app.use("/", accountRoutes);
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
