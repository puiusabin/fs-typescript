import { useState, SyntheticEvent } from "react";
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Entry, EntryWithoutId, HealthCheckRating } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
}

type EntryType = Entry["type"];

const entryTypes: EntryType[] = [
  "HealthCheck",
  "Hospital",
  "OccupationalHealthcare",
];

const isHealthCheckRating = (value: number): value is HealthCheckRating =>
  Object.values(HealthCheckRating).some((rating) => rating === value);

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");

  // HealthCheck
  const [rating, setRating] = useState("");
  // Hospital
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  // OccupationalHealthcare
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  const parsedRating = Number(rating);
  const ratingValid = rating.trim() !== "" && isHealthCheckRating(parsedRating);

  const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
    const type = entryTypes.find((t) => t === event.target.value);
    if (type) {
      setEntryType(type);
    }
  };

  const buildEntry = (): EntryWithoutId | null => {
    const codes = diagnosisCodes
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code !== "");

    const base = {
      description,
      date,
      specialist,
      ...(codes.length > 0 && { diagnosisCodes: codes }),
    };

    switch (entryType) {
      case "HealthCheck":
        return rating.trim() !== "" && isHealthCheckRating(parsedRating)
          ? { ...base, type: "HealthCheck", healthCheckRating: parsedRating }
          : null;
      case "Hospital":
        return {
          ...base,
          type: "Hospital",
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
      case "OccupationalHealthcare":
        return {
          ...base,
          type: "OccupationalHealthcare",
          employerName,
          ...(sickLeaveStart || sickLeaveEnd
            ? { sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd } }
            : {}),
        };
      default:
        return assertNever(entryType);
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const entry = buildEntry();
    if (entry) {
      onSubmit(entry);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={addEntry}
      sx={{ border: "1px dashed grey", padding: 2, marginBottom: 2 }}
    >
      <Typography variant="h6">New {entryType} entry</Typography>

      <InputLabel sx={{ marginTop: 1 }}>Entry type</InputLabel>
      <Select fullWidth value={entryType} onChange={onEntryTypeChange}>
        {entryTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </Select>

      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={({ target }) => setDescription(target.value)}
      />
      <TextField
        label="Date"
        placeholder="YYYY-MM-DD"
        fullWidth
        value={date}
        onChange={({ target }) => setDate(target.value)}
      />
      <TextField
        label="Specialist"
        fullWidth
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
      />
      <TextField
        label="Diagnosis codes"
        placeholder="Z57.1, N30.0"
        fullWidth
        value={diagnosisCodes}
        onChange={({ target }) => setDiagnosisCodes(target.value)}
      />

      {entryType === "HealthCheck" && (
        <TextField
          label="Healthcheck rating"
          placeholder="0-3"
          fullWidth
          value={rating}
          error={rating !== "" && !ratingValid}
          helperText={
            rating !== "" && !ratingValid ? "Must be 0, 1, 2 or 3" : ""
          }
          onChange={({ target }) => setRating(target.value)}
        />
      )}

      {entryType === "Hospital" && (
        <>
          <TextField
            label="Discharge date"
            placeholder="YYYY-MM-DD"
            fullWidth
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
          />
          <TextField
            label="Discharge criteria"
            fullWidth
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
          />
        </>
      )}

      {entryType === "OccupationalHealthcare" && (
        <>
          <TextField
            label="Employer name"
            fullWidth
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
          />
          <TextField
            label="Sick leave start"
            placeholder="YYYY-MM-DD (optional)"
            fullWidth
            value={sickLeaveStart}
            onChange={({ target }) => setSickLeaveStart(target.value)}
          />
          <TextField
            label="Sick leave end"
            placeholder="YYYY-MM-DD (optional)"
            fullWidth
            value={sickLeaveEnd}
            onChange={({ target }) => setSickLeaveEnd(target.value)}
          />
        </>
      )}

      <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
        <Grid size="auto">
          <Button
            color="secondary"
            variant="contained"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
        <Grid size="auto">
          <Button type="submit" variant="contained">
            Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddEntryForm;
