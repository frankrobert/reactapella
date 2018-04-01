import React, { Component } from 'react';
import PropTypes from 'prop-types';

class AudioContext extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  constructor(props) {
    super(props);
    this.nodeList = [];
  }

  state = {
    audioContext: null
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

    this.setState({ audioContext });
  };

  setNodeById = (id, node) => {
    const ids = this.nodeList.map((ref) => ref.id);

    if (!ids.includes(id)) this.nodeList.push({ id, node });
  }

  getNodeById = (id) => {
    const { node } = this.nodeList.find((ref) => ref.id === id);

    return node;
  };

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        ...this.state,
        onSetNodeById: this.setNodeById,
        onGetNodeById: this.getNodeById
      });
    });

    return children;
  }
}

export default AudioContext;
