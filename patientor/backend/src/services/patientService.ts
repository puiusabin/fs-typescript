import type { PatientEntry } from "../types.ts";
import patients from "../../data/patients.ts";

const getPatients = (): PatientEntry[] => {
  return patients;
};

export default {
  getPatients,
};
