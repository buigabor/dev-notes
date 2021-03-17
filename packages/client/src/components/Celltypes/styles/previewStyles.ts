import { css } from '@emotion/react';

const previewStyles = css`
  position: relative;
  height: 100%;
  flex-grow: 1;
  overflow: hidden;
  background-color: #fff;
  .react-draggable-transparent-selection &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
  }

  & iframe {
    width: 100%;
    border: transparent;
    height: 100%;
  }

  .preview {
    &-error {
      position: absolute;
      top: 10px;
      left: 10px;
      color: red;
    }
  }
`;

export default previewStyles;
