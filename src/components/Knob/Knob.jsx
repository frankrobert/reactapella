/* eslint-disable */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import COLORS from '../../constants/colors';

// TODO FIX DIAL ANIMATION
const KnobWrapper = styled.div`
  max-height: ${({ size }) => size || 200}px;
  height: 200px;
  width: 200px;
  border-radius: 50%;
  border: 2px solid #222;
  position: relative;
  box-shadow: 0px 0px 20px 0px #63535b;
  background-color: ${COLORS.LIGHT_GREEN};
  background-image: ${(props) => {
      const value =
        props.divisions > 1 ? props.getClosest(props.value) : props.value;
      let degreeRange = props.degreeRange;

      if (degreeRange > 360) degreeRange -= 360;
      else if (degreeRange < 0) degreeRange += 360;

      const degree = value / 100 * degreeRange + props.degreeOffset;

      if (degree <= 180) {
        return `
        linear-gradient(${-90 + degree}deg, transparent 50%, ${
          COLORS.YELLOW
        } 50%),
        linear-gradient(${props.degreeOffset - 90}deg, ${
          COLORS.YELLOW
        } 50%, transparent 50%);
        `;
      }

      return `
        linear-gradient(${degree + 90}deg, transparent 50%, ${
        COLORS.LIGHT_GREEN
      } 50%),
        linear-gradient(${props.degreeOffset + 270}deg, ${
        COLORS.YELLOW
      } 50%, transparent 50%);
        `;
    }}
    ${(props) => {
      return !props.isDragging && !props.isScrolling && props.valueSnapping
        ? 'transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);'
        : 'transition: null;';
    }};
`;

const InnerDial = styled.div`
  height: 180px;
  width: 180px;
  border-radius: 50%;
  border: 2px solid #222;
  background-color: ${COLORS.GREEN};
  transform: translate(-50%, -50%) scale(-1)
    rotate(
      ${(props) => {
        const value =
          props.divisions > 1 ? props.getClosest(props.value) : props.value;
        let degreeRange = props.degreeRange;

        if (degreeRange > 360) degreeRange -= 360;
        else if (degreeRange < 0) degreeRange += 360;

        return value / 100 * degreeRange + props.degreeOffset;
      }}deg
    );
  ${(props) => {
    return !props.isDragging && !props.isScrolling && props.valueSnapping
      ? 'transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);'
      : 'transition: null;';
  }} position: absolute;
  left: 50%;
  top: 50%;
`;

const Dot = styled.div`
  background-color: #fff;
  border: 2px solid #222;
  border-radius: 50%;
  height: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 100%);
  width: 10px;
`;

const Range = styled.input.attrs({ type: 'range' })`
  transform: translate(-50%, -50%) rotate(-90deg);
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: -1;
  visibility: hidden;
`;

class KnobInput extends Component {
  constructor(props) {
    super(props);
    this.scrolling = null;
  }

  state = {
    isScrolling: false,
    isDragging: false,
    dragPosition: {
      x: 0,
      y: 0
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { isDragging } = this.state;
    if (isDragging && !prevState.isDragging) {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    } else if (!isDragging && prevState.isDragging) {
      document.removeEventListener('mousemove', this.onMouseMove);
      document.removeEventListener('mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (e) => {
    this.setState({
      isDragging: true,
      dragPosition: { x: e.pageX, y: e.pageY }
    });
  };

  onMouseMove = (e) => {
    const { isDragging, dragPosition } = this.state;
    const { onChange, min, max, value } = this.props;
    const oldDragValue = { ...dragPosition }; // Clone drag

    if (!isDragging) return;

    let dragAmount = value + oldDragValue.y - e.pageY;
    if (dragAmount > max) dragAmount = max;
    else if (dragAmount < min) dragAmount = min;

    this.setState({ dragPosition: { x: e.pageX, y: e.pageY } });
    onChange(dragAmount);
  };

  onMouseUp = () => {
    const { initialValue, valueSnapping, onChange } = this.props;

    this.setState({ isDragging: false });
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
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(this.scrolling);
    this.setState({ isScrolling: true });
    this.range.focus();

    let newValue = value + e.deltaY / 4;

    if (newValue > max) newValue = max;
    else if (newValue < min) newValue = min;
    onChange(newValue);
    this.scrolling = valueSnapping
      ? setTimeout(() => {
          this.setState({ isScrolling: false });
          onChange(initialValue);
        }, 100)
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
      value,
      valueSnapping
    } = this.props;
    const { isDragging, isScrolling } = this.state;

    return (
      <KnobWrapper
        isDragging={isDragging}
        isScrolling={isScrolling}
        degreeOffset={degreeOffset}
        degreeRange={degreeRange}
        divisions={divisions}
        value={value}
        valueSnapping={valueSnapping}
        getClosest={this.getClosest}
        onWheel={this.updateOnScroll}
        innerRef={(e) => (this.dial = e)}
        onMouseDown={this.onMouseDown}
      >
        <InnerDial
          isDragging={isDragging}
          isScrolling={isScrolling}
          degreeOffset={degreeOffset}
          degreeRange={degreeRange}
          divisions={divisions}
          value={value}
          valueSnapping={valueSnapping}
          getClosest={this.getClosest}
        >
          <Dot />
        </InnerDial>
        <Range
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
