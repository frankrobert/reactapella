import { Component } from 'react';
import PropTypes from 'prop-types';
import { FUTURE_EVENT } from '../../constants/constants';
import createAudioNode from '../AudioNode/AudioNode';

class Gain extends Component {
  static propTypes = {
    audioContext: PropTypes.object
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.audioContext &&
      nextProps.currentNode &&
      !prevState.audioNode
    ) {
      const audioNode = new GainNode(nextProps.audioContext, nextProps.options);
      const value = nextProps.initialValue || 100;

      audioNode.gain.setValueAtTime(value / 100, 0);

      return { audioNode, value };
    }

    return null;
  }

  state = {
    audioNode: null
  };

  onChange = (value, oldRange, param) => {
    const { audioContext } = this.props;
    const { audioNode } = this.state;

    this.setState({ [param]: value });

    let newValue = value / 100;

    if (newValue === 0) newValue = 0.01;

    audioNode.gain.exponentialRampToValueAtTime(
      newValue,
      audioContext.currentTime + FUTURE_EVENT
    );
  };
}

export default createAudioNode(Gain);
