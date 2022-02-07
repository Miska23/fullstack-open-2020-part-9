interface Diagnose {
  code: string,
  name: string,
  latin?: string,
}

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Entry {
}

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

export { Diagnose, Gender, Patient, PublicPatient, PatientWithoutId };