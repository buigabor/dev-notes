import { css } from '@emotion/react';

const linearProgressStyles = css`
  height: 100%;
  flex-grow: 1;
  background-color: #fff;
  .progress-cover {
    height: 100%;
    width: 100%;
    flex-grow: 1;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.5s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

export default linearProgressStyles;
