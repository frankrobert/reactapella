/* eslint-disable */
import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/constants';

// TODO FIX DIAL ANIMATION
const KnobWrapper = styled.div`
  max-height: ${({ size }) => size || 200}px;
  height: 200px;
  width: 200px;
  border-radius: 50%;
  border: 2px solid #222;
  position: relative;
  box-shadow: 0px 0px 20px 0px #63535b;
`;

const ProgressRing = styled.canvas.attrs({ width: 200, height: 200 })`
  z-index: 10;
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
  }}
  position: absolute;
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
    this.ctx = null;
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
    const { min, max, value } = this.props;
    const oldDragValue = { ...dragPosition }; // Clone drag

    if (!isDragging) return;

    let dragAmount = value + oldDragValue.y - e.pageY;
    if (dragAmount > max) dragAmount = max;
    else if (dragAmount < min) dragAmount = min;

    this.setState({ dragPosition: { x: e.pageX, y: e.pageY } });
    this.onChange(dragAmount);
  };

  onMouseUp = () => {
    const { initialValue, valueSnapping } = this.props;

    this.setState({ isDragging: false });
    if (valueSnapping) this.onChange(initialValue);
  };

  updateOnScroll = (e) => {
    const {
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
    this.onChange(newValue);
    this.scrolling = valueSnapping
      ? setTimeout(() => {
          this.setState({ isScrolling: false });
          this.onChange(initialValue);
        }, 100)
      : null;
  };

  onChange = (e) => {
    this.updateArc();
    this.props.onChange(e);
  };

  updateArc = () => {
    const { divisions, degreeRange, degreeOffset, value } = this.props;

    if (!this.ctx) this.ctx = this.progress.getContext('2d');

    const gradient = this.ctx.createLinearGradient(0,500,0, 0);
    gradient.addColorStop(0, '#c0e674');
    gradient.addColorStop(1, '#40d6a5');

    let newValue = divisions > 1 ? this.getClosest(value) : value;
    let newDegreeRange = degreeRange;

    if (degreeRange > 360) newDegreeRange -= 360;
    else if (degreeRange < 0) newDegreeRange += 360;

    newValue = value / 100 * newDegreeRange + degreeOffset;

    this.ctx.globalCompositeOperation = 'destination-out';

    this.ctx.beginPath();
    this.ctx.arc(100, 100, 100, degreeOffset, newValue);
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.fill();
  }

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
        onWheel={this.updateOnScroll}
        onMouseDown={this.onMouseDown}
      >
        <ProgressRing
          innerRef={(e) => this.progress = e} // eslint-disable-line
          isDragging={isDragging}
          isScrolling={isScrolling}
          degreeOffset={degreeOffset}
          degreeRange={degreeRange}
          divisions={divisions}
          value={value}
          valueSnapping={valueSnapping}
          getClosest={this.getClosest}
        />
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
