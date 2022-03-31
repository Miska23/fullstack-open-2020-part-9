import React from "react";
import { List, Header } from "semantic-ui-react";
import { Entry } from "../types";
import { assertNever } from "../utils";
import HealthCheckEntryItem from "./HealthCheckEntryItem";
import HospitalEntryItem from "./HospitalEntryItem";
import OccupationalHealthcareEntryItem from "./OccupationalHealthcareEntryItem";

interface Props {
  listItems: Entry[];
}

const EntryList = ({listItems}: Props) => {

  const renderListItem = (item: Entry, index: number): JSX.Element | null => {
    switch (item.type) {
    case "HealthCheck":
      return <HealthCheckEntryItem item={item} key={index}/>;
    case "Hospital":
      return <HospitalEntryItem item={item} key={index}/>;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntryItem item={item} key={index}/>;
    default:
      assertNever(item);
      return null;
    }
  };

  return (
    <>
      <Header as="h2">
        Entries
      </Header>
      <List.List>
        {listItems.map((item, index) => renderListItem(item, index))}
      </List.List>
    </>
  );
};

export default EntryList;
