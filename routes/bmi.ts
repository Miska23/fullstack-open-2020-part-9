import express from 'express';

const router = express.Router();

interface BmiQuery {
  height: string,
  weight: string,
}

type BmiResult = 'Underweight' | 'Normal' | 'Overweight';

interface BmiInput {
  heightInCm: number;
  weight: number;
}

const calculateBmi = (heightInCm: number, weight: number): BmiResult => {
  const heightInM = heightInCm / 100;
  const bmi = Number((weight / Math.pow(heightInM, 2)).toFixed(1));

  let resultText: BmiResult;
  if (bmi <= 18.4) {
    resultText = 'Underweight';
  } else if (bmi > 18.4 && bmi < 24.9){
    resultText = 'Normal';
  } else {
    resultText = 'Overweight';
  }
 return resultText;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isBmiQuery = (query: any): query is BmiQuery => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {height, weight} = query;
  return height !== undefined && weight !== undefined;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseBmiQuery = (query: any): BmiInput =>  {
  if (isBmiQuery(query)) {
    if (query.height && !isNaN(Number(query.height)) && query.weight && !isNaN(Number(query.weight))) {
      return {
        heightInCm: Number(query.height),
        weight: Number(query.weight),
      };
    } else {
      throw new Error('Query strings were not numbers!');
    }
  } else {
    throw new Error('Invalid query string format!');
  }
};

router.get('/', (req, res) => {
  try {
    const {heightInCm, weight} = parseBmiQuery(req.query);
    res.json({weight, height: heightInCm, bmi: calculateBmi(heightInCm, weight)});
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;