import styled from 'styled-components';
import Next from '../Next/Next';

export default styled(Next)`
  transform: rotate(-180deg);

  &:hover {
    box-shadow: 0px 0px 20px 0px #63535b;
    transform: scale(1.01, 1.01) rotate(-180deg);
  }

  &:disabled {
    color: grey;
  }

  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: inset 0px 0px 12px 3px #63535b;
  }
`;
