import express from "express";
import calculateBmi from "./bmiCalculator.ts";
import {
  calculateExercises,
  type ExerciseValues,
} from "./exerciseCalculator.ts";
const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height: number = Number(req.query.height);
  const weight: number = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: "malformatted parameters" });
    return;
  }

  res.json({ height, weight, bmi: calculateBmi(height, weight) });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (daily_exercises === undefined || target === undefined) {
    return res.status(400).json({ error: "parameters missing" });
  }
  if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.map(Number).some(isNaN) ||
    isNaN(Number(target))
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const validData: ExerciseValues = {
    target: Number(target),
    exerciseDays: daily_exercises.map(Number),
  };

  return res.json(calculateExercises(validData));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
