type BmiResult = 'Underweight' | 'Normal' | 'Overweight'

interface BmiInput {
  heightInCm: number;
  weight: number;
}

const parseBmiArguments = (args: Array<string>): BmiInput => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      heightInCm: Number(args[2]),
      weight: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const calculateBmi = (heightInCm: number, weight: number): void => {
  const heightInM = heightInCm / 100
  const bmi = Number((weight / Math.pow(heightInM, 2)).toFixed(1))

  let resultText: BmiResult;
  if (bmi <= 18.4) {
    resultText = 'Underweight'
  } else if (bmi > 18.4 && bmi < 24.9){
    resultText = 'Normal'
  } else {
    resultText = 'Overweight'
  }
 console.log(resultText)
}

try {
  const {heightInCm, weight} = parseBmiArguments(process.argv)
  calculateBmi(heightInCm, weight)
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}