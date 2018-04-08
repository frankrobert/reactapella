import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RemoteControl extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    links: PropTypes.array,
    onGetComponentById: PropTypes.func,
    onChange: PropTypes.func
  };

  onChange = (value) => {
    const { links, onGetComponentById, onChange } = this.props;

    links.forEach((link) => {
      const component = onGetComponentById(link.id);
      const computedValue = this.calculateComputedValue(value, link.rateOfChange);

      component.onChange(computedValue);
    });

    onChange(value);
  };

  invertedValue = (value) => {
    if (value === 50) return value;

    return 100 - value;
  }

  calculateComputedValue = (value, rateOfChange) => {
    switch(rateOfChange) {
      case 'inverted': {
        return this.invertedValue(value);
      }
      default: {
        return value;
      }
    }
  }

  render() {
    const { children, ...rest } = this.props;
    const newElements = React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        ...rest,
        onChange: this.onChange
      });
    });

    if (!newElements) return null;

    return newElements;
  }
}

export default RemoteControl;
