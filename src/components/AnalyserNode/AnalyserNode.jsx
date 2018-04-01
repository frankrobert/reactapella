import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Analyser extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    audioContext: PropTypes.object,
    currentNode: PropTypes.object,
    id: PropTypes.string,
    destination: PropTypes.bool,
    options: PropTypes.object,
    onSetNodeById: PropTypes.func,
    onGetNodeById: PropTypes.func,
    connections: PropTypes.array
  };

  static defaultProps = {
    options: {
      smoothingTimeConstant: 0.3,
      fftSize: 256
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.audioContext && nextProps.currentNode && !prevState.analyserNode) {
      const analyserNode = new AnalyserNode(nextProps.audioContext, ...nextProps.options);

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
      this.state.audioDataNode.connect(this.props.audioContext.destination);
      
      if (prevProps.id) this.props.onSetNodeById(prevProps.id, this.state.gainNode);
      if (this.props.destination) this.state.analyserNode.connect(this.props.audioContext.destination);
      if (prevProps.connections && prevProps.connections.length) {
        prevProps.connections.forEach((connection) => {
          const { params = [], id } = connection;
          const node = prevProps.onGetNodeById(id);

          if (params && params.length) {
            params.forEach((param) => node.connect(this.state.analyserNode[param]));
          } else {
            node.connect(this.state.analyserNode);
          }
        });
      }
    }
  }

  getAverageVolume = (analyserFreqArray) => {
    // get all the frequency amplitudes
    const values = analyserFreqArray.reduce((a, b) => a + b, 0);
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

export default Analyser;
