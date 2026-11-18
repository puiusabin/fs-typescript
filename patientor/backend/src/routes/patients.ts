import type {
  Entry,
  EntryWithoutId,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types.ts";
import express, { type Response, type Request } from "express";
import patientService from "../services/patientService.ts";
import {
  errorMiddleware,
  newEntryParser,
  newPatientParser,
} from "../middleware.ts";

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

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  },
);

router.post(
  "/:id/entries",
  newEntryParser,
  (
    req: Request<{ id: string }, unknown, EntryWithoutId>,
    res: Response<Entry | { error: string }>,
  ) => {
    const patient = patientService.getPatient(req.params.id);
    if (!patient) {
      res.status(404).send({ error: "patient not found" });
      return;
    }
    res.status(201).json(patientService.addEntry(patient, req.body));
  },
);

router.use(errorMiddleware);

export default router;
