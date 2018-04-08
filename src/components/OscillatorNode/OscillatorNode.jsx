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
    if (nextProps.audioContext && !prevState.oscillatorNode) {
      const oscillatorNode = new OscillatorNode(nextProps.audioContext, nextProps.options);

      return { oscillatorNode };
    }

    return null;
  }

  state = {
    value: null,
    oscillatorNode: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.oscillatorNode && this.state.oscillatorNode) {
      if (prevProps.id) this.props.onSetNodeById(prevProps.id, this.state.oscillatorNode, this);
      if (prevProps.destination) this.state.oscillatorNode.connect(prevProps.audioContext.destination);

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
    const { oscillatorNode } = this.state;

    oscillatorNode.start();
  }


  setupConnections = (connections) => {
    const { onGetNodeById } = this.props;
    const nodes = connections
      .map((connection) => onGetNodeById(connection.id))
      .filter(Boolean);

    if (!nodes.length || nodes.length !== connections.length) {
      return setTimeout(() => this.setupConnections(connections), 300);
    }

    nodes.forEach((node, i) => {
      if (connections[i].params && connections[i].params.length) {
        connections[i].params.forEach((param) => this.state.oscillatorNode.connect(node[param]));
      } else {
        this.state.oscillatorNode.connect(node);
      }
    });
  }

  render() {
    const { oscillatorNode } = this.state;
    const { children, currentNode, options, connections, ...rest } = this.props;

    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        ...this.state,
        currentNode: oscillatorNode,
        // onChange: this.onChange
        onClick: this.onClick
      });
    });

    if (!newElements) return null;

    return newElements;
  }
}

export default Oscillator;
