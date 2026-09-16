interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export interface ExerciseValues {
  target: number;
  exerciseDays: number[];
}

export const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const numericArgs = args.slice(2).map(Number);
  if (numericArgs.some(isNaN)) {
    throw new Error("Provided values are not numbers");
  }

  const [target, ...exerciseDays] = numericArgs;
  return { target, exerciseDays };
};

export const calculateExercises = (values: ExerciseValues): Result => {
  const { target, exerciseDays } = values;
  let trainingDays: number = 0;
  let exerciseSum = 0;
  let rating = 1;
  let ratingDescription = "really bad";
  exerciseDays.forEach((hours) => {
    if (hours > 0) trainingDays++;
    exerciseSum += hours;
  });
  const averageTime = exerciseSum / exerciseDays.length;
  if (averageTime >= target) {
    rating = 3;
    ratingDescription = "really good";
  } else if (averageTime > target / 2) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  }
  return {
    periodLength: exerciseDays.length,
    trainingDays: trainingDays,
    success: averageTime > target,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: averageTime,
  };
};

try {
  if (process.argv[1] === import.meta.filename) {
    const values = parseExerciseArguments(process.argv);
    console.log(calculateExercises(values));
  }
} catch (error: unknown) {
  let errorMessage = "Something bad happend.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
