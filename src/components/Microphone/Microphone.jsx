import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Microphone extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    audioContext: PropTypes.object.isRequired
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
          console.log('MICROPHONE PROPS: ', this.props);
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
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { ...this.props, ...this.state });
    });

    return children;
  }
}

export default Microphone;
