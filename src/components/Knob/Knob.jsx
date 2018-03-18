/* eslint-disable */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const KnobWrapper = styled.div`
  max-height: ${({ size }) => size || 200}px;
  position: relative;
`;

const KnobNeedle = styled.circle.attrs({
  cx: '20',
  cy: '30',
  r: '1.5',
  fill: '#4eccff'
})`
  transform-origin: 20px 20px 0;
  transform: rotate(
    ${(props) => {
      return (
        props.degreeOffset +
          (props.divisions > 1 ? props.getClosest(props.value) : props.value) *
            (props.degreeRange / 100 || 3.6) || 0
      );
    }}deg
  );
`;

const KnobStyles = (
  <svg className="defs" style={{ position: 'absolute' }}>
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
  z-index: -1;
`;

class KnobInput extends Component {
  constructor(props) {
    super(props);
    this.scrolling = null;
  }

  state = {
    dragging: false,
    dragPosition: {
      x: 0,
      y: 0
    }
  };

  componentDidMount() {
    this.dial.addEventListener('wheel', this.updateOnScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    const { dragging } = this.state;
    if (dragging && !prevState.dragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!this.state.dragging && prevState.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (e) => {
    const offset = this.dial.getBoundingClientRect();
    this.setState({
      dragging: true,
      dragPosition: { x: e.pageX - offset.left, y: e.pageY - offset.top }
    });
  };

  onMouseMove = (e) => {
    const { dragging, dragPosition } = this.state;
    const { onChange, min, max, value } = this.props;
    const oldDragAmount = { ...dragPosition };

    if (!dragging) return;

    let dragAmount = value + oldDragAmount.y - e.pageY;
    if (dragAmount > max) dragAmount = max;
    else if (dragAmount < min) dragAmount = min;

    this.setState({ dragPosition: { x: e.pageX, y: e.pageY } });
    onChange(dragAmount);
  };

  onMouseUp = () => {
    const { initialValue, valueSnapping, onChange } = this.props;

    this.setState({ dragging: false });
    if (valueSnapping) onChange(initialValue);
  };

  updateOnScroll = (e) => {
    const {
      onChange,
      initialValue,
      max,
      min,
      value,
      valueSnapping
    } = this.props;
    clearTimeout(this.scrolling);
    this.range.focus();

    let newValue = value + e.deltaY / 4;

    if (newValue > max) newValue = max;
    else if (newValue < min) newValue = min;
    onChange(newValue);
    this.scrolling = valueSnapping
      ? setTimeout(() => onChange(initialValue), 100)
      : null;
  };

  onChange = (e) => {
    this.props.onChange(e);
  };

  getClosest = (value) => {
    const { divisions, max } = this.props;
    const divisionStep = max / divisions;
    const divisionsList = [...Array(divisions + 1)].map((division, i) => {
      return i * divisionStep;
    });

    return divisionsList.reduce((prev, curr) => {
      return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
    });
  };

  renderDivisions = () => {
    const { divisions, max } = this.props;
    const divisionStep = max / divisions;
    const options = [...Array(divisions + 1)].map((division, i) => (
      <option key={i} value={divisionStep * i} />
    ));

    if (divisions <= 1) return;

    return (
      <datalist id="divisions">{options.map((option) => option)}</datalist>
    );
  };

  render() {
    const {
      degreeOffset,
      degreeRange,
      divisions,
      min,
      max,
      step,
      value
    } = this.props;
    // const { rangeValue } = this.state;

    return (
      <KnobWrapper>
        {KnobStyles}
        <svg
          className="knob-input__visual"
          style={{ maxHeight: 200, zIndex: 2 }}
          viewBox="0 0 40 40"
          ref={(e) => (this.dial = e)}
          onMouseDown={this.onMouseDown}
        >
          <circle
            className="focus-indicator"
            cx="20"
            cy="20"
            r="18"
            fill="#4eccff"
            filter="url(#glow)"
          />
          <circle
            className="indicator-ring-bg"
            cx="20"
            cy="20"
            r="18"
            fill="#353b3f"
            stroke="#23292d"
          />
          <path className="indicator-ring" d="M20,20Z" fill="#4eccff" />
          <g className="dial">
            <circle cx="20" cy="20" r="16" fill="url(#grad-dial-soft-shadow)" />
            <ellipse
              cx="20"
              cy="22"
              rx="14"
              ry="14.5"
              fill="#242a2e"
              opacity="0.15"
            />
            <circle
              cx="20"
              cy="20"
              r="14"
              fill="url(#grad-dial-base)"
              stroke="#242a2e"
              strokeWidth="1.5"
            />
            <circle
              cx="20"
              cy="20"
              r="13"
              fill="transparent"
              stroke="url(#grad-dial-highlight)"
              strokeWidth="1.5"
            />
            <circle
              className="dial-highlight"
              cx="20"
              cy="20"
              r="14"
              fill="#ffffff"
            />
            <KnobNeedle
              className="indicator-dot"
              value={value}
              divisions={divisions}
              degreeOffset={degreeOffset}
              degreeRange={degreeRange}
              getClosest={this.getClosest}
            />
          </g>
        </svg>
        <VerticalKnobRange
          onChange={(e) => this.onChange(e)}
          innerRef={(e) => (this.range = e)}
          value={value || 0}
          min={min}
          max={max}
          step={step}
          list={divisions > 1 ? 'divisions' : null}
        />
        {this.renderDivisions()}
      </KnobWrapper>
    );
  }
}

KnobInput.propTypes = {
  valueSnapping: PropTypes.bool,
  degreeRange: PropTypes.number,
  degreeOffset: PropTypes.number,
  step: PropTypes.number,
  divisions: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  initialValue: PropTypes.number,
  value: PropTypes.number,
  onChange: PropTypes.func
};

KnobInput.defaultProps = {
  initialValue: 0,
  degreeRange: 360,
  degreeOffset: 0,
  step: 1,
  divisions: 1,
  min: 0,
  max: 100,
  value: 0
};

export default KnobInput;
