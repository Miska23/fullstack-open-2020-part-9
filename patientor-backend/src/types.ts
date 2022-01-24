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

interface Patient {
  id: string,
  name: string,
  dateOfBirth: string,
  ssn: string,
  gender: Gender,
  occupation: string,
}

type PatientWithoutSsn = Omit<Patient, "ssn">;

type PatientWithoutId = Omit<Patient, 'id'>;

export { Diagnose, Gender, Patient, PatientWithoutSsn, PatientWithoutId };