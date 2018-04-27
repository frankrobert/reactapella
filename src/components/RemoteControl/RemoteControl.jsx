import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RemoteControl extends Component {
  // TODO: Consider a render prop for the chidren
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    controls: PropTypes.array,
    onGetComponentById: PropTypes.func,
    onGetNodeById: PropTypes.func,
    getValueById: PropTypes.func
  };

  state = {
    value: null
  };

  /**
   * @description Calculates the value of each affected audio node
   * and recomputes the value to send to its respective onChange.
   * @param {number} value The current raw value sent from the controlling component.
   * @param {Array[number]} range The value range for the control component.
   */
  onChange = (value, range) => {
    const { controls, onGetComponentById, onGetNodeById } = this.props;

    const components = controls
      .map((connection) => onGetNodeById(connection.id))
      .filter(Boolean); // filter out falsy values

    // This means that at least 1 AudioNode is not ready
    if (!components.length || components.length !== controls.length) {
      return;
    }

    // TODO: Need to recalibrate ranges here
    controls.forEach((control) => {
      const component = onGetComponentById(control.id) || {};
      const computedValue = this.calculateComputedValue(
        value,
        control.rateOfChange
      );

      if (component.onChange) component.onChange(computedValue, control.param, range);
    });

    this.setState({ value });
  };

  // TODO: Revisit this when OscillatorNode and others are worked on
  onClick = (value) => {
    const { controls, onGetComponentById } = this.props;

    controls.forEach((control) => {
      const component = onGetComponentById(control.id);

      if (component.onClick) component.onClick(value);

      this.setState({ value });
    });
  };

  getComponents = () => {
    const { controls, onGetComponentById } = this.props;
    const components = controls.every((connection) => onGetComponentById(connection.id));

    if (!components) {
      // TODO: Replace this with an EventEmitter
      return setTimeout(() => this.getComponents(), 300);
    }

    return true;
  };

  getValues = () => {
    const { controls, getValueById } = this.props;

    return controls
      .map((connection) => {
        const gotValue = getValueById(connection.id);

        return gotValue;
      })
      .filter(Boolean)
      .reduce((a, b) => a + b, 0) / controls.length;
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

  invertedValue = (value) => {
    if (value === 50) return value;

    return 100 - value;
  };

  render() {
    const { children } = this.props;
    const { value } = this.state;
    // TODO: This could be replaced with an event emitter or a proxy
    const computedValue = value || this.getValues();
    const childrenWithChange = children && React.Children.map(children, (child) => {
      return React.cloneElement(child, {
        onClick: this.onClick,
        onChange: this.onChange,
        value: computedValue
      });
    });

    return this.getComponents() && childrenWithChange || null;
  }
}

export default RemoteControl;
