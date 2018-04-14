import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Button from '../Button/Button';
import { COLORS } from '../../constants/constants';

const ActiveText = styled.p`
  color: ${COLORS.WHITE};
  font-weight: bold;
  font-size: 16px;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  position: absolute;
`;

const ActiveState = styled.div`
  height: 10px;
  width: 10px;
  background-color: ${(props) =>
    props.isActive ? COLORS.GREEN : COLORS.YELLOW};
  border-radius: 50%;
  border: 2px solid #222;
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

class ControlButton extends Component {
  state = {
    isActive: false
  };

  onClick = () => {
    const { mode } = this.props;

    this.setState((prevState) => ({
      isActive: mode === 'toggle' ? !prevState.isActive : true
    }));
  };

  onMouseUp = () => {
    const { mode } = this.props;

    if (mode === 'active') this.setState({ isActive: false });
  };

  render() {
    const { isActive } = this.state;

    return (
      <Button onMouseDown={this.onClick} onMouseUp={this.onMouseUp}>
        <ActiveText>{isActive ? 'Active' : 'Inactive'}</ActiveText>
        <ActiveState isActive={isActive} />
      </Button>
    );
  }
}

ControlButton.propTypes = {
  mode: PropTypes.string
};

ControlButton.defaultProps = {
  mode: 'toggle'
};

export default ControlButton;
