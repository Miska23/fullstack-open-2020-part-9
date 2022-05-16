import React, { useEffect } from "react";
import axios from "axios";
import { Button, Container, Header, Icon, List, Loader, SemanticICONS } from "semantic-ui-react";

import { AppRoute, Entry, Gender, Patient } from "../types";
import { apiBaseUrl } from "../constants";
import {  addEntryToPatient, updatePatientList, useStateValue } from "../state";
import { assertNever, isCompletePatientEntry, parseFormValuesIntroEntry } from "../utils";
import EntryList from "./EntryList";
import AddEntryModal from "../AddEntryModal ";
import { FormValues } from "../AddEntryModal /AddEntryForm";

interface Props {
  patientId: string;
}

const PatientInfoPage = ({patientId}: Props) => {
  const [{ patients }, dispatch] = useStateValue();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

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

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (entry: FormValues) => {
    try {
      const entryToAdd = parseFormValuesIntroEntry(entry);
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        entryToAdd
      );
      dispatch(addEntryToPatient({entry: newEntry, id: patientId}));
      closeModal();

    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

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
        <AddEntryModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntry}
          error={error}
          onClose={closeModal}
        />
        <Button onClick={() => openModal()}>Add New Entry</Button>
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
