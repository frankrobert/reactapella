import { Component } from 'react';
import PropTypes from 'prop-types';

class AudioContext extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };

  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object
  };

  constructor() {
    super();
    this.audioContext = new (window.AudioContext =
      window.AudioContext || window.webkitAudioContext)();
  }

  getChildContext() {
    return {
      audioContext: this.audioContext,
      connectNode: this.audioContext.destination
    };
  }

  componentDidCatch = (error, info) => {
    console.error('error: ', error);
    console.error('info: ', info);
  };

  render() {
    return this.props.children;
  }
}

export default AudioContext;
