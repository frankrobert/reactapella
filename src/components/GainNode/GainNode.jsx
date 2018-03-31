import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GainNode extends Component {
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
    if (nextProps.audioContext && nextProps.currentNode && !prevState.gainNode) {
      const gainNode = nextProps.audioContext.createGain();
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

      if (prevProps.destination) this.state.gainNode.connect(prevProps.audioDestination);
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

    return newElements;
  }
}

export default GainNode;
