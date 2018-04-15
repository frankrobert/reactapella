import { Component } from 'react';
import PropTypes from 'prop-types';
import { FUTURE_EVENT } from '../../constants/constants';
import createAudioNode from '../AudioNode/AudioNode';

class Gain extends Component {
  static propTypes = {
    audioContext: PropTypes.object
  };

  onChange = (value, oldRange, param = 'gain') => {
    const { audioContext } = this.props;
    const { audioNode } = this.state;

    this.setState({ [param]: value });

    let computedValue = value / 100;

    if (computedValue === 0) computedValue = 0.01;

    audioNode[param].exponentialRampToValueAtTime(
      computedValue,
      audioContext.currentTime + FUTURE_EVENT
    );
  };
}

export default createAudioNode(Gain, GainNode);
