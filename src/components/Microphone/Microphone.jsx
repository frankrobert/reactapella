import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Microphone extends Component {
  static propTypes = {
    audioContext: PropTypes.object,
    nodes: PropTypes.nodes,
    createAudioNodes: PropTypes.func
  };

  componentDidMount() {
    this.getMicrophoneStream();
  }

  getMicrophoneStream = () => {
    const { audioContext, nodes, createAudioNodes } = this.props;

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
          const audioSource = audioContext.createMediaStreamSource(stream);

          if (nodes) {
            const newNodes = [{ id: 'mic', audioNode: audioSource, connections: nodes }];

            createAudioNodes(newNodes);
          }
        },
        () => console.log('No stream found.')
      );
    } catch (e) {
      console.error('User microphone unavailable');
    }
  };

  render() {
    return null;
  }
}

export default Microphone;
