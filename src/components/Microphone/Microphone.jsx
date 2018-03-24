import { Component } from 'react';
import PropTypes from 'prop-types';

class Microphone extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };

  static contextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object
  }

  static childContextTypes = {
    audioContext: PropTypes.object,
    connectNode: PropTypes.object,
    audioSource: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.getMicrophoneStream();
  }

  state = {
    audioSource: null
  }

  getChildContext() {
    return {
      ...this.context,
      audioSource: this.state.audioSource
    };
  }

  getMicrophoneStream = () => {
    console.log('try to get audio stream');
    // Attempt to get audio input
    try {
      // monkeypatch getUserMedia
      navigator.getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      // ask for an audio input
      navigator.getUserMedia(
        {
          audio: {
            mandatory: {
              googEchoCancellation: 'false',
              googAutoGainControl: 'false',
              googNoiseSuppression: 'false',
              googHighpassFilter: 'false'
            },
            optional: []
          }
        },
        (stream) => this.setState({ audioSource: stream }),
        () => console.log('No stream found.')
      );
    } catch (e) {
      console.error('User microphone unavailable');
    }
  };

  render() {
    return this.props.children;
  }
}

export default Microphone;
