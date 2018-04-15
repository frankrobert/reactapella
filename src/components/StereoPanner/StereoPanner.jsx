import { Component } from 'react';
import PropTypes from 'prop-types';
import { FUTURE_EVENT } from '../../constants/constants';
import createAudioNode from '../AudioNode/AudioNode';

class StereoPanner extends Component {
  static propTypes = {
    audioContext: PropTypes.object
  };

  onChange = (value, param = 'pan') => {
    const { audioContext } = this.props;
    const { audioNode } = this.state;

    // TODO Add rebound
    // const range = this.getRange(param);
    // const computedValue = rebound(oldRange, range, value);
    this.setState({ [param]: value });

    const computedValue = value / 100 * 2 - 1;

    audioNode[param].setValueAtTime(
      computedValue,
      audioContext.currentTime + FUTURE_EVENT
    );
  };
}

export default createAudioNode(StereoPanner, StereoPannerNode);
