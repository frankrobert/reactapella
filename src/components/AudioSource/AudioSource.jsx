import React from 'react';
import PropTypes from 'prop-types';
import Microphone from '../Microphone/Microphone';

const AudioSource = ({ children, source, ...rest }) => {
  if (source === 'microphone') {
    return <Microphone {...rest} >{children}</Microphone>;
  }

  return children;
};

AudioSource.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  source: PropTypes.string
};

export default AudioSource;
