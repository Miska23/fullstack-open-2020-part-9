import React, { useEffect } from "react";
import axios from "axios";
import { Container, Header, Icon, List, SemanticICONS } from "semantic-ui-react";

import { AppRoute, Gender, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { assertNever, isCompletePatientEntry } from "../utils";

interface Props {
  patientId: string;
}

const PatientInfoPage = ({patientId}: Props) => {
  const [{ patients }, dispatch] = useStateValue();
  const [error, setError] = React.useState<string | undefined>();

  useEffect(() => {
    const fetchPatientInfo = async (id: string) => {
      const { data: patient } = await axios.get<Patient | undefined>(
        `${apiBaseUrl}${AppRoute.Patients}/${id}`
        );
        if (patient) {
          dispatch({ type: "UPDATE_PATIENT_LIST", payload: patient });
        } else {
          setError("Information for patient not found");
        }
      };
    if (!isCompletePatientEntry(patients[patientId])) {
      void fetchPatientInfo(patientId);
    }
  }, []);

  const renderPatientInfo = () => {
    const {name, gender, ssn, occupation} = patients[patientId];

    let iconName: SemanticICONS | undefined = undefined;

    switch (gender) {
      case Gender.Male:
        iconName = "mars";
        break;
      case Gender.Female:
        iconName = "venus";
        break;
      case Gender.Other:
        iconName = "genderless";
        break;
      default:
        assertNever(gender);
        break;
    }

    return (
      <Container textAlign='left'>
        <Header as="h2">
          {name}
          <Icon name={iconName}>
          </Icon>
        </Header>
          <List>
            <List.Item>ssn: {ssn}</List.Item>
            <List.Item>occupation: {occupation}</List.Item>
          </List>
      </Container>
    );
  };

  const renderErrorMessage = () => {
    return (
      <Header as="h2">
        {error}
      </Header>
    );
  };

  return (
    <div className="App">
      <Container textAlign="center">
        {renderPatientInfo()}
        {error && renderErrorMessage()}
      </Container>
    </div>
  );
};

export default PatientInfoPage;
