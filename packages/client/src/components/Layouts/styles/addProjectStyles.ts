import { css } from '@emotion/react';

const addProjectStyles = css`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  transition: all 0.2s linear;
  background: rgba(26, 26, 26, 0.7);
  z-index: 2;
  visibility: 'visible';
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    transform: translateY(-20px);
    font-family: 'Architects Daughter';
    font-size: 2.5em;
  }
  .add-project {
    &-wrapper {
      position: relative;
      background-color: #fff;
      width: 380px;
      padding: 2rem 4rem;
      border-radius: 10px;
      transition: all 0.25s ease-in-out;

      form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .fa-times {
        cursor: pointer;
        font-size: 1.5em;
        position: absolute;
        top: 25px;
        right: 30px;
      }
    }
    &-btn {
      color: #fff;
      border-radius: 4px;
      font-weight: 500;
      border: none;
      padding: 0.65rem 0.7rem;
      font-size: 0.85em;
      max-width: 100px;
      cursor: pointer;
      text-transform: uppercase;
      outline: none;
      transition: all 0.2s linear;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      align-self: flex-end;
      background-color: #00b5ad;
      &:hover {
        background-color: #05c7bd;
      }
    }
  }
`;

export default addProjectStyles;
