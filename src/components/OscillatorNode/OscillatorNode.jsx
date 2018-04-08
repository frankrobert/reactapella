import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Oscillator extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    audioContext: PropTypes.object,
    currentNode: PropTypes.object,
    id: PropTypes.string,
    destination: PropTypes.bool,
    onSetNodeById: PropTypes.func,
    onGetNodeById: PropTypes.func,
    connections: PropTypes.array,
    options: PropTypes.object,
    onChange: PropTypes.func,
    passThrough: PropTypes.bool,
    params: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ])
  };

  static defaultProps = {
    options: {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.audioContext && !prevState.audioNode) {
      const audioNode = new OscillatorNode(nextProps.audioContext, nextProps.options);

      return { audioNode };
    }

    return null;
  }

  state = {
    value: null,
    audioNode: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.audioNode && this.state.audioNode) {
      if (prevProps.id) this.props.onSetNodeById(prevProps.id, this.state.audioNode, this);
      if (prevProps.destination) this.state.audioNode.connect(prevProps.audioContext.destination);

      if (prevProps.connections && prevProps.connections.length) {
        this.setupConnections(prevProps.connections);
      }
    }
  }


  // TODO: review this
  // onChange = (value) => {
  //   const { onChange, passThrough } = this.props;
  //   const { oscillatorNode } = this.state;

  //   this.setState({ value });

  //   oscillatorNode.pan.value = (value / 100) * 2 - 1;
  //   if (passThrough) onChange(value);
  // };

  onClick = () => {
    const { audioNode } = this.state;

    audioNode.start();
  }


  setupConnections = (connections) => {
    const { onGetNodeById } = this.props;
    const nodes = connections.filter((connection) => onGetNodeById(connection.id))

    if (!nodes.length || nodes.length !== connections.length) {
      return setTimeout(() => this.setupConnections(connections), 300);
    }

    nodes.forEach((node, i) => {
      if (connections[i].params && connections[i].params.length) {
        connections[i].params.forEach((param) => this.state.audioNode.connect(node[param]));
      } else {
        this.state.audioNode.connect(node);
      }
    });
  }

  render() {
    const { audioNode } = this.state;
    const { children, currentNode, options, connections, ...rest } = this.props;

    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        ...this.state,
        currentNode: audioNode,
        // onChange: this.onChange
        onClick: this.onClick
      });
    });

    if (!newElements) return null;

    return newElements;
  }
}

export default Oscillator;
