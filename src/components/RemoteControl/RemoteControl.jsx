import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RemoteControl extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    links: PropTypes.array,
    onGetComponentById: PropTypes.func
  };

  onChange = (value) => {
    const { links, onGetComponentById } = this.props;

    links.forEach((link) => {
      const component = onGetComponentById(link.id);
      const computedValue = this.calculateComputedValue(
        value,
        link.rateOfChange
      );

      component.onChange(computedValue);
    });
  };

  invertedValue = (value) => {
    if (value === 50) return value;

    return 100 - value;
  };

  calculateComputedValue = (value, rateOfChange) => {
    switch (rateOfChange) {
      case 'inverted': {
        return this.invertedValue(value);
      }
      default: {
        return value;
      }
    }
  };

  render() {
    const { children } = this.props;
    const childrenWithChange = children && React.Children.map(children, (child) => {
      return React.cloneElement(child, { onChange: this.onChange });
    });

    return childrenWithChange || null;
  }
}

export default RemoteControl;
