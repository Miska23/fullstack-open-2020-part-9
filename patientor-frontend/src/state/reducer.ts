import { State } from "./state";
import { Diagnosis, Entry, Patient, PublicPatient } from "../types";

export type Action =
  | {
      type: "SET_PATIENT_LIST";
      payload: PublicPatient[];
    }
  | {
      type: "UPDATE_PATIENT_LIST";
      payload: Patient;
    }
  | {
      type: "ADD_PATIENT";
      payload: Patient;
    }
  | {
      type: "ADD_ENTRY_TO_PATIENT";
      payload: AddEntryPayload;
    }
  | {
      type: "SET_DIAGNOSIS_LIST";
      payload: Diagnosis[];
    };

export type AddEntryPayload = Pick<Patient, 'id'> & {entry: Entry};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
  case "SET_PATIENT_LIST":
    return {
      ...state,
      patients: {
        ...action.payload.reduce(
          (memo, patient) => ({ ...memo, [patient.id]: patient }),
          {}
        ),
        ...state.patients
      }
    };
  case "UPDATE_PATIENT_LIST":
    return {
      ...state,
      patients: {
        ...state.patients,
        [action.payload.id]: {...state.patients[action.payload.id], ssn: action.payload.ssn, entries: action.payload.entries}
      }
    };
  case "ADD_PATIENT":
    return {
      ...state,
      patients: {
        ...state.patients,
        [action.payload.id]: action.payload
      }
    };
  case "ADD_ENTRY_TO_PATIENT":
    return {
      ...state,
      patients: {
        ...state.patients,
        [action.payload.id]: {...state.patients[action.payload.id], entries: [...state.patients[action.payload.id].entries, action.payload.entry]}
      }
    };
  case "SET_DIAGNOSIS_LIST":
    return {
      ...state,
      diagnoses: {
        ...action.payload.reduce(
          (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
          {}
        ),
        ...state.diagnoses
      }
    };
  default:
    return state;
  }
};

export const setPatientList = (payload: PublicPatient[]): Action => {
  return({ type: "SET_PATIENT_LIST", payload });
};

export const updatePatientList = (payload: Patient): Action => {
  return({ type: "UPDATE_PATIENT_LIST", payload });
};

export const addPatient = (payload: Patient): Action => {
  return({ type: "ADD_PATIENT", payload });
};

export const setDiagnosisList = (payload: Diagnosis[]): Action => {
  return({ type: "SET_DIAGNOSIS_LIST", payload });
};

export const addEntryToPatient = (payload: AddEntryPayload): Action => {
  return({ type: "ADD_ENTRY_TO_PATIENT", payload });
};