type BmiResult = 'Underweight' | 'Normal' | 'Overweight'

export interface BmiInput {
  heightInCm: number;
  weight: number;
}

export const calculateBmi = (heightInCm: number, weight: number): BmiResult => {
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
 return resultText
}