import express from 'express';
import { BmiInput, calculateBmi } from './bmiCalculator';


const app = express();

interface BmiQuery {
  height: string,
  weight: string,
}

const isBmiQuery = (value: any): value is BmiQuery => {
  const {height, weight} = value
  return height !== undefined && weight !== undefined
}

const parseQuery = (query: any): BmiInput =>  {
  if (isBmiQuery(query)) {
    if (!isNaN(Number(query.height)) && !isNaN(Number(query.weight))) {
      return {
        heightInCm: Number(query.height),
        weight: Number(query.weight),
      }
    } else {
      throw new Error('Query strings were not numbers!');
    }
  } else {
    throw new Error('Invalid query string format!');
  }
}

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  try {
    const {heightInCm, weight} = parseQuery(req.query)
    console.log("parseQuery(req.query): ", parseQuery(req.query));

    res.json({bmi: calculateBmi(heightInCm, weight)})
  } catch (error) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});