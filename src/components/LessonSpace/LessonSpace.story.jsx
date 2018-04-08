import React from 'react';
import { storiesOf } from '@storybook/react';
import centered from '@storybook/addon-centered';
import { withKnobs } from '@storybook/addon-knobs/react';
import LessonSpace from '../LessonSpace/LessonSpace';

const text = `Audio comes into a mono mixer channel via a balanced connection.  There are three wires in the input cable; one is ground and the other two carry the audio.  Of these two, one carries a mirrored signal image of the other.  This allows the console to compare the two audio signal images and remove differences caused by noise picked up after the signal left the source.
The signal comes in at microphone level (a few millivolts), gain is applied, and the result is boosted to line level (a couple of volts) via the channel preamp.  Though we talk of these levels generically, there is some fluctuation of the signal strength such as 5 to 50 mV for a microphone level signal.  For example, if a vocalist sings softly, they will send a weaker signal compared to if they were singing loudly.
The gain (a.k.a. trim) control allows the FOH tech to allow for more or less of the signal to come into the console.  For example, a hot signal from an instrument would need less of that signal to come into the console.  It would be like turning a faucet valve so less water comes out although the water pressure behind the valve stays the same.
Some signals come into the console so strong they can still be heard with the gain at zero.  When this is the case, the Pad option should be used.  It cuts 20 dB from the signal and places it into a manageable range.
Audio comes into a mono mixer channel via a balanced connection.  There are three wires in the input cable; one is ground and the other two carry the audio.  Of these two, one carries a mirrored signal image of the other.  This allows the console to compare the two audio signal images and remove differences caused by noise picked up after the signal left the source.
The signal comes in at microphone level (a few millivolts), gain is applied, and the result is boosted to line level (a couple of volts) via the channel preamp.  Though we talk of these levels generically, there is some fluctuation of the signal strength such as 5 to 50 mV for a microphone level signal.  For example, if a vocalist sings softly, they will send a weaker signal compared to if they were singing loudly.
The gain (a.k.a. trim) control allows the FOH tech to allow for more or less of the signal to come into the console.  For example, a hot signal from an instrument would need less of that signal to come into the console.  It would be like turning a faucet valve so less water comes out although the water pressure behind the valve stays the same.
Some signals come into the console so strong they can still be heard with the gain at zero.  When this is the case, the Pad option should be used.  It cuts 20 dB from the signal and places it into a manageable range.`;

const title = 'Follow the signal';
const stories = storiesOf('LessonSpace', module);

stories.addDecorator(withKnobs).addDecorator(centered);

stories.add('with default values', () => (
  <LessonSpace title={title} lessonText={text} />
));
