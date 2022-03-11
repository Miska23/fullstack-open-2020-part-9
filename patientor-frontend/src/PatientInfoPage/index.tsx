import React, { useEffect } from "react";
import axios from "axios";
import { Container, Header, Icon, List, Loader, SemanticICONS } from "semantic-ui-react";

import { AppRoute, Gender, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import { updatePatientList, useStateValue } from "../state";
import { assertNever, isCompletePatientEntry } from "../utils";
import EntryList from "./EntryList";

interface Props {
  patientId: string;
}

const PatientInfoPage = ({patientId}: Props) => {
  const [{ patients }, dispatch] = useStateValue();
  const [error, setError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    const fetchPatientInfo = async (id: string) => {
      setLoading(true);

      const { data: patient } = await axios.get<Patient | undefined>(
        `${apiBaseUrl}${AppRoute.Patients}/${id}`
      );
      if (patient) {
        dispatch(updatePatientList(patient));
      } else {
        setError("Information for patient not found");
      }
      setLoading(false);
    };
    if (!isCompletePatientEntry(patients[patientId])) {
      void fetchPatientInfo(patientId);
    } else {
      setLoading(false);
    }
  }, []);

  const renderPatientInfo = () => {
    const {name, gender, ssn, occupation, entries} = patients[patientId];

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
        <EntryList listItems={entries}/>
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

  const renderContent = () => {
    if (loading) {
      return <Loader active/>;
    } else if (!loading) {
      return renderPatientInfo();
    } else if (error) {
      return renderErrorMessage();
    } else {
      return null;
    }
  };

  return (
    <div className="App">
      <Container textAlign="center">
        {renderContent()}
      </Container>
    </div>
  );
};

export default PatientInfoPage;
