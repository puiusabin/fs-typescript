type BmiCategory = "Underweight" | "Normal range" | "Overweight" | "Obese";
interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values are not numbers");
  }
};

const calculateBmi = (heightCm: number, weightKg: number): BmiCategory => {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error("Height and weight must be positive numbers");
  }

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

try {
  if (process.argv[1] === import.meta.filename) {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  }
} catch (error: unknown) {
  let errorMessage = "Something bad happend.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

export default calculateBmi;
