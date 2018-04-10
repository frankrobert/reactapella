import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StereoPanner extends Component {
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
    params: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
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
      const audioNode = new StereoPannerNode(
        nextProps.audioContext,
        nextProps.options
      );
      const value = nextProps.initialValue || 0;

      audioNode.pan.setValueAtTime(value / 100, 0);

      return { audioNode, value };
    }

    return null;
  }

  state = {
    value: null,
    audioNode: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.audioNode && this.state.audioNode) {
      this.props.currentNode.connect(this.state.audioNode);

      if (prevProps.id)
        this.props.onSetNodeById(prevProps.id, this.state.audioNode, this);
      if (prevProps.destination)
        this.state.audioNode.connect(prevProps.audioContext.destination);

      if (prevProps.params && prevProps.params.length) {
        this.setupParams(prevProps.params);
      }

      if (prevProps.connections && prevProps.connections.length) {
        this.setupConnections(prevProps.connections);
      }
    }
  }

  onChange = (value) => {
    const { onChange, passThrough } = this.props;
    const { audioNode } = this.state;

    this.setState({ value });

    audioNode.pan.setValueAtTime(value / 100 * 2 - 1, 0);
    if (passThrough) onChange(value);
  };

  setupParams = (params) => {
    const { currentNode } = this.props;

    if (Array.isArray(params)) {
      params.forEach((param) =>
        currentNode.connect(this.state.audioNode[param])
      );
    } else {
      currentNode.connect(this.state.audioNode[params]);
    }
  };

  setupConnections = (connections) => {
    const { onGetNodeById } = this.props;
    const nodes = connections
      .map((connection) => onGetNodeById(connection.id))
      .filter(Boolean); // filter out falsey values

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

  render() {
    const { audioNode } = this.state;
    const {
      children,
      currentNode,
      options,
      id,
      connections,
      params,
      destination,
      passThrough,
      ...rest
    } = this.props;
    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        ...this.state,
        currentNode: audioNode,
        onChange: this.onChange
      });
    });

    if (!newElements) return null;

    return newElements;
  }
}

export default StereoPanner;
