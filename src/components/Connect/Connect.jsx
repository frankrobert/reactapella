import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

class Connect extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    // fromId: PropTypes.string,
    value: PropTypes.string,
    currentNode: PropTypes.object
  };

  render() {
    const { children, value, currentNode /*, fromId */ } = this.props;
    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        value: get(currentNode, value)
      });
    });

    return newElements;
  }
}

export default Connect;
