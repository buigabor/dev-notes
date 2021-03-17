import { css } from '@emotion/react';

const alertStyles = css`
  position: fixed;
  top: 0;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 9999;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 400;
  text-align: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 0.8rem 3rem;
  -webkit-box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.25);
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.25);
`;

export default alertStyles;
