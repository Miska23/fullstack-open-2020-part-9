interface Diagnosis {
  code: string,
  name: string,
  latin?: string,
}

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

enum HealthCheckRating {
  Healthy = 0,
  LowRisk = 1,
  HighRisk = 2,
  CriticalRisk = 3
}

interface SickLeave {
  startDate: string;
  endDate: string;
}

interface Discharge {
  date: string;
  criteria: string;
}

interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  healthCheckRating?: HealthCheckRating;
  sickLeave?: SickLeave;
}

interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

// Define special omit for unions
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

type Entry =
| HospitalEntry
| OccupationalHealthcareEntry
| HealthCheckEntry;

// Define Entry without the 'id' property
type EntryWithoutId = UnionOmit<Entry, 'id'>;

interface Patient {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string,
  entries: Entry[],
}

type PublicPatient = Omit<Patient, 'ssn' | 'entries'>;

type PatientWithoutId = Omit<Patient, 'id'>;

export { 
  Diagnosis, 
  Gender, 
  Patient, 
  PublicPatient, 
  PatientWithoutId,
  EntryWithoutId,
  Entry,
  OccupationalHealthcareEntry,
  HospitalEntry,
  HealthCheckRating,
  BaseEntry
};