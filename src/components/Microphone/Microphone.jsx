import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Microphone extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    audioContext: PropTypes.object,
    source: PropTypes.bool
  };

  state = {
    audioSource: null
  };

  componentDidMount() {
    this.getMicrophoneStream();
  }

  getMicrophoneStream = () => {
    const { audioContext } = this.props;

    if (!audioContext) {
      // TODO: Leverage EventEmitter to avoid looping
      return setTimeout(this.getMicrophoneStream, 50);
    }

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
              googEchoCancellation: 'true',
              googAutoGainControl: 'false',
              googNoiseSuppression: 'false',
              googHighpassFilter: 'false'
            },
            optional: []
          }
        },
        (stream) => {
          const audioSource = audioContext.createMediaStreamSource(stream);

          this.setState({ audioSource });
        },
        () => console.log('No stream found.')
      );
    } catch (e) {
      console.error('User microphone unavailable');
    }
  };

  render() {
    const { children, source, ...rest } = this.props;
    const { audioSource } = this.state;
    const childrenWithProps = children && React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        ...this.state,
        currentNode: audioSource
      });
    });

    return childrenWithProps || null;
  }
}

export default Microphone;
