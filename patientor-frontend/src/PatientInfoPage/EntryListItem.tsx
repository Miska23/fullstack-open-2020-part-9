import React from "react";
import { List } from "semantic-ui-react";
import { useStateValue } from "../state";
import { Entry } from "../types";

interface Props {
  item: Entry;
}

const EntryListItem = ({item}: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <List.Item>
      {item.date} <span style={{fontStyle: 'italic'}}>{item.description}</span>
      <List bulleted>
        {item.diagnosisCodes?.map((code, index) => <List.Item key={index}>{code} {diagnoses[code].name} </List.Item>)}
      </List>
    </List.Item>
  );
};

export default EntryListItem;
