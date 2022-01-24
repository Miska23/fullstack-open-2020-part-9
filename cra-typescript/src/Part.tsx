import React from 'react';
import { CoursePart } from './App';

interface Props {
  coursePart: CoursePart
}

const Part = ({coursePart}: Props) => {

  const handleNeverValue = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  let content: JSX.Element;

  switch (coursePart.type) {
    case "normal":
      content = <p style={{fontStyle: "italic"}}>{coursePart.description}</p>
      break;
    case "groupProject":
      content = <p>project exercises {coursePart.groupProjectCount}</p>
      break;
    case "submission":
      content = (
      <>
        <p style={{fontStyle: "italic"}}>{coursePart.description}</p>
        <p>submit to {coursePart.exerciseSubmissionLink}</p>
      </>
      )
      break;
    case "special":
      content = (
        <>
          <p style={{fontStyle: "italic"}}>{coursePart.description}</p>
          <p>required skills {coursePart.requirements.join(', ')}</p>
        </>
        )
        break;
    default:
      handleNeverValue(coursePart);
      return null
  }
  return (
    <div>
      <p style={{fontWeight: "bold"}}>{coursePart.name} {coursePart.exerciseCount}</p>
      {content}
    </div>
  )
};

export default Part;