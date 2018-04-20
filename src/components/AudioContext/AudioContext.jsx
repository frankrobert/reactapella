import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ReactWebAudioContext = React.createContext({});

class AudioContext extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    nodes: PropTypes.array
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
    const { nodes } = this.props;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    const audioContext = new window.AudioContext();

    this.setState({ audioContext }, () => {
      if (nodes) this.createAudioNodes(nodes);
    });
  };

  setNodeById = (id, node, component) => {
    const { nodeList } = this.state;
    const ids = nodeList.map((ref) => ref.id);

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

  getValueById = (id) => {
    const { nodeList } = this.state;
    const { value } = nodeList.find((ref) => ref.id === id) || {};

    return value;
  };

  updateValueById = (id, value) => {
    this.setState((prevState) => {
      const nodeListWithValue = prevState.nodeList.map((node) => {
        if (node.id === id) return Object.assign({}, node, { value });

        return node;
      });

      return { nodeList: nodeListWithValue }
    });
  };

  createAudioNodes = (nodes) => {
    const { audioContext } = this.state;
    const flattenedNodes = []; // react state

    nodes.forEach((node) => {
      let current = node;
      let last = current;

      current.next = null;
      current.depth = 0;

      while (current) {
        const children = current.connections;

        if (!current.visited) {
          const { connections, audioNode, ...rest } = current;

          if (!(current.audioNode instanceof AudioNode)) {
            current.audioNode = new window[current.audioNode.type](
              audioContext,
              current.audioNode.options
            );
          }

          flattenedNodes.push({ ...rest, audioNode: current.audioNode });
        }

        if (current.depth === 0) current.visited = true;

        if (!current.connections) {
          break;
        }

        // eslint-disable-next-line
        children.forEach((child) => {
          if (!child.visited) {
            const { connections, audioNode, ...rest } = child;

            if (!(child.audioNode instanceof AudioNode)) {
              child.audioNode = new window[child.audioNode.type]( // eslint-disable-line no-param-reassign
                audioContext,
                child.audioNode.options
              );
            }

            flattenedNodes.push({ ...rest, audioNode: child.audioNode });
          }

          current.audioNode.connect(child.audioNode);
          if (child.destination) child.audioNode.connect(audioContext.destination);

          child.next = null; // eslint-disable-line no-param-reassign
          child.visited = true; // eslint-disable-line no-param-reassign
          child.depth = current.depth + 1; // eslint-disable-line no-param-reassign
          //place new item at the tail of the list
          last.next = child;
          last = child;
        });
        //removes this item from the linked list
        current = current.next;
      }
    });

    this.setState(
      { nodeList: flattenedNodes },
      () => this.connectRemoteNodes(flattenedNodes)
    );
  }

  connectRemoteNodes = (nodes) => {
    const remoteNodes = nodes.filter((node) => {
      const keys = Object.keys(node);

      return keys.includes('remoteControls');
    });

    remoteNodes.forEach((remoteNode) => {
      remoteNode.remoteControls.forEach((control) => {
        const remote = nodes.find((node) => node.id === control.id);

        if (!control.params) {
          remoteNode.audioNode.connect(remote.audioNode);
        } else {
          control.params.forEach((param) => {
            remoteNode.audioNode.connect(remote.audioNode[param]);
          });
        }
      });
    });
  };

  render() {
    const { children } = this.props;
    const data = {
      ...this.state,
      master: this,
      onSetNodeById: this.setNodeById,
      onGetNodeById: this.getNodeById,
      onGetComponentById: this.getComponentById,
      updateValueById: this.updateValueById,
      getValueById: this.getValueById,
      createAudioNodes: this.createAudioNodes
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
