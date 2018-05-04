/* eslint-disable */
import React, { Component } from 'react';
import { getDisplayName } from '../../lib/utils';

class WithValueControl extends Component {
  state = {
    value: this.props.initialValue
  };

  onChange = (value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const children = React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        value,
        initialValue: this.props.initialValue,
        onChange: this.onChange
      });
    });

    return children;
  }
}

WithValueControl.defaultProps = {
  initialValue: 0
};

export default WithValueControl;
