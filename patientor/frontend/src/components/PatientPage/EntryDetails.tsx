import { Typography } from "@mui/material";
import type { Entry } from "../../types";
import { MedicalServices } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WorkIcon from "@mui/icons-material/Work";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const assertNever = (value: never): never => {
  throw new Error(`Unhandled entry: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  const ratingColor = (rating: number) => {
    if (rating === 0) return "success";
    if (rating === 1 || rating === 2) return "warning";
    return "error";
  };

  switch (entry.type) {
    case "HealthCheck":
      return (
        <div style={{ border: "1px solid black" }}>
          <Typography variant="body1">
            {entry.date} <MedicalServices></MedicalServices>
          </Typography>
          <Typography variant="body1" component="em">
            {entry.description}
          </Typography>
          <div>
            <FavoriteIcon
              color={ratingColor(entry.healthCheckRating)}
            ></FavoriteIcon>
          </div>
          <Typography variant="body1">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div style={{ border: "1px solid black" }}>
          <Typography variant="body1">
            {entry.date} <WorkIcon></WorkIcon> {entry.employerName}
          </Typography>
          <Typography variant="body1" component="em">
            {entry.description}
          </Typography>
          <Typography variant="body1">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );
    case "Hospital":
      return (
        <div style={{ border: "1px solid black" }}>
          <Typography variant="body1">
            {entry.date} <LocalHospitalIcon />
          </Typography>
          <Typography variant="body1" component="em">
            {entry.description}
          </Typography>
          <Typography variant="body1">
            dischared on {entry.discharge.date}
          </Typography>
          <Typography variant="body1">{entry.discharge.criteria}</Typography>
          <Typography variant="body1">
            diagnose by {entry.specialist}
          </Typography>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryDetails;
