interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
