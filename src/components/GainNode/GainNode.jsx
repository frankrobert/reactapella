import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.audioContext && nextProps.currentNode && !prevState.gainNode) {
      const gainNode = new GainNode(nextProps.audioContext, ...nextProps.options);
      const value = nextProps.initialValue || 0;

      gainNode.gain.setValueAtTime(value / 100, 0);
      
      return { gainNode, value };
    }

    return null;
  }

  state = {
    value: null,
    gainNode: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.gainNode && this.state.gainNode) {
      this.props.currentNode.connect(this.state.gainNode);

      if (prevProps.id) this.props.onSetNodeById(prevProps.id, this.state.gainNode);
      if (prevProps.destination) this.state.gainNode.connect(prevProps.audioContext.destination);
      if (prevProps.connections && prevProps.connections.length) {
        prevProps.connections.forEach((connection) => {
          const { params = [], id } = connection;
          const node = prevProps.onGetNodeById(id);

          if (params && params.length) {
            params.forEach((param) => node.connect(this.state.gainNode[param]));
          } else {
            node.connect(this.state.gainNode);
          }
        });
      }
    }
  }

  onChange = (value) => {
    const { audioContext } = this.props;
    const { gainNode } = this.state;

    this.setState({ value });

    let newValue = value / 100;

    if (newValue === 0) newValue = 0.01;

    gainNode.gain.exponentialRampToValueAtTime(
      newValue,
      audioContext.currentTime
    );
  };

  render() {
    const { gainNode } = this.state;
    const { children, currentNode, ...rest } = this.props;
    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        ...this.state,
        currentNode: gainNode,
        onChange: this.onChange
      });
    });

    if (!newElements) return null;

    return newElements;
  }
}

export default Gain;
