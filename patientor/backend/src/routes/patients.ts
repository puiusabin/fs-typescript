import type { PatientEntry } from "../types.ts";
import express, { type Response } from "express";
import patientService from "../services/patientService.ts";

const router = express.Router();

router.get("/", (_req, res: Response<PatientEntry[]>) => {
  res.send(patientService.getPatients());
});

export default router;
