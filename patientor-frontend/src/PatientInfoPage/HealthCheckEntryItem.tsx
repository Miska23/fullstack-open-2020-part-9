import React from "react";
import { List } from "semantic-ui-react";
import { useStateValue } from "../state";
import { HealthCheckEntry } from "../types";
import EntryListItemHeader from "./EntryListItemHeader";

interface Props {
  item: HealthCheckEntry;
}

const HealthCheckEntryItem = ({item}: Props) => {
  const [{ diagnoses }] = useStateValue();

  return (
    <div style={{border: "1px solid black", borderRadius: "5%", padding: '12px'}}>
      <List.Item>
        <EntryListItemHeader item={item}/>
        <List bulleted>
          {item.diagnosisCodes?.map((code, index) =>
            <List.Item key={index}>
              {item.date}
              {code} {diagnoses[code].name}
              diagnose by {item.specialist}
            </List.Item>
          )}
        </List>
      </List.Item>
    </div>
  );
};

export default HealthCheckEntryItem;
