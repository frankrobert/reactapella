import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GainNode extends Component {
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
    value: null,
    gainNode: null
  };

  componentDidMount() {
    this.getGainNode();
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

  getGainNode = () => {
    const { audioContext, audioDestination, children, currentNode } = this.props;
    const [initialValue] = children.map((child) => child.props.initialValue);

    if (!audioContext || !currentNode || !audioDestination) {
      return setTimeout(this.getGainNode, 50);
    }

    const gainNode = audioContext.createGain();

    currentNode.connect(gainNode);
    this.setState({ gainNode, value: initialValue });
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
