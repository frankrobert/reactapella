import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AudioContext extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };

  state = {
    audioContext: null,
    audioDestination: null
  };

  componentDidMount() {
    this.getAudioContext();
  }

  componentWillUnmount() {
    const { audioContext } = this.state;

    audioContext.close();
  }

  getAudioContext = () => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioContext = new window.AudioContext();

    this.setState({ audioContext, audioDestination: audioContext.destination });
  };

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, { ...this.state });
    });

    return children;
  }
}

export default AudioContext;
