/* eslint-disable */
import { Component } from 'react';
import PropTypes from 'prop-types';
import { FUTURE_EVENT } from '../../constants/constants';
import createAudioNode from '../AudioNode/AudioNode';

class BiquadFilter extends Component {
  static propTypes = {
    audioContext: PropTypes.object
  };

  onChange = (value, oldRange, param) => {
    const { audioContext } = this.props;
    const { audioNode } = this.state;

    // TODO: Write a `rebound` method
    const newRange = this.getRange(param);
    const newValue = rebound(...oldRange, ...newRange, value);

    this.setState({ value });

    audioNode[param].setValueAtTime(
      newValue,
      audioContext.currentTime + FUTURE_EVENT
    );
  };

  getRange = (param) => {
    // TODO Find detailed ranges
    switch(param) {
      case 'frequency': {
        return [20, 20000];
      }
      case 'Q': {
        return [0, 1];
      }
      case 'gain': {
        return [0.001, 1];
      }
      default: {
        // TODO Find a good default range / param (probably frequency);
        return [20, 20000];
      }
    }
  };
}

export default createAudioNode(BiquadFilter, BiquadFilterNode);
