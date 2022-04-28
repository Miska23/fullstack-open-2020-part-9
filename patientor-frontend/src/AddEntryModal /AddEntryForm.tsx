import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { EntryWithoutId, HealthCheckRating, HospitalEntry } from "../types";
import { useStateValue } from "../state";
import { TextField, DiagnosisSelection, EntryTypeSelection, NumberField } from "../AddPatientModal/FormField";
import { assertNever, isValidHealthCheckRating, isValidDate } from "../utils";

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

export type HospitalEntryFormValues = Omit<HospitalEntry, 'id' | 'discharge'> & {
  dischargeDate: string,
  dischargeCriteria: string,
};

export const AddEntryForm = ({ onSubmit, onCancel } : Props ) => {
  const [{ diagnoses }] = useStateValue();

  const renderTypeDependentFields = (values: EntryWithoutId): JSX.Element | null => {
    switch (values.type) {
    case "Hospital":
      return (
        <>
          <Field
            label="Discharge Date"
            placeholder="YYYY-MM-DD"
            name="discharge.date"
            component={TextField}
          />
          <Field
            label="Discharge Criteria"
            placeholder="Discharge Criteria"
            name="discharge.criteria"
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
            label="Sick leave start date"
            placeholder="YYYY-MM-DD"
            name="sickLeave.startDate"
            component={TextField}
          />
          <Field
            label="Sick leave end date"
            placeholder="YYYY-MM-DD"
            name="sickLeave.endDate"
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

  /* TODO: flatten object values and replace any with string */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type FieldErrors = { [field: string]: any };

  const validate = (values: EntryWithoutId): FieldErrors => {
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

    switch (values.type) {
    case "Hospital":
      if (!values.specialist) {
        errors.specialist = requiredError;
      }
      if (!isValidDate(values.discharge.date)) {
        errors.dischargeDate = malformattedDateError;
      }

      if (values.discharge) {
        errors.discharge = {};
        if (!isValidDate(values.discharge.date)) {
          errors.discharge.date = malformattedDateError;
        }
        if (!values.discharge.date) {
          errors.discharge.date = requiredError;
        }
        if (!values.discharge.criteria) {
          errors.discharge.criteria = requiredError;
        }
  
      }

      break;
    case "HealthCheck":
      if (!isValidHealthCheckRating(values.healthCheckRating)) {
        errors.healthCheckRating = malformattedNumberError;
      }
      break;
    case "OccupationalHealthcare":
      if (!isValidHealthCheckRating(values.healthCheckRating)) {
        errors.healthCheckRating = malformattedNumberError;
      }

      if (values.employerName ) {
        errors.employerName = requiredError;
      }

      if (values.sickLeave) {
        errors.sickLeave = {};
        if (values.sickLeave.startDate && !isValidDate(values.sickLeave.startDate)) {
          errors.sickLeave.startDate = malformattedDateError;
        }
        if (values.sickLeave.endDate && !values.sickLeave.startDate) {
          errors.sickLeave.startDate = requiredError;
        }
        if (values.sickLeave.startDate && !values.sickLeave.endDate) {
          errors.sickLeave.endDate = requiredError;
        }
        if (values.sickLeave.endDate && !isValidDate(values.sickLeave.endDate)) {
          errors.sickLeave.endDate = malformattedDateError;
        }
      }
      break;
    default:
      assertNever(values);
      break;
    }
    console.log('errors: ', errors);
    
    return errors; 
  };

  return (
    <Formik
      initialValues={{
        description: "",
        date: "",
        specialist: "",
        type: "Hospital",
        discharge: {
          date: "",
          criteria: ""
        }
      }}
      onSubmit={onSubmit}
      validate={values => validate(values)}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values  }) => {
        console.log('miska / values: ', values);
        
        return (
          <Form className="form ui">
            <EntryTypeSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              entryTypes={["Hospital", "HealthCheck", "OccupationalHealthcare"]}
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
