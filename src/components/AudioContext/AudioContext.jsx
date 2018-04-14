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
    this.setAudioContext();
  }

  componentWillUnmount() {
    const { audioContext } = this.state;

    audioContext.close();
  }

  setAudioContext = () => {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioContext = new window.AudioContext();

    this.setState({ audioContext });
  };

  setNodeById = (id, node, component) => {
    const ids = this.nodeList.map((ref) => ref.id);

    if (!ids.includes(id)) this.nodeList.push({ id, node, component });
  };

  getNodeById = (id) => {
    const { node } = this.nodeList.find((ref) => ref.id === id) || {};

    return node;
  };

  getComponentById = (id) => {
    const { component } = this.nodeList.find((ref) => ref.id === id) || {};

    return component;
  };

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        ...this.state,
        onSetNodeById: this.setNodeById,
        onGetNodeById: this.getNodeById,
        onGetComponentById: this.getComponentById
      });
    });

    return children;
  }
}

export default AudioContext;
