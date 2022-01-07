import express from 'express';

const router = express.Router();

enum RatingDescription {
  Bad = "You should definitely exercise more often",
  OK = "Not too bad but could be better",
  Good = "Keep up the good work",
}

interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: RatingDescription,
  target: number,
  average: number,
}

interface BaseExerciseBody {
  daily_exercises: unknown
  target: unknown,
}

interface ExerciseBody {
  daily_exercises: Array<number>
  target: number,
}

const parseExerciseArguments = (args: Array<string>): Array<number>  => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const exerciseArguments = args.slice(2);
  if (exerciseArguments.every(arg => !isNaN(Number(arg)))) {
    return exerciseArguments.map(arg => Number(arg));
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const calculateExercises = (targetValueAndExerciseHours: number[]): Result => {
  const target = targetValueAndExerciseHours[0];
  const exerciseArguments = targetValueAndExerciseHours.slice(1);
  const totalHours = exerciseArguments.reduce((acc, curr) => acc + curr, 0);
  const trainingDays = exerciseArguments.filter(exHours => exHours !== 0).length;
  const average = totalHours / exerciseArguments.length;
  let ratingDescription: RatingDescription = RatingDescription.Bad;
  let rating = 1;
  if (average >= target) {
    ratingDescription = RatingDescription.Good;
    rating = 3;
  } else if (average >= (target / 2)) {
    ratingDescription = RatingDescription.OK;
    rating = 2;
  }

  return {
    periodLength: exerciseArguments.length,
    trainingDays,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const exerciseHours = parseExerciseArguments(process.argv);
  calculateExercises(exerciseHours);
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

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

router.post('/', (req, res) => {
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

export default router;