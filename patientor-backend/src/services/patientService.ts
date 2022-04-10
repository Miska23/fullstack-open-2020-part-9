import {v1 as uuid} from 'uuid';
import patients from '../../data/patients';
import { PatientWithoutId, Patient, PublicPatient, EntryWithoutId, Entry } from '../types';
import { toNewPatientEntry } from '../utils';

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
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntryToPatient = (entry: EntryWithoutId, patientId: string): void => {
  
  const patientToUpdate = patients.find(p => p.id === patientId);
  
  if (patientToUpdate) {
    const id = uuid();
    const newEntry: Entry = {
      id,
      ...entry
    };
    patientToUpdate.entries.push(newEntry);
  } else {
    throw new Error("No patient found with id: " + patientId);    
  }
};

export {
  getPublicEntries,
  addPatient,
  addEntryToPatient,
  findById
};