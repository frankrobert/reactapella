import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ReactWebAudioContext = React.createContext({});

class AudioContext extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ])
  };

  state = {
    audioContext: null,
    nodeList: []
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
    const { nodeList } = this.state;
    const ids = nodeList.map((ref) => ref.id);

    console.log('NEW ID', id, 'IDS: ', ids);

    if (!ids.includes(id)) {
      this.setState((prevState) => {
        return {
          nodeList: prevState.nodeList.concat([{ id, node, component }])
        };
      });
    }
  };

  getNodeById = (id) => {
    const { nodeList } = this.state;
    const { node } = nodeList.find((ref) => ref.id === id) || {};

    return node;
  };

  getComponentById = (id) => {
    const { nodeList } = this.state;
    const { component } = nodeList.find((ref) => ref.id === id) || {};

    return component;
  };

  render() {
    const { children } = this.props;
    const data = {
      ...this.state,
      master: this,
      onSetNodeById: this.setNodeById,
      onGetNodeById: this.getNodeById,
      onGetComponentById: this.getComponentById
    };

    const childrenWithAudio = React.Children.map(children, (child) => {
      if (typeof child.type === 'function') return React.cloneElement(child, data);

      return child;
    });

    return (
      <ReactWebAudioContext.Provider value={data}>
        {childrenWithAudio}
      </ReactWebAudioContext.Provider>
    );
  }
}

export const ReactWebAudioConsumer = ReactWebAudioContext.Consumer;

export default AudioContext;
