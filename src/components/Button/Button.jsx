import styled from 'styled-components';
import { COLORS } from '../../constants/constants';

/** Button component that can do cool things */
const Button = styled.button`
  width: 120px;
  height: 40px;
  color: ${COLORS.WHITE};
  border: 2px solid #222;
  border-radius: 10px;
  background-color: ${COLORS.RED};
  cursor: pointer;
  position: relative;
  transition: all 0.1s ease-in-out;

  &:hover {
    box-shadow: 0 7px 14px rgba(50,50,93,.1), 0 3px 6px rgba(0,0,0,.08);
    filter: brightness(90%);
    transform: translateY(-2px) scale(1.01, 1.01);
  }

  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: inset 0px 0px 12px 3px #63535b;
  }
`;

export default Button;
