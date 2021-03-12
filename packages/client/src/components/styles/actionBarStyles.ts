import { css } from '@emotion/react';

const actionBarStyles = css`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.3;
  z-index: 5;
  &:hover {
    opacity: 1;
    transition: opacity 0.25s ease-in-out;
  }
  .action {
    &-button {
      cursor: pointer;
      background-color: #00b5ad;
      color: #fff;
      box-shadow: inset 0 0 0 0 rgb(34 36 38 / 15%);
      border: none;
      padding: 0.6em 1em;
      text-align: center;
      border-radius: 0px;
      outline: none;
    }
  }
`;

export default actionBarStyles;
