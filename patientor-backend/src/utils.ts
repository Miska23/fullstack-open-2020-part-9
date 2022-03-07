import { Entry, Gender, PatientWithoutId } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (value: unknown): string => {
  if (!value || !isString(value)) {
    throw new Error('Incorrect or missing value in request body');
  }
  return value;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error('Incorrect or missing date of birth: ' + dateOfBirth);
  }
  return dateOfBirth;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).find(value => param === value) ? true : false;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryType = (param: any): param is Pick<Entry, "type"> => {
  return param === "HealthCheck" || param === "OccupationalHealthcare" || param === "Hospital";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryArray = (param: any[]): param is Entry[] => {
  return param.length === 0 || param.every(p => p.type !== undefined && isEntryType(p.type));
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!Array.isArray(entries) || !isEntryArray(entries)) {
    throw new Error('Incorrect or missing entries: ' + JSON.stringify(entries));
  }
  return entries;
};

type ExpectedRequestBody = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown, entries: unknown };

const toNewPatientEntry = ({ name, dateOfBirth, ssn, gender, occupation, entries }: ExpectedRequestBody): PatientWithoutId => {
  const newEntry: PatientWithoutId = {
    name: parseString(name),
    dateOfBirth: parseDateOfBirth(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: parseEntries(entries)
  };
  return newEntry;
};

export default toNewPatientEntry;
