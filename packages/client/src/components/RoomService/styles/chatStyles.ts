import { css } from '@emotion/react';

const chatStyles = css`
  position: fixed;
  z-index: 9999;
  right: 25px;
  bottom: 70px;
  height: 500px;
  width: 450px;

  .cs-conversation__name{
    margin-left: 15px;
  }
  .cs-status__bullet {
    position: relative;
    top: 25px;
    left: 7px;
  }

  .mute-btn {
    color: #00b5ad;
    margin-left: 1.6rem;
    font-size: 1.4em;
    cursor: pointer;
  }

  .chat-container {
    display: flex;
    height: 100%;
    box-shadow: rgba(0, 0, 0, 0.55) 0px 5px 15px;
    flex-grow: 1;
  }
  .chat-sidebar {
    background-color: #fff;
    border-bottom-left-radius: 8px;
    width: 30%;
    &__users-online {
      display: flex;
      align-items: center;
      gap: 10px;
      .cs-status__bullet {
        justify-self: flex-start;
        margin-left: 10px;
      }
    }
  }
  .chat-message-container {
    width: 100%;
    flex-grow: 1;
  }
  .chat-header {
    width: 100%;
    height: 2.85rem;
    background-color: #4ec9c3;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    i {
      margin-right: 15px;
      margin-left: auto;
      cursor: pointer;
    }

    span {
      margin-left: 25px;
      font-size: 1.5em;
      font-weight: 600;
      font-family: 'Architects Daughter';
    }
  }

  .cs-main-container {
    width: 100%;

    border-bottom-right-radius: 8px;
  }
  .cs-message--incoming .cs-message__sender-name {
    display: block;
  }
  .cs-message--incoming .cs-message__sent-time {
    display: block;
  }
`;

export default chatStyles;
