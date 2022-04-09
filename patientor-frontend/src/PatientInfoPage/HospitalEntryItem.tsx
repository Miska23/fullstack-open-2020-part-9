import React from "react";
import { List } from "semantic-ui-react";
import { useStateValue } from "../state";
import { HospitalEntry } from "../types";

interface Props {
  item: HospitalEntry;
}

const HospitalEntryItem = ({item}: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div style={{border: "1px solid black", padding: '12px', marginBottom: '12px'}}>

      <List.Item>
        <span style={{display: "block"}}>{item.date}</span>
        <span style={{fontStyle: 'italic', display: "block"}}>{item.description}</span>
        <span style={{display: "block"}}>diagnose by {item.specialist}</span>
        {item.diagnosisCodes && <List>
          {item.diagnosisCodes.map((code, index) => <List.Item key={index}>{code} {diagnoses[code].name} </List.Item>)}
        </List>}
      </List.Item>
    </div>
  );
};

export default HospitalEntryItem;
