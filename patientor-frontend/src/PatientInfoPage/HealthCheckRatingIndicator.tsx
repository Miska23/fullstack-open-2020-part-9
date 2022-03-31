import React from "react";

import { Icon } from "semantic-ui-react";

import { HealthCheckRating } from "../types";
import { assertNever } from "../utils";

interface Props {
  rating: HealthCheckRating;
}

const HealthCheckRatingIndicator = ({rating}: Props) => {
  switch (rating) {
  case HealthCheckRating.CriticalRisk:
    return <Icon name={"heart"} color="black" />;
  case HealthCheckRating.LowRisk:
    return <Icon name={"heart"} color="yellow"/>;
  case HealthCheckRating.HighRisk:
    return <Icon name={"heart"} color="red"/>;
  case HealthCheckRating.Healthy:
    return <Icon name={"heart"} color="green"/>;
  default:
    assertNever(rating);
    return null;
  }
};

export default HealthCheckRatingIndicator;
