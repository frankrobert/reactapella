import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { withKnobs, number, boolean, text } from '@storybook/addon-knobs/react';
import Meter from './Meter';
import AudioContext from '../AudioContext/AudioContext';
import AudioSource from '../AudioSource/AudioSource';
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

// eslint-disable-next-line
class MeterWithAudio extends Component {
  state = {
    value: 0
  };

  componentDidMount() {
    this.setupNodes();
  }

  setupNodes = () => {
    if (!this.props.audioSource) {
      return setTimeout(this.setupNodes, 50);
    }

    this.analyser = this.props.audioContext.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.3;
    this.analyser.fftSize = 1024;

    this.meter = this.props.audioContext.createScriptProcessor(2048, 1, 1);
    this.meter.onaudioprocess = () => {
      // get the average, bincount is fftsize / 2
      const array = new Uint8Array(this.analyser.frequencyBinCount);

      this.analyser.getByteFrequencyData(array);

      const average = this.getAverageVolume(array);

      this.setState({ value: average });
    };
    this.meter.connect(this.props.audioDestination);

    this.props.audioSource.connect(this.analyser);
    this.analyser.connect(this.meter);
    this.props.audioSource.connect(this.props.audioDestination);
  };

  getAverageVolume = (array) => {
    const { length } = array;
    let values = 0;

    // get all the frequency amplitudes
    array.forEach((value) => (values += value)); // eslint-disable-line

    const average = values / length;

    return average;
  };

  render() {
    const { value } = this.state;

    return <Meter value={value} />;
  }
}

MeterWithAudio.propTypes = {
  audioContext: PropTypes.object.isRequired,
  audioDestination: PropTypes.object.isRequired,
  audioSource: PropTypes.object.isRequired
};

const stories = storiesOf('Meters', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories
  .add('with default values', () => <Meter />)
  .add('with 50% meter', () => <Meter value={number('Value', 50)} />)
  .add('vertical', () => <Meter vertical={boolean('Vertical', true)} />)
  .add('controlled with knob', () => <MeterWithKnob />)
  .add('with Audio input', () => (
    <AudioContext>
      <AudioSource source={text('Source', 'microphone')}>
        <MeterWithAudio />
      </AudioSource>
    </AudioContext>
  ));
