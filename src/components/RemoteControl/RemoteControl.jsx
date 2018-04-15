import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RemoteControl extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    controls: PropTypes.array,
    onGetComponentById: PropTypes.func
  };

  onChange = (value, range) => {
    const { controls, onGetComponentById } = this.props;

    controls.forEach((control) => {
      const component = onGetComponentById(control.id);
      const computedValue = this.calculateComputedValue(
        value,
        control.rateOfChange
      );

      component.onChange(computedValue, control.param, range);
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
