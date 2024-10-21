// src/server.ts
import express from "express";
import { accountRoutes } from "./routes/accountRoutes";
import { createAccountsTable } from "./infrastructure/database/migrations/createAccountsTable";

const app = express();
app.use(express.json());
createAccountsTable();

app.use("/", accountRoutes);

app.listen(5555, () => {
  console.log("Server is running on port 5555");
});
