import {v1 as uuid} from 'uuid';
import patients from '../../data/patients';
import { PatientWithoutId, Patient, PatientWithoutSsn } from '../types';
import toNewPatientEntry from '../utils';

const getEntriesWithoutSsn = (): PatientWithoutSsn[] => {
  return patients.map(patient => {
    const {name, dateOfBirth, gender, occupation} = toNewPatientEntry(patient);
    return {
      name, dateOfBirth, gender, occupation, id: patient.id
    };
  });
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