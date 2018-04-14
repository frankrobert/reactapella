import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FUTURE_EVENT } from '../../constants/constants';

class Gain extends Component {
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
    options: PropTypes.object
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
      const audioNode = new GainNode(nextProps.audioContext, nextProps.options);
      const value = nextProps.initialValue || 100;

      audioNode.gain.setValueAtTime(value / 100, 0);

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
      if (prevProps.connections && prevProps.connections.length) {
        this.setupConnections(prevProps.connections);
      }
    }
  }

  onChange = (value) => {
    const { audioContext } = this.props;
    const { audioNode } = this.state;

    this.setState({ value });

    let newValue = value / 100;

    if (newValue === 0) newValue = 0.01;

    audioNode.gain.exponentialRampToValueAtTime(
      newValue,
      audioContext.currentTime + FUTURE_EVENT
    );
  };

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

  render() {
    const { audioNode } = this.state;
    const {
      children,
      currentNode,
      id,
      connections,
      options,
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

export default Gain;
