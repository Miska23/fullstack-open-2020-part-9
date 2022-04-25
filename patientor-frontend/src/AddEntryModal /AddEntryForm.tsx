import React from "react";
import { Grid, Button } from "semantic-ui-react";
import { Field, Formik, Form } from "formik";

import { EntryWithoutId, HealthCheckRating, HospitalEntry } from "../types";
import { useStateValue } from "../state";
import { TextField, DiagnosisSelection, EntryTypeSelection, NumberField } from "../AddPatientModal/FormField";

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
}

export type HospitalEntryFormValues = Omit<HospitalEntry, 'id' | 'discharge'> & {
  dischargeDate: string,
  dischargeCriteria: string,
};

// type HealthCheckEntryFormValues = HospitalEntryFormValues;

// type FormValues = HospitalEntryFormValues | HealthCheckEntryFormValues;

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
        </>
      );
    
    default:
      // assertNever(values.type);
      return null;
    }
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
        // healthCheckRating: HealthCheckRating.Healthy
      }}
      onSubmit={onSubmit}
      // validate={values => {
      //   const requiredError = "Field is required";
      //   const malformattedDateError = "Invalid date";
      //   const errors: { [field: string]: string } = {};
      //   if (!values.description) {
      //     errors.description = requiredError;
      //   }
      //   if (!isValidDate(values.date)) {
      //     errors.date = malformattedDateError;
      //   }
      //   if (!values.date) {
      //     errors.date = requiredError;
      //   }
      //   if (!values.specialist) {
      //     errors.specialist = requiredError;
      //   }
      //   if (!isValidDate(values.dischargeDate)) {
      //     errors.dischargeDate = malformattedDateError;
      //   }
      //   if (!values.dischargeDate) {
      //     errors.dischargeDate = requiredError;
      //   }
      //   if (!values.dischargeCriteria) {
      //     errors.dischargeCriteria = requiredError;
      //   }
      //   return errors;
      // }}
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
