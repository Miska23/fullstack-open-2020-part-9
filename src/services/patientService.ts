import patients from '../../data/patients';
import { PatientWithoutSsn } from '../types';

const getEntriesWithoutSsn = (): PatientWithoutSsn[] => {
  return patients.map(({id, name, dateOfBirth, gender, occupation }) => ({id, name, dateOfBirth, gender, occupation}));
};

export default {
  getEntriesWithoutSsn,
};