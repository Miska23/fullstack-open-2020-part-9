import React from "react";
import { List } from "semantic-ui-react";
import { useStateValue } from "../state";
import { HospitalEntry } from "../types";
import EntryListItemHeader from "./EntryListItemHeader";

interface Props {
  item: HospitalEntry;
}

const HospitalEntryItem = ({item}: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div style={{border: "1px solid black", borderRadius: "5%", padding: '12px'}}>

      <List.Item>
        <EntryListItemHeader item={item}/>
        <List>
          {item.diagnosisCodes?.map((code, index) => <List.Item key={index}>{code} {diagnoses[code].name} </List.Item>)}
        </List>
      </List.Item>
    </div>
  );
};

export default HospitalEntryItem;
