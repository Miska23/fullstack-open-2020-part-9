import { Entry, HealthCheckEntry, OccupationalHealthcareEntry, Patient } from "./types";

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
