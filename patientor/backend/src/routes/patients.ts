import type {
  NewPatientEntry,
  NonSensitivePatientEntry,
  PatientEntry,
} from "../types.ts";
import express, { type Response, type Request } from "express";
import patientService from "../services/patientService.ts";
import { errorMiddleware, newPatientParser } from "../middleware.ts";

const router = express.Router();

router.get("/:id", (req, res) => {
  const id: string = req.params.id;
  const patient = patientService.getPatient(id);
  if (!patient) {
    res.status(404).send({ error: "patient not found" });
    return;
  }
  res.json(patient);
});

router.get("/", (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatientEntry>,
    res: Response<PatientEntry>,
  ) => {
    const addedEntry = patientService.addPatient(req.body);
    res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;
