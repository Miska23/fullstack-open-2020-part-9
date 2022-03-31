import React from "react";

import { Icon } from "semantic-ui-react";

import { HealthCheckEntry, OccupationalHealthcareEntry } from "../types";
import { assertNever } from "../utils";

interface Props {
  item: OccupationalHealthcareEntry | HealthCheckEntry;
}

const HealthCheckTypeIndicator = ({item}: Props) => {
  switch (item.type) {
  case "HealthCheck":

    return <Icon name="medkit"/>;

  case "OccupationalHealthcare":

    return <> <Icon name="suitcase"/> <span>{item.employerName}</span> </>;
  default:
    assertNever(item);
    return null;
  }
};

export default HealthCheckTypeIndicator;
