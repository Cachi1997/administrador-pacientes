import express from "express";
import cors from "cors";
import { patientsRouter } from "./routes";

export const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/patients", patientsRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});
