import { css } from '@emotion/react';
import syntaxHighlights from './syntaxHighlighting';

const editorStyles = css`
  position: relative;
  height: 100%;
  width: calc(100% - 10px);
  &:hover .format-btn {
    opacity: 1;
  }
  .format-btn {
    position: absolute;
    right: 5px;
    bottom: 10px;
    z-index: 5;
    opacity: 0;
    display: inline-block;
    background-color: #00b5ad;
    color: #fff;
    box-shadow: inset 0 0 0 0 rgb(34 36 38 / 15%);
    font-size: 0.9rem;
    cursor: pointer;
    border: none;
    margin-right: 0.25em;
    padding: 0.7em 1.2em;
    font-weight: 700;
    text-align: center;
    border-radius: 4px;
    outline: none;
    transition: all 0.2s ease-in-out;
    &:hover {
      background-color: #009c95;
    }
  }
  ${syntaxHighlights}
`;

export default editorStyles;
