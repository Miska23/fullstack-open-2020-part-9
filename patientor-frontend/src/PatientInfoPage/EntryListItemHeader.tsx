import React from "react";
import { Entry } from "../types";
import { isHealthCheckEntry, isOccupationalHealthcareEntry } from "../utils";
import HealthCheckRatingIndicator from "./HealthCheckRatingIndicator";
import HealthCheckTypeIndicator from "./HealthCheckTypeIndicator";

interface Props {
  item: Entry
}

const EntryListItemHeader = ({item}: Props) => {
  return (
    <>
      <span style={{display: "block"}}>{item.date} {(isOccupationalHealthcareEntry(item) || isHealthCheckEntry(item)) ? <HealthCheckTypeIndicator item={item}/>  : null}  </span>
      <span style={{fontStyle: 'italic', display: "block"}}>{item.description}</span>
      {(isOccupationalHealthcareEntry(item) || isHealthCheckEntry(item)) && item.healthCheckRating !== undefined
        ? <HealthCheckRatingIndicator rating={item.healthCheckRating}/>
        : null}
      <span style={{display: "block"}}>diagnose by {item.specialist}</span>
    </>
  );
};

export default EntryListItemHeader;
