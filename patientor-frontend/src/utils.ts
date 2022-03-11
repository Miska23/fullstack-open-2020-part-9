import { Patient } from "./types";

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
