import { css } from '@emotion/react';

const textEditorStyles = css`
  .w-md-editor .title {
    line-height: unset;
    font-size: unset;
    font-weight: unset;
    color: #d4d4d4 !important;
  }

  .w-md-editor ul {
    line-height: 1;
  }

  .w-md-editor-bar svg {
    display: none;
  }

  .w-md-editor-bar {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
    height: 11px;
    cursor: row-resize;
    background-color: #37414b;
    background-repeat: no-repeat;
    background-position: 50%;
    width: 100%;
    position: relative;
  }

  em {
    font-style: italic;
  }

  .wmde-markdown hr {
    border-top: 1px solid #dee5ed;
  }

  .wmde-markdown ol {
    list-style: decimal;
  }

  .w-md-editor-show-live {
    /* Hide menu bar buttons to prevent accidental delete */
    z-index: 20;
  }

  .w-md-editor-toolbar {
    background-color: #37414b;
    border-bottom: 1px solid gray;
  }

  .w-md-editor-toolbar li button {
    color: #d4d4d4;
  }

  .w-md-editor-content {
    background-color: #202123;
  }

  .w-md-editor,
  .w-md-editor .w-md-editor-text-pre {
    color: #d4d4d4;
  }

  .w-md-editor-text-pre .bold {
    color: unset;
  }

  .token.list.punctuation {
    background-color: unset;
  }

  .card {
    color: #fff;
    background-color: #202123;
    padding: 1rem;
    border: solid 1px #989898;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  }
`;

export default textEditorStyles;
