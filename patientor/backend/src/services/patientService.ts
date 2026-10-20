import type { NewPatientEntry, PatientEntry } from "../types.ts";
import patients from "../../data/patients.ts";
import { v1 as uuid } from "uuid";

const getPatients = (): PatientEntry[] => {
  return patients;
};

const addPatient = (entry: NewPatientEntry) => {
  const id = uuid();
  const newPatientEntry = {
    id,
    ...entry,
  };
  patients.push(newPatientEntry);

  return newPatientEntry;
};

export default {
  getPatients,
  addPatient,
};
