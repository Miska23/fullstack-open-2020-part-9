type BmiResult = 'Underweight' | 'Normal' | 'Overweight'

const calculateBmi = (heightInCm: number, weight: number): void => {
  const heightInM = heightInCm / 100
  const bmi = Number((weight / Math.pow(heightInM, 2)).toFixed(1))
  console.log(bmi)

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

calculateBmi(110, 92)