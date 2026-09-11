interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  exerciseDays: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const numericArgs = args.slice(2).map(Number);
  if (numericArgs.some(isNaN)) {
    throw new Error("Provided values are not numbers");
  }

  const [target, ...exerciseDays] = numericArgs;
  return { target, exerciseDays };
};

const calculateExercises = (exerciseDay: number[], target: number): Result => {
  let trainingDays: number = 0;
  let exerciseSum = 0;
  let rating = 1;
  let ratingDescription = "really bad";
  exerciseDay.forEach((hours) => {
    if (hours > 0) trainingDays++;
    exerciseSum += hours;
  });
  const averageTime = exerciseSum / exerciseDay.length;
  if (averageTime >= target) {
    rating = 3;
    ratingDescription = "really good";
  } else if (averageTime > target / 2) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  }
  return {
    periodLength: exerciseDay.length,
    trainingDays: trainingDays,
    success: averageTime > target,
    rating: rating,
    ratingDescription: ratingDescription,
    target: target,
    average: averageTime,
  };
};

try {
  const { target, exerciseDays } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(exerciseDays, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happend.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
