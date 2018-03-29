import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Next from '../Next/Next';
import Previous from '../Previous/Previous';

const OuterText = styled.div`
  overflow: hidden;
  border: 2px solid #222;
  background-color: #fff;
  border-radius: 25px;
  box-shadow: 0px 0px 20px 0px #000;
  width: 300px;
  font-size: 14px;
  position: relative;
`;

const TextArea = styled.div`
  overflow-y: auto;
  padding: 10px 30px;  
  height: 500px;
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: var(--color-white);
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-clip: content-box;
    background-color: #d5d6d6;
    border: 3px solid transparent;
    border-radius: 6px;
  }
`;

const Buttons = styled.div`
  background-color: #d5d6d6;
  border-top: 1px solid #222;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 30px;
  width: 100%;
  position: absolute;
  bottom: 0;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(0);
  }

  ${(props) => props.isScrolling ? 'transform: translateY(0)' : 'transform: translateY(100%);'}
`;

const Title = styled.h3`
  color: #222;
  font-size: 18px;
  text-decoration: underline;
`;

// eslint-disable-next-line
class LessonSpace extends Component {
  static propTypes = {
    lessonText: PropTypes.string,
    title: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.scrolling = null;
  }

  state = {
    isScrolling: false
  };

  updateOnScroll = () => {
    clearTimeout(this.scrolling);
    this.setState({ isScrolling: true });

    this.scrolling = setTimeout(() => this.setState({ isScrolling: false }), 100)
  };

  render() {
    const { isScrolling } = this.state;
    const { lessonText, title } = this.props;

    return (
      <OuterText
        onWheel={this.updateOnScroll}
      >
        <TextArea>
          <Title>{title}</Title>
          {lessonText}
        </TextArea>
        <Buttons
          innerRef={(e) => this.buttons = e} // eslint-disable-line
          isScrolling={isScrolling}
        >
          <Previous />
          <Next />
        </Buttons>
      </OuterText>
    )
  }
}

export default LessonSpace;
