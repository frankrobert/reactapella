import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COLORS } from '../../constants/constants';

const Slider = styled.div`
  ${(props) =>
    props.toggled
      ? `background: ${COLORS.GREEN};`
      : `background: ${COLORS.RED};`} border: 2px solid #222;
  height: 40px;
  width: 130px;
  border-radius: 20px;
  position: relative;
  transition: 0.3s ease-in;
  box-shadow: 0px 0px 20px 0px #63535b;

  &:hover {
    & > div {
      ${(props) =>
        props.toggled
          ? 'transform: translate(200%, -50%) scale(1.05, 1.05);'
          : 'transform: translate(0, -50%) scale(1.05, 1.05);'};
    }
  }
`;

const Button = styled.div`
  background-color: #fff;
  border: 2px solid #222;
  width: 35px;
  height: 35px;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  margin: 0 5px;
  ${(props) =>
    props.toggled
      ? 'transform: translate(200%, -50%);'
      : 'transform: translate(0, -50%);'} transition: all 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
`;

class Toggle extends Component {
  state = {
    toggled: this.props.defaultToggled
  };

  onToggle = () => {
    const { onClick } = this.props;

    this.setState(
      (prevState) => ({ toggled: !prevState.toggled }),
      onClick(this.state.toggled)
    );
  };

  render() {
    const { toggled } = this.state;

    return (
      <Slider
        onClick={this.onToggle}
        toggled={toggled}
        innerRef={(e) => {
          this.toggle = e;
        }}
      >
        <Button toggled={toggled} />
      </Slider>
    );
  }
}

Toggle.propTypes = {
  defaultToggled: PropTypes.bool,
  onClick: PropTypes.func
};

Toggle.defaultProps = {
  defaultToggled: false
};

export default Toggle;
