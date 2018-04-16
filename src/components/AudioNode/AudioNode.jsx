import React from 'react';
import PropTypes from 'prop-types';
import { getDisplayName } from '../../lib/helpers';

export default function createAudioNode(WrappedComponent, AudioNodeConstructor) {
  return class AudioNode extends WrappedComponent {
    static displayName = getDisplayName(WrappedComponent);
    static propTypes = {
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
      ]),
      audioContext: PropTypes.object,
      currentNode: PropTypes.object,
      source: PropTypes.bool,
      id: PropTypes.string,
      destination: PropTypes.bool,
      onSetNodeById: PropTypes.func,
      onGetNodeById: PropTypes.func,
      connections: PropTypes.array,
      options: PropTypes.object,
      params: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
    };

    static defaultProps = {
      options: {}
    };

    static getDerivedStateFromProps(nextProps, prevState) {
      if (
        nextProps.audioContext
        && (nextProps.currentNode || nextProps.source)
        && !prevState.audioNode
      ) {
        const audioNode = new AudioNodeConstructor(
          nextProps.audioContext,
          nextProps.options
        );

        return { audioNode };
      }

      return null;
    }

    state = {
      audioNode: null
    };

    componentDidUpdate(prevProps, prevState) {
      if (!prevState.audioNode && this.state.audioNode) {
        if (!prevProps.source) this.props.currentNode.connect(this.state.audioNode);

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

    setupParams = (params) => {
      const { currentNode, source } = this.props;

      if (source) return;

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
        destination,
        params, // TODO figure out what to name this/how to use it
        options,
        source,
        ...rest
      } = this.props;
      const childrenWithProps = children && React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          ...rest,
          ...this.state,
          currentNode: audioNode
        });
      });

      return childrenWithProps || null;
    }
  }
}
