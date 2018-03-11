/* eslint-disable */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const KnobWrapper = styled.div`
  max-height: ${({ size }) => size || 200}px;
  position: relative;
`;

const KnobNeedle = styled.circle.attrs({ cx: '20', cy: '30', r: '1.5', fill: '#4eccff' })`
  transform-origin: 20px 20px 0;
  transform: rotate(${(props) => props.rangeValue * 3.6 || 0}deg);
`;

const KnobStyles = (
  <svg className="defs" style={{ position: 'absolute '}}>
    <defs>
      <radialGradient id="grad-dial-soft-shadow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="85%" stopColor="#242a2e" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#242a2e" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="grad-dial-base" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#52595f" />
        <stop offset="100%" stopColor="#2b3238" />
      </linearGradient>
      <linearGradient id="grad-dial-highlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#70777d" stopOpacity="1" />
        <stop offset="40%" stopColor="#70777d" stopOpacity="0" />
        <stop offset="55%" stopColor="#70777d" stopOpacity="0" />
        <stop offset="100%" stopColor="#70777d" stopOpacity="0.3" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="2" />
        <feComposite in="blur" in2="SourceGraphic" operator="over" />
      </filter>
    </defs>
  </svg>
);

const VerticalKnobRange = styled.input.attrs({ type: 'range' })`
  transform: translate(-50%, -50%) rotate(-90deg);
  position: absolute;
  left: 50%;
  top: 50%;
`;

class KnobInput extends Component {
  state = {
    rangeValue: 0
  };

  onChange(e) {
    this.setState({ rangeValue: e.target.value });
  }

  render() {
    const { rangeValue } = this.state;

    return (
      <KnobWrapper>
        {KnobStyles}
        <svg className="knob-input__visual" style={{ maxHeight: 200, zIndex: 2 }} viewBox="0 0 40 40">
          <circle className="focus-indicator" cx="20" cy="20" r="18" fill="#4eccff" filter="url(#glow)" />
          <circle className="indicator-ring-bg" cx="20" cy="20" r="18" fill="#353b3f" stroke="#23292d" />
          <path className="indicator-ring" d="M20,20Z" fill="#4eccff" />
          <g className="dial">
            <circle cx="20" cy="20" r="16" fill="url(#grad-dial-soft-shadow)" />
            <ellipse cx="20" cy="22" rx="14" ry="14.5" fill="#242a2e" opacity="0.15" />
            <circle cx="20" cy="20" r="14" fill="url(#grad-dial-base)" stroke="#242a2e" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="13" fill="transparent" stroke="url(#grad-dial-highlight)" strokeWidth="1.5" />
            <circle className="dial-highlight" cx="20" cy="20" r="14" fill="#ffffff" />
            <KnobNeedle className="indicator-dot" rangeValue={rangeValue} />
          </g>
        </svg>
        <VerticalKnobRange onChange={(e) => this.onChange(e)} />
      </KnobWrapper>
    );
  }
}

KnobInput.propTypes = {
  degreeRange: PropTypes.number,
  degreeOffset: PropTypes.number,
  step: PropTypes.number,
  divisions: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  initValue: PropTypes.number,
  orientation: PropTypes.string
};

export default KnobInput;
