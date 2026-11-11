import diagnoses from "../../data/diagnoses.ts";
import type { Diagnosis } from "../types.ts";

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const getDiagnose = (code: string) => {
  return diagnoses.find((d) => d.code === code);
};

export default {
  getDiagnoses,
  getDiagnose,
};
