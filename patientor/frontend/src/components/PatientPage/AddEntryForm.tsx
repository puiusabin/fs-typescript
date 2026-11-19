import { useState, SyntheticEvent } from "react";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { EntryWithoutId, HealthCheckRating } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryWithoutId) => void;
}

const isHealthCheckRating = (value: number): value is HealthCheckRating =>
  Object.values(HealthCheckRating).some((rating) => rating === value);

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [rating, setRating] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");

  const parsedRating = Number(rating);
  const ratingValid = rating.trim() !== "" && isHealthCheckRating(parsedRating);

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!isHealthCheckRating(parsedRating) || rating.trim() === "") {
      return;
    }

    const codes = diagnosisCodes
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code !== "");

    onSubmit({
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating: parsedRating,
      ...(codes.length > 0 && { diagnosisCodes: codes }),
    });
  };

  return (
    <Box
      component="form"
      onSubmit={addEntry}
      sx={{ border: "1px dashed grey", padding: 2, marginBottom: 2 }}
    >
      <Typography variant="h6">New HealthCheck entry</Typography>
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
        label="Healthcheck rating"
        placeholder="0-3"
        fullWidth
        value={rating}
        error={rating !== "" && !ratingValid}
        helperText={rating !== "" && !ratingValid ? "Must be 0, 1, 2 or 3" : ""}
        onChange={({ target }) => setRating(target.value)}
      />
      <TextField
        label="Diagnosis codes"
        placeholder="Z57.1, N30.0"
        fullWidth
        value={diagnosisCodes}
        onChange={({ target }) => setDiagnosisCodes(target.value)}
      />

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
