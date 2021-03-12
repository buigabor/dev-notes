import { css } from '@emotion/react';

const cellListStyles = css`
  padding: 0 10px;
  margin: 0 25px 40vh;

  .force-visible {
    opacity: 1;
  }

  .react-draggable-transparent-selection & {
    margin-bottom: 100vh;
  }
`;

export default cellListStyles;
