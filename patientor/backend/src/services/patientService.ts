import type {
  NewPatientEntry,
  NonSensitivePatientEntry,
  PatientEntry,
} from "../types.ts";
import patients from "../../data/patients.ts";
import { v1 as uuid } from "uuid";

const getPatients = (): PatientEntry[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatientEntry[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));

const addPatient = (entry: NewPatientEntry) => {
  const id = uuid();
  const newPatientEntry = {
    ...entry,
    id,
    entries: [],
  };
  patients.push(newPatientEntry);

  return newPatientEntry;
};

const getPatient = (id: string) => {
  return patients.find((p) => p.id === id);
};

export default {
  getPatients,
  getNonSensitivePatients,
  addPatient,
  getPatient,
};
