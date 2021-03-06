import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { withKnobs, number, boolean } from '@storybook/addon-knobs/react';
import Meter from './Meter';
import Knob from '../Knob/Knob';

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
        key="knob"
      />,
      <Meter value={value} key="meter" />
    ];
  }
}

MeterWithKnob.propTypes = {
  initialValue: PropTypes.number
};

MeterWithKnob.defaultProps = {
  initialValue: 0
};

const stories = storiesOf('Meters', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories
  .add('with default values', () => <Meter />)
  .add('with 50% meter', () => <Meter value={number('Value', 50)} />)
  .add('vertical', () => <Meter vertical={boolean('Vertical', true)} />)
  .add('controlled with knob', () => <MeterWithKnob />);
