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
  gap: 15px;
  padding-right: 1rem;
  margin-bottom: 45px;

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
