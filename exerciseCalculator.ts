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

const parseExerciseArguments = (args: Array<string>): Array<number> | undefined => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const exerciseArguments = args.slice(2)
  if (exerciseArguments.every(arg => !isNaN(Number(arg)))) {
    return exerciseArguments.map(arg => Number(arg));
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

const calculateExercises = (arguments: number[]): void => {
  const target = arguments[0]
  const exerciseArguments = arguments.slice(1)
  const totalHours = exerciseArguments.reduce((acc, curr) => acc + curr, 0)
  const trainingDays = exerciseArguments.filter(exHours => exHours !== 0).length
  const average = totalHours / exerciseArguments.length
  let ratingDescription: RatingDescription = RatingDescription.Bad
  let rating = 1
  if (average >= target) {
    ratingDescription = RatingDescription.Good
    rating = 3
  } else if (average >= (target / 2)) {
    ratingDescription = RatingDescription.OK
    rating = 2
  }

  console.log({
    periodLength: exerciseArguments.length,
    trainingDays,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average
  })
}

try {
  const exerciseHours = parseExerciseArguments(process.argv)
  calculateExercises(exerciseHours)
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}