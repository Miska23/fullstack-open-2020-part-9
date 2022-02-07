import React, { useEffect } from "react";
import axios from "axios";
import { Container, Table } from "semantic-ui-react";

import { Patient } from "../types";
import { apiBaseUrl } from "../constants";
import HealthRatingBar from "../components/HealthRatingBar";
import { useStateValue } from "../state";

interface Props {
  patientId: string;
}

const PatientInfoPage = ({patientId}: Props) => {
  const [{ patients }, dispatch] = useStateValue();
  const [error, setError] = React.useState<string | undefined>();

  useEffect(() => {
    const fetchPatientInfo = async (id: string) => {
      const { data: patient } = await axios.get<Patient | undefined>(
        `${apiBaseUrl}/patient/${id}`
        );
        if (patient) {
          // update state here
        } else {
          setError("Patien info not found");
        }
      };
      // check if patients has a complete entry for patient with patientId
      // if yes, don't fetch and use the entry directly on UI
      // if no, set loading, fetch the entry. update the patient's info in state and use then use the entry on UI
    void fetchPatientInfo(patientId);
  }, []);

  return (
    <div className="App">
      <Container textAlign="center">
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Gender</Table.HeaderCell>
              <Table.HeaderCell>Occupation</Table.HeaderCell>
              <Table.HeaderCell>Health Rating</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Object.values(patients).map((patient: Patient) => (
              <Table.Row key={patient.id}>
                <Table.Cell>{patient.name}</Table.Cell>
                <Table.Cell>{patient.gender}</Table.Cell>
                <Table.Cell>{patient.occupation}</Table.Cell>
                <Table.Cell>
                  <HealthRatingBar showText={false} rating={1} />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Container>
    </div>
  );
};

export default PatientInfoPage;
