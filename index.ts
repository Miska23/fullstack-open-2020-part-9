import express from 'express';
import { BmiInput, calculateBmi } from './bmiCalculator';


const app = express();

interface BmiQuery {
  height: string,
  weight: string,
}

const isBmiQuery = (query: any): query is BmiQuery => {
  const {height, weight} = query
  return height !== undefined && weight !== undefined
}

const parseQuery = (query: any): BmiInput =>  {
  if (isBmiQuery(query)) {
    if (query.height && !isNaN(Number(query.height)) && query.weight && !isNaN(Number(query.weight))) {
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

app.get('/bmi', (req, res) => {
  try {
    const {heightInCm, weight} = parseQuery(req.query)
    res.json({weight, height: heightInCm, bmi: calculateBmi(heightInCm, weight)})
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