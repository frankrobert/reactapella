import React from 'react';
import PropTypes from 'prop-types';
import Microphone from '../Microphone/Microphone';
import FileUpload from '../FileUpload/FileUpload';
import OscillatorNode from '../OscillatorNode/OscillatorNode';

const AudioSource = ({ children, source, ...rest }) => {
  switch (source) {
    case 'microphone': {
      return <Microphone source {...rest }>{children}</Microphone>;
    }
    case 'file': {
      return <FileUpload source {...rest}>{children}</FileUpload>;
    }
    case 'oscillator': {
      return <OscillatorNode source {...rest}>{children}</OscillatorNode>;
    }
    default: {
      return children;
    }
  }
};

AudioSource.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  source: PropTypes.string
};

export default AudioSource;
