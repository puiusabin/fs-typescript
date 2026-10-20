/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { PatientEntry } from "../types.ts";
import express, { type Response } from "express";
import patientService from "../services/patientService.ts";

const router = express.Router();

router.get("/", (_req, res: Response<PatientEntry[]>) => {
  res.send(patientService.getPatients());
});

router.post("/", (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;

  const addedEntry = patientService.addPatient({
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
  });
  res.json(addedEntry);
});

export default router;
