import type {
  NewPatient,
  NonSensitivePatient,
  Patient,
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

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.send(patientService.getNonSensitivePatients());
});

router.post(
  "/",
  newPatientParser,
  (
    req: Request<unknown, unknown, NewPatient>,
    res: Response<Patient>,
  ) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  },
);

router.use(errorMiddleware);

export default router;
