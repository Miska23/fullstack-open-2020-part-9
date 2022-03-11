import React from "react";
import axios from "axios";
import { Route, Link, Switch, useRouteMatch } from "react-router-dom";
import { Button, Divider, Header, Container } from "semantic-ui-react";

import { apiBaseUrl } from "./constants";
import { setDiagnosisList, setPatientList, useStateValue } from "./state";
import { AppRoute, PublicPatient, PatientRouteParams, Diagnosis } from "./types";

import PatientListPage from "./PatientListPage";
import PatientInfoPage from "./PatientInfoPage";

const App = () => {
  const [state, dispatch] = useStateValue();

  React.useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patientListFromApi } = await axios.get<PublicPatient[]>(
          `${apiBaseUrl}${AppRoute.Patients}`
        );
        dispatch(setPatientList(patientListFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    const fetchDiagnosisList = async () => {
      try {
        const { data: diagnosisListFromApi } = await axios.get<Diagnosis[]>(
          `${apiBaseUrl}${AppRoute.Diagnoses}`
        );
        dispatch(setDiagnosisList(diagnosisListFromApi));
      } catch (e) {
        console.error(e);
      }
    };

    void fetchPatientList();
    void fetchDiagnosisList();
  }, []);

  const match = useRouteMatch<PatientRouteParams>(`${AppRoute.Patients}/:id`);
  const patient = match
    ? state.patients[match.params.id]
    : null;

  return (
    <div className="App">
      <Container>
        <Header as="h1">Patientor</Header>
        <Button as={Link} to="/" primary>
            Home
        </Button>
        <Divider hidden />
        <Switch>
          {patient &&
            <Route path={`${AppRoute.Patients}/:id`}>
              <PatientInfoPage patientId={patient.id}/>
            </Route>}
          <Route path="/">
            <PatientListPage />
          </Route>
        </Switch>
      </Container>
    </div>
  );
};

export default App;
