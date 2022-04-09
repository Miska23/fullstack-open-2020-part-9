import React from "react";
import { List } from "semantic-ui-react";
import { useStateValue } from "../state";
import { HealthCheckEntry } from "../types";
import HealthCheckRatingIndicator from "./HealthCheckRatingIndicator";
import HealthCheckTypeIndicator from "./HealthCheckTypeIndicator";

interface Props {
  item: HealthCheckEntry;
}

const HealthCheckEntryItem = ({item}: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div style={{border: "1px solid black", padding: '12px', marginBottom: '12px'}}>
      <List.Item>
        <span style={{display: "block"}}>{item.date} <HealthCheckTypeIndicator item={item}/></span>
        <span style={{fontStyle: 'italic', display: "block"}}>{item.description}</span>
        <HealthCheckRatingIndicator rating={item.healthCheckRating}/>
        <span style={{display: "block"}}>diagnose by {item.specialist}</span>
        {item.diagnosisCodes && <List>
          {item.diagnosisCodes.map((code, index) =>
            <List.Item key={index}>
              {item.date}
              {code} {diagnoses[code].name}
              diagnose by {item.specialist}
            </List.Item>
          )}
        </List>}
      </List.Item>
    </div>
  );
};

export default HealthCheckEntryItem;
