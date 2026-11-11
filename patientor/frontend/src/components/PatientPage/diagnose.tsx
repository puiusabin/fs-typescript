import { useEffect, useState } from "react";
import diagnoseService from "../../services/diagnoses";
import { Diagnosis } from "../../types";
import { ListItem, ListItemText } from "@mui/material";

const Diagnose = ({ code }: { code: string }) => {
  const [diagnose, setDiagnose] = useState<Diagnosis | null>(null);
  useEffect(() => {
    diagnoseService.getOne(code).then((d) => setDiagnose(d));
  }, [code]);

  if (!diagnose) {
    return;
  }
  return (
    <ListItem>
      <ListItemText>
        {code} {diagnose.name}
      </ListItemText>
    </ListItem>
  );
};

export default Diagnose;
