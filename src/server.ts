import express from "express";
import { accountRoutes } from "./routes/accountRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/", accountRoutes);
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
