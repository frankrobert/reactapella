import React, { Component } from 'react';
import PropTypes from 'prop-types';

class StereoPanner extends Component {
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
    options: PropTypes.object,
    onChange: PropTypes.func,
    passThrough: PropTypes.bool,
    params: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ])
  };

  static defaultProps = {
    options: {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.audioContext && nextProps.currentNode && !prevState.stereoPannerNode) {
      const stereoPannerNode = new StereoPannerNode(nextProps.audioContext, nextProps.options);
      const value = nextProps.initialValue || 0;

      stereoPannerNode.pan.setValueAtTime(value / 100, 0);
      
      return { stereoPannerNode, value };
    }

    return null;
  }

  state = {
    value: null,
    stereoPannerNode: null
  };

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.stereoPannerNode && this.state.stereoPannerNode) {
      this.props.currentNode.connect(this.state.stereoPannerNode);

      if (prevProps.id) this.props.onSetNodeById(prevProps.id, this.state.stereoPannerNode, this);
      if (prevProps.destination) this.state.stereoPannerNode.connect(prevProps.audioContext.destination);

      if (prevProps.params && prevProps.params.length) {
        if (Array.isArray(prevProps.params)) {
          prevProps.params.forEach((param) => {
            prevProps.currentNode.connect(this.state.stereoPannerNode[param]);
          });
        } else {
          prevProps.currentNode.connect(this.state.stereoPannerNode[prevProps.params]);
        }
      }

      if (prevProps.connections && prevProps.connections.length) {
        prevProps.connections.forEach((connection) => {
          const { params = [], id } = connection;
          const node = prevProps.onGetNodeById(id);

          if (params && params.length) {
            params.forEach((param) => node.connect(this.state.stereoPannerNode[param]));
          } else {
            node.connect(this.state.stereoPannerNode);
          }
        });
      }
    }
  }

  onChange = (value) => {
    const { onChange, passThrough } = this.props;
    const { stereoPannerNode } = this.state;

    this.setState({ value });

    stereoPannerNode.pan.value = (value / 100) * 2 - 1;
    if (passThrough) onChange(value);
  };

  render() {
    const { stereoPannerNode } = this.state;
    const { children, currentNode, options, id, connections, params, destination, passThrough, ...rest } = this.props;
    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        ...this.state,
        currentNode: stereoPannerNode,
        onChange: this.onChange
      });
    });

    if (!newElements) return null;

    return newElements;
  }
}

export default StereoPanner;
