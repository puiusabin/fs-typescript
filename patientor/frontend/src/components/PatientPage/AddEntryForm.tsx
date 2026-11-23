import { useEffect, useState, SyntheticEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import {
  Diagnosis,
  Entry,
  EntryWithoutId,
  HealthCheckRating,
} from "../../types";
import diagnoseService from "../../services/diagnoses";

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

const ratingOptions = Object.entries(HealthCheckRating).map(
  ([label, value]) => ({ label, value }),
);

const isHealthCheckRating = (value: number): value is HealthCheckRating =>
  Object.values(HealthCheckRating).some((rating) => rating === value);

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry type: ${JSON.stringify(value)}`);
};

const dateLabelProps = { inputLabel: { shrink: true } };

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const [entryType, setEntryType] = useState<EntryType>("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  // HealthCheck
  const [rating, setRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy,
  );
  // Hospital
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  // OccupationalHealthcare
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  useEffect(() => {
    diagnoseService.getAll().then(setDiagnoses);
  }, []);

  const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
    const type = entryTypes.find((t) => t === event.target.value);
    if (type) {
      setEntryType(type);
    }
  };

  const onRatingChange = (event: SelectChangeEvent<number>) => {
    const value = Number(event.target.value);
    if (isHealthCheckRating(value)) {
      setRating(value);
    }
  };

  const onDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setDiagnosisCodes(typeof value === "string" ? value.split(",") : value);
  };

  const buildEntry = (): EntryWithoutId => {
    const base = {
      description,
      date,
      specialist,
      ...(diagnosisCodes.length > 0 && { diagnosisCodes }),
    };

    switch (entryType) {
      case "HealthCheck":
        return { ...base, type: "HealthCheck", healthCheckRating: rating };
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
    onSubmit(buildEntry());
  };

  // Either both sick leave dates are given or neither
  const sickLeaveRequired = sickLeaveStart !== "" || sickLeaveEnd !== "";

  return (
    <Box
      component="form"
      onSubmit={addEntry}
      sx={{ border: "1px dashed grey", padding: 2, marginBottom: 2 }}
    >
      <Typography variant="h6">New {entryType} entry</Typography>

      <FormControl fullWidth margin="dense">
        <InputLabel id="entry-type-label">Entry type</InputLabel>
        <Select
          labelId="entry-type-label"
          label="Entry type"
          value={entryType}
          onChange={onEntryTypeChange}
        >
          {entryTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Description"
        required
        fullWidth
        margin="dense"
        value={description}
        onChange={({ target }) => setDescription(target.value)}
      />
      <TextField
        label="Date"
        type="date"
        required
        fullWidth
        margin="dense"
        slotProps={dateLabelProps}
        value={date}
        onChange={({ target }) => setDate(target.value)}
      />
      <TextField
        label="Specialist"
        required
        fullWidth
        margin="dense"
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
      />

      <FormControl fullWidth margin="dense">
        <InputLabel id="diagnosis-codes-label">Diagnosis codes</InputLabel>
        <Select
          labelId="diagnosis-codes-label"
          multiple
          value={diagnosisCodes}
          onChange={onDiagnosisCodesChange}
          input={<OutlinedInput label="Diagnosis codes" />}
        >
          {diagnoses.map((d) => (
            <MenuItem key={d.code} value={d.code}>
              {d.code} {d.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {entryType === "HealthCheck" && (
        <FormControl fullWidth margin="dense">
          <InputLabel id="rating-label">Healthcheck rating</InputLabel>
          <Select
            labelId="rating-label"
            label="Healthcheck rating"
            value={rating}
            onChange={onRatingChange}
          >
            {ratingOptions.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {entryType === "Hospital" && (
        <>
          <TextField
            label="Discharge date"
            type="date"
            required
            fullWidth
            margin="dense"
            slotProps={{
              ...dateLabelProps,
              htmlInput: { min: date || undefined },
            }}
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
          />
          <TextField
            label="Discharge criteria"
            required
            fullWidth
            margin="dense"
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
          />
        </>
      )}

      {entryType === "OccupationalHealthcare" && (
        <>
          <TextField
            label="Employer name"
            required
            fullWidth
            margin="dense"
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
          />
          <TextField
            label="Sick leave start"
            type="date"
            required={sickLeaveRequired}
            fullWidth
            margin="dense"
            slotProps={{
              ...dateLabelProps,
              htmlInput: { max: sickLeaveEnd || undefined },
            }}
            value={sickLeaveStart}
            onChange={({ target }) => setSickLeaveStart(target.value)}
          />
          <TextField
            label="Sick leave end"
            type="date"
            required={sickLeaveRequired}
            fullWidth
            margin="dense"
            slotProps={{
              ...dateLabelProps,
              htmlInput: { min: sickLeaveStart || undefined },
            }}
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
