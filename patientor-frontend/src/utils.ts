import { FormValues } from "./AddEntryModal /AddEntryForm";
import { Entry, EntryWithoutId, HealthCheckEntry, HealthCheckRating, OccupationalHealthcareEntry, Patient } from "./types";

/**
 * Helper function for exhaustive type checking
 */
export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const isCompletePatientEntry = ({ssn, entries}: Patient): boolean => {
  return ssn !== undefined && entries !== undefined;
};

export const isOccupationalHealthcareEntry = (entry: Entry): entry is OccupationalHealthcareEntry => {
  return entry.type === 'OccupationalHealthcare';
};

export const isHealthCheckEntry = (entry: Entry): entry is HealthCheckEntry => {
  return entry.type === 'HealthCheck';
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const isValidDate = (date: unknown): boolean => {
  let check = true;
  if (!date || !isString(date) || !isDate(date)) {
    check = false;
  }
  return check;
};

export const isValidHealthCheckRating = (param: unknown): boolean => {  
  return typeof param === 'number' && Object.values(HealthCheckRating).some(value =>  value === param);
};

export const parseFormValuesIntroEntry = (values: FormValues): EntryWithoutId => {
  switch (values.type) {
  case "Hospital":
    const {dischargeCriteria, dischargeDate, ...rest} = values;
    return {
      ...rest,
      discharge: {
        date: dischargeDate,
        criteria: dischargeCriteria
      }
    };  

  case "HealthCheck":
    return values;  

  case "OccupationalHealthcare": 
    const {sickLeaveEndDate, sickLeaveStartDate, ...rest2} = values;
    const requiredValues = rest2;
    return sickLeaveEndDate !== undefined && sickLeaveStartDate !== undefined 
      ?
      {
        ...requiredValues,
        sickLeave: {
          startDate: sickLeaveStartDate,
          endDate: sickLeaveEndDate
        }
      }
      :
      requiredValues;
  default:
    return assertNever(values);
  }
};
