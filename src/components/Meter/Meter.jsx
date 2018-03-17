import styled from 'styled-components';

const Meter = styled.progress.attrs({ min: 0, max: 100, value: (props) => props.value })`
  border: 2px solid #444;
  height: 50px;
  width: 200px;
  ${(props) => props.vertical ? 'transform: rotate(90deg)' : ''};
`;

export default Meter;
