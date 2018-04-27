import { Component } from 'react';
import PropTypes from 'prop-types';
import { FUTURE_EVENT } from '../../constants/constants';
import createAudioNode from '../AudioNode/AudioNode';

class Gain extends Component {
  static propTypes = {
    audioContext: PropTypes.object
  };

  // TODO: Standardize all onChange methods
  onChange = (value, param = 'gain') => {
    const { audioContext } = this.props;
    const { audioNode } = this.state;

    this.setState({ [param]: value });

    // TODO: Add rebound
    let computedValue = value / 100;

    if (computedValue === 0) computedValue = 0.01;

    audioNode[param].exponentialRampToValueAtTime(
      computedValue,
      audioContext.currentTime + FUTURE_EVENT
    );
  };
}

export default createAudioNode(Gain, GainNode);
