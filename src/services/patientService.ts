import {v1 as uuid} from 'uuid';
import patients from '../../data/patients';
import { PatientWithoutId, Patient, PatientWithoutSsn } from '../types';

const getEntriesWithoutSsn = (): PatientWithoutSsn[] => {
  return patients.map(({id, name, dateOfBirth, gender, occupation }) => ({id, name, dateOfBirth, gender, occupation}));
};

const addPatient = (entry: PatientWithoutId): Patient => {
  const id = uuid();

  const newPatientEntry: Patient = {
    id,
    ...entry
  };

  patients.push(newPatientEntry);

  return newPatientEntry;
};

export {
  getEntriesWithoutSsn,
  addPatient
};