/* eslint-disable */
import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const KnobWrapper = styled.div`
  background-color: aqua;
  cursor: pointer;
  border-radius: 50%;
  position: relative;
  height: 100px;
  width: 100px;
`;

const KnobDial = styled.div`
  position: absolute;
  width: 6px;
  height: 18px;
  background-color: green;
  left: 50%;
  transform: translateX(-50%);
`;

const FullKnob = (props) => {
  return (
    <KnobWrapper>
      <KnobDial {...props} />
    </KnobWrapper>
  );
};

FullKnob.propTypes = {
  degreeRange: PropTypes.number,
  degreeOffset: PropTypes.number,
  step: PropTypes.number,
  divisions: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  initValue: PropTypes.number
};

export default FullKnob;
