import React from "react";
import { List } from "semantic-ui-react";
import { useStateValue } from "../state";
import { OccupationalHealthcareEntry } from "../types";
import HealthCheckTypeIndicator from "./HealthCheckTypeIndicator";

interface Props {
  item: OccupationalHealthcareEntry
}

const OccupationalHealthcareEntryItem = ({item}: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div style={{border: "1px solid black", padding: '12px', marginBottom: '12px'}}>
      <span style={{display: "block"}}>{item.date} <HealthCheckTypeIndicator item={item}/></span>
      <span style={{fontStyle: 'italic', display: "block"}}>{item.description}</span>
      <span style={{display: "block"}}>diagnose by {item.specialist}</span>
      <List.Item>
        {item.diagnosisCodes && <List>
          {item.diagnosisCodes.map((code, index) =>
            <List.Item key={index}>
              {item.date}
              {code} {diagnoses[code].name}
            </List.Item>
          )}
        </List>}
      </List.Item>
    </div>
  );
};

export default OccupationalHealthcareEntryItem;
