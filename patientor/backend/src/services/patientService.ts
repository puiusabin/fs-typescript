import type {
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types.ts";
import patients from "../../data/patients.ts";
import { v1 as uuid } from "uuid";

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] =>
  patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));

const addPatient = (patient: NewPatient) => {
  const id = uuid();
  const newPatient = {
    ...patient,
    id,
    entries: [],
  };
  patients.push(newPatient);

  return newPatient;
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
