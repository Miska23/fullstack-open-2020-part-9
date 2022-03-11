import React from "react";
import { List, Header } from "semantic-ui-react";
import { Entry } from "../types";
import EntryListItem from "./EntryListItem";

interface Props {
  listItems: Entry[];
}

const EntryList = ({listItems}: Props) => (
  <>
    <Header as="h2">
        Entries
    </Header>
    <List.List>
      {listItems.map((item, index) => <EntryListItem key={index} item={item}/>)}
    </List.List>
  </>
);

export default EntryList;
