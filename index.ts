import express from 'express';
import bmiRouter from './routes/bmi';
import exerciseRouter from './routes/exercises';

const app = express();

app.use(express.json());

app.use('/bmi', bmiRouter);

app.use('/exercises', exerciseRouter);

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});