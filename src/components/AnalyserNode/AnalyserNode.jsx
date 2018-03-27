import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AnalyserNode extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    audioContext: PropTypes.object.isRequired,
    audioDestination: PropTypes.object.isRequired,
    currentNode: PropTypes.object.isRequired
  };

  state = {
    value: 0
  };

  componentDidMount() {
    this.getAnalyserNodes();
  }

  getAnalyserNodes = () => {
    const { audioContext, audioDestination, currentNode } = this.props;

    if (!audioContext || !currentNode || !audioDestination) {
      return setTimeout(this.getAnalyserNodes, 50);
    }

    const analyserNode = audioContext.createAnalyser();

    analyserNode.smoothingTimeConstant = 0.3;
    analyserNode.fftSize = 256;

    const audioData = audioContext.createScriptProcessor(2048, 1, 1);

    audioData.onaudioprocess = () => {
      // get the average, bincount is fftsize / 2
      const analyserFreqArray = new Uint8Array(analyserNode.frequencyBinCount);

      analyserNode.getByteFrequencyData(analyserFreqArray);

      const average = this.getAverageVolume(analyserFreqArray);

      this.setState({ value: average });
    };

    audioData.connect(audioDestination);
    currentNode.connect(analyserNode);
    analyserNode.connect(audioData);
  };

  getAverageVolume = (analyserFreqArray) => {
    let values = 0;

    // get all the frequency amplitudes
    analyserFreqArray.forEach((value) => (values += value)); // eslint-disable-line

    const average = values / analyserFreqArray.length;

    return average;
  };

  render() {
    const { analyserNode, value } = this.state;
    const { children, audioContext, currentNode, ...rest } = this.props;
    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        value,
        currentNode: analyserNode
      });
    });

    return newElements;
  }
}

export default AnalyserNode;
