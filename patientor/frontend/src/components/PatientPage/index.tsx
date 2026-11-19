import { useParams } from "react-router-dom";
import type { Entry, EntryWithoutId, Patient } from "../../types";
import { Alert, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryForm from "./AddEntryForm";

interface ZodIssue {
  path: Array<string | number>;
  message: string;
}

const errorMessage = (e: unknown): string => {
  if (axios.isAxiosError<{ error?: string | ZodIssue[] }>(e)) {
    const error = e.response?.data?.error;
    if (typeof error === "string") return error;
    if (error) {
      return error
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");
    }
  }
  return "Unknown error";
};

const PatientPage = () => {
  const id = useParams().id;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!id) return;
    patientService.getOne(id).then((value) => setPatient(value));
  }, [id]);

  if (!patient) {
    return <div>loading...</div>;
  }

  const closeForm = () => {
    setFormOpen(false);
    setError(undefined);
  };

  const submitEntry = async (values: EntryWithoutId) => {
    try {
      const entry = await patientService.addEntry(patient.id, values);
      setPatient({ ...patient, entries: patient.entries.concat(entry) });
      closeForm();
    } catch (e: unknown) {
      setError(errorMessage(e));
    }
  };

  return (
    <div>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography variant="body1">ssn: {patient.ssn}</Typography>
      <Typography variant="body1">occupation: {patient.occupation}</Typography>
      <Typography variant="body1">
        date of birth: {patient.dateOfBirth}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {formOpen ? (
        <AddEntryForm onSubmit={submitEntry} onCancel={closeForm} />
      ) : (
        <Button variant="contained" onClick={() => setFormOpen(true)}>
          Add new entry
        </Button>
      )}

      <Typography variant="h6">Entries</Typography>
      {patient.entries.map((entry: Entry) => (
        <EntryDetails entry={entry} key={entry.id} />
      ))}
    </div>
  );
};

export default PatientPage;
