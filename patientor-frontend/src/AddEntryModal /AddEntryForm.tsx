import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { HealthCheckEntry, HealthCheckRating, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import { useStateValue } from "../state";
import { TextField, DiagnosisSelection, EntryTypeSelection, NumberField } from "../AddPatientModal/FormField";
import { assertNever, isValidHealthCheckRating, isValidDate } from "../utils";

interface Props {
  onSubmit: (values: FormValues) => void;
  onCancel: () => void;
}

type HospitalEntryFormValues = Omit<HospitalEntry, 'id' | 'discharge'> & {
  dischargeDate: string,
  dischargeCriteria: string,
};

type OccupationalHealthcareFormValues = Omit<OccupationalHealthcareEntry, 'id' | 'sickLeave'> & {
  sickLeaveStartDate: string,
  sickLeaveEndDate: string,
};

export type FormValues = HospitalEntryFormValues | OccupationalHealthcareFormValues | Omit<HealthCheckEntry, 'id'>;

export const AddEntryForm = ({ onSubmit, onCancel } : Props ) => {
  const [{ diagnoses }] = useStateValue();

  const renderTypeDependentFields = (values: FormValues): JSX.Element | null => {
    switch (values.type) {
    case "Hospital":
      return (
        <>
          <Field
            label="Discharge Date"
            placeholder="YYYY-MM-DD"
            name="dischargeDate"
            component={TextField}
          />
          <Field
            label="Discharge Criteria"
            placeholder="Discharge Criteria"
            name="dischargeCriteria"
            component={TextField}
          />
        </>
      );
    case "HealthCheck":
      return (
        <Field
          label="Health Check Rating"
          name="healthCheckRating"
          min={HealthCheckRating.Healthy}
          max={HealthCheckRating.CriticalRisk}
          component={NumberField}
        />
      );
    case "OccupationalHealthcare":
      return (
        <>
          <Field
            label="Employer Name"
            placeholder="Employer Name"
            name="employerName"
            component={TextField}
          />
          <Field
            label="Sick leave start date"
            placeholder="YYYY-MM-DD"
            name="sickLeaveStartDate"
            component={TextField}
          />
          <Field
            label="Sick leave end date"
            placeholder="YYYY-MM-DD"
            name="sickLeaveEndDate"
            component={TextField}
          />
          <Field
            label="Health Check Rating"
            name="healthCheckRating"
            min={HealthCheckRating.Healthy}
            max={HealthCheckRating.CriticalRisk}
            component={NumberField}
          />
        </>
      );
    
    default:
      assertNever(values);
      return null;
    }
  };

  type FieldErrors = { [field: string]: string };

  const validate = (values: FormValues): FieldErrors => {
    const requiredError = "Field is required";
    const malformattedDateError = "Invalid date";
    const malformattedNumberError = "Invalid value. Valid values are 0 - 3";
    const errors: FieldErrors = {};

    if (!values.description) {
      errors.description = requiredError;
    }

    if (!values.specialist) {
      errors.specialist = requiredError;
    }

    if (!isValidDate(values.date)) {
      errors.date = malformattedDateError;
    }

    if (!values.date) {
      errors.date = requiredError;
    }

    switch (values.type) {
    case "Hospital":
      if (!isValidDate(values.dischargeDate)) {
        errors.dischargeDate = malformattedDateError;
      }
      if (!values.dischargeDate) {
        errors.dischargeDate = requiredError;
      }
      if (!values.dischargeCriteria) {
        errors.dischargeCriteria = requiredError;
      }
  
      break;
    case "HealthCheck":
      if (!isValidHealthCheckRating(values.healthCheckRating)) {
        errors.healthCheckRating = malformattedNumberError;
      }
      break;
    case "OccupationalHealthcare":
      if (values.healthCheckRating !== undefined && !isValidHealthCheckRating(values.healthCheckRating)) {
        errors.healthCheckRating = malformattedNumberError;
      }

      if (!values.employerName) {
        errors.employerName = requiredError;
      }

      if (values.sickLeaveStartDate && !isValidDate(values.sickLeaveStartDate)) {
        errors.sickLeaveStartDate = malformattedDateError;
      }

      if (values.sickLeaveEndDate && !values.sickLeaveStartDate) {
        errors.sickLeaveStartDate = requiredError;
      }

      if (values.sickLeaveEndDate && !isValidDate(values.sickLeaveEndDate)) {
        errors.sickLeaveEndDate = malformattedDateError;
      }

      if (values.sickLeaveStartDate && !values.sickLeaveEndDate) {
        errors.sickLeaveEndDate = requiredError;
      }

      break;
    default:
      assertNever(values);
      break;
    }
    return errors; 
  };

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        type: "Hospital",
        dischargeCriteria: "",
        dischargeDate: "",
      }}
      onSubmit={onSubmit}
      validate={values => validate(values)}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values, initialValues  }) => {        
        return (
          <Form className="form ui">
            <EntryTypeSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              entryTypes={["Hospital", "HealthCheck", "OccupationalHealthcare"]}
              initialValues={initialValues}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            {renderTypeDependentFields(values)}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
