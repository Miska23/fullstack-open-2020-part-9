import { BaseEntry, Entry, EntryWithoutId, Gender, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry, PatientWithoutId } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (value: unknown): string => {
  if (!value || !isString(value)) {
    throw new Error('Incorrect or missing string value: ' + value);
  }
  return value;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date value: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).find(value => param === value) ? true : false;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender value: ' + gender);
  }
  return gender;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {  
  return typeof param === 'number' && Object.values(HealthCheckRating).some(value =>  value === param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {  
  if (!isHealthCheckRating(rating)) {
    throw new Error('Incorrect or missing health check rating value: ' + rating);
  }
  return rating;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryType = (param: any): param is Entry["type"] => {
  return param === "HealthCheck" || param === "OccupationalHealthcare" || param === "Hospital";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryArray = (param: any[]): param is Entry[] => {
  return param.length === 0 || param.every(p => p.type !== undefined && isEntryType(p.type));
};

const parseEntries = (entries: unknown): Entry[] => {
  if (!Array.isArray(entries) || !isEntryArray(entries)) {
    throw new Error('Incorrect or missing entries array: ' + JSON.stringify(entries));
  }
  return entries;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isStringArray = (array: any): array is string[] => {
  return Array.isArray(array) && Boolean(array.length) && array.every(item => item != null && typeof item === 'string');
};

const parseDiagnosisCodes = (codes: unknown): string[] | undefined => {
  /* Undefined is allowed value for diagnosis codes */
  if (codes !== undefined && !isStringArray(codes)) {
    throw new Error('Incorrect or missing diagnosis code array: ' + JSON.stringify(codes));
  }
  return codes;
};

const parseEntryType = (type: unknown): Entry['type'] => {
  if (!isEntryType(type)) {
    throw new Error('Incorrect or missing entry type value: ' + type);
  }
  return type;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDischarge = (param: any): param is HospitalEntry['discharge'] => {
  return param != null && isString(param.date) && isString(param.criteria);
};

const parseDischarge = (discharge: unknown): HospitalEntry['discharge'] => {
  if (!isDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge value: ' + JSON.stringify(discharge));
  }
  return discharge;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isSickLeave = (param: any): param is OccupationalHealthcareEntry['sickLeave'] => {
  return isString(param.startDate) && isString(param.endDate);
};

const parseSickLeave = (sickLeave: unknown):  OccupationalHealthcareEntry['sickLeave'] => {
  if (!isSickLeave(sickLeave)) {
    throw new Error('Incorrect or missing sick leave value: ' + JSON.stringify(sickLeave));
  }
  return sickLeave;
};

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

type ExpectedPatientRequestBody = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown, entries: unknown };

type ExpectedEntryRequestBody = { 
  description: unknown, 
  date: unknown, 
  specialist: unknown, 
  diagnosisCodes: unknown, 
  type: unknown,
  healthCheckRating: unknown,
  employerName: unknown,
  sickLeave: unknown,
  discharge: unknown,
};

type NewBaseEntryWithEntryType = Omit<BaseEntry, 'id'> & Pick<Entry, 'type'>;

const toNewPatientEntry = ({ name, dateOfBirth, ssn, gender, occupation, entries }: ExpectedPatientRequestBody): PatientWithoutId => {
  const newEntry: PatientWithoutId = {
    name: parseString(name),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn),
    gender: parseGender(gender),
    occupation: parseString(occupation),
    entries: parseEntries(entries)
  };
  return newEntry;
};

const toNewEntry = ({ 
  description, 
  date, 
  specialist, 
  diagnosisCodes, 
  type, 
  healthCheckRating, 
  discharge,
  employerName,
  sickLeave
}: ExpectedEntryRequestBody): EntryWithoutId => {

  const baseEntryWithEntryType: NewBaseEntryWithEntryType = {
    description: parseString(description),
    date: parseDate(date),
    specialist: parseString(specialist),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
    type: parseEntryType(type),
  };
    
  switch (baseEntryWithEntryType.type) {
  case 'HealthCheck':
    return {
      ...baseEntryWithEntryType,
      type: 'HealthCheck',
      healthCheckRating: parseHealthCheckRating(healthCheckRating)
    };

  case 'Hospital':
    return {
      ...baseEntryWithEntryType,
      type: 'Hospital',
      discharge: parseDischarge(discharge)
    };
    
  case 'OccupationalHealthcare':
    return {
      ...baseEntryWithEntryType,
      type: 'OccupationalHealthcare',
      healthCheckRating: parseHealthCheckRating(healthCheckRating),
      employerName: parseString(employerName),
      sickLeave: parseSickLeave(sickLeave)
    };    
  default:
    assertNever(baseEntryWithEntryType.type);
  }

  return baseEntryWithEntryType as EntryWithoutId;
};

export {
  toNewPatientEntry, 
  toNewEntry
};
