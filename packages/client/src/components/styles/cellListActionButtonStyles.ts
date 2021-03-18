import { css } from '@emotion/react';

export const actionButtonStyles = css`
  color: #fff;
  border-radius: 4px;
  background-color: #f5534f;
  font-weight: 700;
  border: none;
  padding: 0.65rem 0.65rem;
  font-size: 0.84em;
  max-width: 155px;
  cursor: pointer;
  text-transform: uppercase;
  outline: none;
  transition: all 0.2s linear;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:hover {
    background-color: #fb706e;
  }
`;

export const actionButtonsWrapperStyles = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
  padding: 0 2.3rem;
  margin-bottom: 45px;

  .project-details {
    margin-right: auto;
    display: flex;
    flex-direction: column;
    h1 {
      font-family: 'Architects Daughter';
      margin: 10px 0;
      color: #dddddd;
      font-weight: 300;
      font-size: 1.4em;
    }
    &__title {
      font-family: 'Architects Daughter';
      color: #f2a154;
      font-weight: 500;
      font-size: 2.25em;
    }
    &__subtitle {
      font-family: 'Architects Daughter';
      color: #cdd0cb;
      font-size: 1.1em;
    }
  }

  .delete-all-btn {
    ${actionButtonStyles}
  }

  .load-btn {
    ${actionButtonStyles}
    background-color: #3c55e0;
    &:hover {
      background-color: #4e65eb;
    }
  }

  .save-btn {
    ${actionButtonStyles}
    background-color: #00b5ad;
    &:hover {
      background-color: #05c7bd;
    }
  }

  .fas {
    margin-right: 5px;
  }
`;
