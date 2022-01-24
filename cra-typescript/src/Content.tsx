import React from 'react';
import { CoursePart } from './App';

interface Props {
  courseParts: CoursePart[]
}

const Content = ({courseParts}: Props) => {
  return (
    <>
    {courseParts.map(({name, exerciseCount}) => <p key={name}>{name} {exerciseCount} </p>)}
    </>
  );
};

export default Content;