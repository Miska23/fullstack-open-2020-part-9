import {v1 as uuid} from 'uuid';
import patients from '../../data/patients';
import { PatientWithoutId, Patient, PublicPatient } from '../types';
import toNewPatientEntry from '../utils';

const getPublicEntries = (): PublicPatient[] => {
  return patients.map(patient => {
    const {name, dateOfBirth, gender, occupation} = toNewPatientEntry(patient);
    return {
      name, dateOfBirth, gender, occupation, id: patient.id
    };
  });
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find(d => d.id === id);
  if (patient) {
    const {name, dateOfBirth, gender, occupation, entries, ssn} = toNewPatientEntry(patient);
    return {
      name, dateOfBirth, gender, occupation, id: patient.id, entries, ssn,
    };
  } else {
    return undefined;
  }
};

const addPatient = (entry: PatientWithoutId): Patient => {
  const id = uuid();
  const newPatientEntry: Patient = {
    id,
    ...entry
  };
  (patients as Patient[]).push(newPatientEntry);
  return newPatientEntry;
};

export {
  getPublicEntries,
  addPatient,
  findById
};