import { css } from '@emotion/react';

const sketchToolBoxStyles = css`
  position: absolute;
  top: 3rem;
  left: 10px;
  z-index: 5;
  display: flexbox;
  flex-direction: column;
  width: 5rem;
  border: 1px solid black;
  border-radius: 4px;
  .toolbox {
    &-row {
      display: flex;
      padding: 0 0.3rem;
      flex-basis: 100%;
      gap: 5px;
      &:not(:last-of-type) {
        border-bottom: 1px solid black;
      }
    }

    &-cell {
      cursor: pointer;
      padding: 0.4rem 0.2rem;
      flex-basis: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &:first-of-type {
        border-right: 1px solid black;
      }
    }
    &-line {
      height: 2px;
      width: 16px;
      background-color: black;
    }
    &-rectangle {
      width: 13px;
      height: 9px;
      border: 2px solid black;
    }
    &-arrow-btn {
      background-color: transparent;
      border: none;
      font-size: 1em;
      cursor: pointer;
      outline: none;
    }
    &-blockcolor {
      position: absolute;
      top: 10.1rem;
      right: 0.2rem;
    }
    &-download-link {
      outline: none;
      color: black;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

export default sketchToolBoxStyles;
