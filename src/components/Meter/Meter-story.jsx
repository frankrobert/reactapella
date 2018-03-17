import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs/react';
import Meter from './Meter';
import Knob from "../Knob/Knob";

const stories = storiesOf('Meters', module);

class MeterWithKnob extends Component {
  state = {
    value: this.props.initialValue
  };

  onChange = (value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;

    return [
      <Knob
        value={value}
        degreeRange={number('Degree Range', 270)}
        degreeOffset={number('Degree Offset', 45)}
        divisions={number('Divisions', 6)}
        onChange={this.onChange}
      />,
      <Meter value={value} />
    ];
  }
}
MeterWithKnob.propTypes = {
  initialValue: PropTypes.number
};

MeterWithKnob.defaultProps = {
  initialValue: 0
};

stories.addDecorator(withKnobs);

stories
  .add('with default values', () => <Meter />)
  .add('with 50% meter', () => <Meter value={number('Value', 50)} />)
  .add('vertical', () => <Meter vertical={boolean('Vertical', true)} />)
  .add('controlled with knob', () => <MeterWithKnob />)
  .add('test', () => {
    return (
      <>
        <p>Hello</p>
        <p>Goodbye</p>
      </>
    );
  });
