import { useParams } from "react-router-dom";
import type { Patient } from "../../types";
import { List, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import patientService from "../../services/patients";
import { Entry } from "../../types";
import Diagnose from "./diagnose";

const PatientPage = () => {
  const id = useParams().id;
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!id) return;
    patientService.getOne(id).then((value) => setPatient(value));
  }, []);

  console.log(patient);
  if (!patient) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography variant="body1">ssn: {patient.ssn}</Typography>
      <Typography variant="body1">occupation: {patient.occupation}</Typography>
      <Typography variant="body1">
        date of birth: {patient.dateOfBirth}
      </Typography>

      <Typography variant="h6">Entries</Typography>
      {patient.entries.map((entry: Entry) => (
        <div key={entry.id}>
          <Typography variant="body1">
            {entry.date} {entry.description}
          </Typography>
          <List>
            {entry.diagnosisCodes?.map((code: string) => (
              <Diagnose key={code} code={code} />
            ))}
          </List>
        </div>
      ))}
    </div>
  );
};

export default PatientPage;
