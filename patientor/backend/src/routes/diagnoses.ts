import express, { type Response } from "express";
import diagnosisService from "../services/diagnosisService.ts";
import type { Diagnosis } from "../types.ts";

const router = express.Router();

router.get("/", (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosisService.getDiagnoses());
});

router.get("/:code", (req, res) => {
  const code = req.params.code;
  const diagnose: Diagnosis | undefined = diagnosisService.getDiagnose(code);
  if (!diagnose) {
    return res.status(404).json({ error: "failed to find diagnosis" });
  }
  return res.json(diagnose);
});

export default router;
