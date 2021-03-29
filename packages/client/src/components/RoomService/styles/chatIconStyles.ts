import { css } from '@emotion/react';

const chatIcon = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #00b5ad;
  position: fixed;
  bottom: 25px;
  right: 25px;
  cursor: pointer;
  .chat-unread-count {
    position: absolute;
    right: 12px;
    top: 10px;
    min-height: 20px;
    min-width: 15px;
    padding: 0.5px 3px;
    border-radius: 20%;
    color: #fff;
    background-color: red;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  i {
    color: #fff;
    font-size: 1.85em;
  }
`;

export default chatIcon;
