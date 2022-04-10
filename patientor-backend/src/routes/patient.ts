import express from 'express';
import { getPublicEntries, addPatient, findById, addEntryToPatient } from '../services/patientService';
import { toNewEntry, toNewPatientEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(getPublicEntries());
});

router.get('/:id', (req, res) => {
  const patient = findById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send('Patient not found');
  }
});

router.post('/', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    } else {
      res.status(400).send('Unknown error occured');
    }
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newEntry = toNewEntry(req.body);
    const addedEntry = addEntryToPatient(newEntry, req.params.id);
    res.json(addedEntry);
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    } else {
      res.status(400).send('Unknown error occured');
    }
  }
});

export default router;