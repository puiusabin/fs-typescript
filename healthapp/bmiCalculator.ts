type BmiCategory = "Underweight" | "Normal range" | "Overweight" | "Obese";

const calculateBmi = (heightCm: number, weightKg: number): BmiCategory => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi < 25) {
    return "Normal range";
  } else if (bmi < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
};

console.log(calculateBmi(180, 74));
