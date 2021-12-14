import express from 'express';
import { BmiInput, calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());
interface BmiQuery {
  height: string,
  weight: string,
}

interface BaseExerciseBody {
  daily_exercises: unknown
  target: unknown,
}
interface ExerciseBody {
  daily_exercises: Array<number>
  target: number,
}

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

app.get('/bmi', (req, res) => {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isBaseExerciseBody = (body: any): body is BaseExerciseBody => {
  if (body) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const {daily_exercises, target} = body;
    return daily_exercises !== undefined && target !== undefined;
  } else {
    return false;
  }
};

const isExerciseBody = (body: BaseExerciseBody): body is ExerciseBody => {
  const {daily_exercises, target} = body;
  return Array.isArray(daily_exercises) && daily_exercises.every(d => typeof d === "number") && typeof target === "number";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseExerciseBody = (body: any): Array<number> =>  {
  if (isBaseExerciseBody(body)) {
    if (isExerciseBody(body)) {
      return([body.target, ...body.daily_exercises]);
    } else {
      throw new Error("malformatted parameters");
    }
  } else {
    throw new Error("parameters missing");
  }
};

app.post('/exercises', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exerciseArgs = parseExerciseBody(req.body);     // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    res.json(calculateExercises(exerciseArgs));
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