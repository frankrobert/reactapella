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
    options: {}
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.audioContext &&
      nextProps.currentNode &&
      !prevState.audioNode
    ) {
      const audioNode = new AnalyserNode(
        nextProps.audioContext,
        nextProps.options
      );

      return { audioNode };
    }

    return null;
  }

  state = {
    value: 0,
    audioNode: null,
    audioDataNode: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.audioNode && this.state.audioNode) {
      this.createAnalyser();
    }

    if (!prevState.audioDataNode && this.state.audioDataNode) {
      this.props.currentNode.connect(this.state.audioNode);
      this.state.audioNode.connect(this.state.audioDataNode);
      this.state.audioDataNode.connect(this.props.audioContext.destination);

      if (prevProps.id)
        this.props.onSetNodeById(prevProps.id, this.state.audioNode, this);
      if (this.props.destination)
        this.state.audioNode.connect(this.props.audioContext.destination);
      if (prevProps.connections && prevProps.connections.length) {
        this.setupConnections(prevProps.connections);
      }
    }
  }

  setupConnections = (connections) => {
    const { onGetNodeById } = this.props;
    const nodes = connections
      .map((connection) => onGetNodeById(connection.id))
      .filter(Boolean); // filter out falsy values

    if (!nodes.length || nodes.length !== connections.length) {
      return setTimeout(() => this.setupConnections(connections), 300);
    }

    nodes.forEach((node, i) => {
      if (connections[i].params && connections[i].params.length) {
        connections[i].params.forEach((param) =>
          this.state.audioNode.connect(node[param])
        );
      } else {
        this.state.audioNode.connect(node);
      }
    });
  };

  getAverageVolume = (analyserFreqArray) => {
    // get all the frequency amplitudes
    const values = analyserFreqArray.reduce((a, b) => a + b, 0);
    const average = values / analyserFreqArray.length;

    return average;
  };

  // checkClipping = (analyserFreqArray) => {
  //   // Iterate through buffer to check if any of the |values| exceeds 1
  //   // const isClipping = analyserFreqArray
  //   //   .map((buffer) => Math.abs(buffer) >= 1.0)
  //   //   .filter(Boolean);

  //   // console.log(isClipping.length);
  //   let isClipping = false;

  //   for (let i = 0; i < analyserFreqArray.length; i++) { // eslint-disable-line
  //     const val = analyserFreqArray[i];

  //   	if (Math.abs(val) >= 1.0) {
  //   		isClipping = true;
  //   	}
  //   }

  //   return isClipping;
  // };

  createAnalyser = () => {
    const { audioNode } = this.state;
    const { audioContext } = this.props;
    const audioDataNode = audioContext.createScriptProcessor(2048, 1, 1);

    audioDataNode.onaudioprocess = () => {
      // get the average, bincount is fftsize / 2
      const analyserFreqArray = new Uint8Array(audioNode.frequencyBinCount);

      audioNode.getByteFrequencyData(analyserFreqArray);

      const average = this.getAverageVolume(analyserFreqArray);

      this.setState({ value: average });
    };

    this.setState({ audioDataNode });
  };

  render() {
    const { audioNode, value } = this.state;
    const { children, audioContext, currentNode, ...rest } = this.props;
    const childrenWithProps = children && React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        value,
        currentNode: audioNode
      });
    });

    return childrenWithProps || null;
  }
}

export default Analyser;
