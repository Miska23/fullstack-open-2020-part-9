import React from 'react';
import { CoursePart } from './App';
import Part from './Part';

interface Props {
  courseParts: CoursePart[]
}

const Content = ({courseParts}: Props) => {
  return (
    <>
    {courseParts.map(part => <Part key={part.name} coursePart={part}/>)}
    </>
  );
};

export default Content;