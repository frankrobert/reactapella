import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLORS } from '../../constants/constants';

const Canvas = styled.canvas.attrs({
  width: (props) => props.width,
  height: (props) => props.height
})`
  ${(props) => (props.vertical ? 'transform: rotate(-90deg)' : '')};
`;

class Meter extends Component {
  static propTypes = {
    value: PropTypes.number,
    vertical: PropTypes.bool,
    // TODO: Fix clipping
    isClipping: PropTypes.bool
  };

  static defaultProps = {
    value: 0,
    vertical: false
  };

  constructor(props) {
    super(props);
    // TODO: Allow the dimensions of the meter to be provided by props
    this.ctx = null;
    this.width = 300;
    this.height = 50;
  }

  componentDidMount() {
    if (!this.ctx) this.ctx = this.canvas.getContext('2d');
    window.requestAnimationFrame(this.updateMeter);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isClipping !== this.props.isClipping ||
      nextProps.value !== this.props.value
    ) {
      window.requestAnimationFrame(this.updateMeter);
    }
  }

  updateMeter = () => {
    const { isClipping, value } = this.props;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.strokeRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = isClipping ? COLORS.RED : COLORS.GREEN;
    this.ctx.fillRect(0, 0, value * (this.width / 100), this.height);
  };

  render() {
    const { vertical } = this.props;

    return (
      <Canvas
        width={this.width}
        height={this.height}
        vertical={vertical}
        innerRef={(e) => (this.canvas = e)} // eslint-disable-line
      />
    );
  }
}

export default Meter;
