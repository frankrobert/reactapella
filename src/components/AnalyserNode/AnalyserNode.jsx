import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AnalyserNode extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    audioContext: PropTypes.object,
    audioDestination: PropTypes.object,
    currentNode: PropTypes.object,
    id: PropTypes.string,
    destination: PropTypes.bool
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.audioContext && nextProps.currentNode && !prevState.analyserNode) {
      const analyserNode = nextProps.audioContext.createAnalyser();

      analyserNode.smoothingTimeConstant = 0.3;
      analyserNode.fftSize = 256;
  
      return { analyserNode };
    }

    return null;
  }

  state = {
    value: 0,
    analyserNode: null,
    audioDataNode: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.analyserNode && this.state.analyserNode) {
      this.createAnalyser();
    }

    if (!prevState.audioDataNode && this.state.audioDataNode) {
      this.props.currentNode.connect(this.state.analyserNode);
      this.state.analyserNode.connect(this.state.audioDataNode);
      this.state.audioDataNode.connect(this.props.audioDestination);
      

      if (this.props.destination) this.state.analyserNode.connect(this.props.audioDestination);
    }
    
  }

  getAverageVolume = (analyserFreqArray) => {
    let values = 0;

    // get all the frequency amplitudes
    analyserFreqArray.forEach((value) => (values += value)); // eslint-disable-line

    const average = values / analyserFreqArray.length;

    return average;
  };

  createAnalyser = () => {
    const { analyserNode } = this.state;
    const { audioContext } = this.props;
    const audioDataNode = audioContext.createScriptProcessor(2048, 1, 1);
    
    audioDataNode.onaudioprocess = () => {
      // get the average, bincount is fftsize / 2
      const analyserFreqArray = new Uint8Array(analyserNode.frequencyBinCount);

      analyserNode.getByteFrequencyData(analyserFreqArray);

      const average = this.getAverageVolume(analyserFreqArray);

      this.setState({ value: average });
    };

    this.setState({ audioDataNode });
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
