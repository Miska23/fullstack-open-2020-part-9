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

const TARGET = 2

const calculateExercises = (dailyExerciseHours: number[]): Result | undefined => {
  const totalHours = dailyExerciseHours.reduce((acc, curr) => acc + curr, 0)
  const trainingDays=  dailyExerciseHours.filter(exHours => exHours !== 0).length
  const average = totalHours / dailyExerciseHours.length
  let ratingDescription: RatingDescription = RatingDescription.Bad
  let rating = 1
  if (average >= TARGET) {
    ratingDescription = RatingDescription.Good
    rating = 3
  } else if (average >= (TARGET / 2)) {
    ratingDescription = RatingDescription.OK
    rating = 2
  }

  return {
    periodLength: 7,
    trainingDays,
    success: average >= TARGET,
    rating,
    ratingDescription,
    target: TARGET,
    average
  }
}

try {
  console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1]))
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.'
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}