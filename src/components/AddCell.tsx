/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { useActions } from '../hooks/useActions';

interface AddCellProps {
  nextCellId: string | null;
  forceVisible?: boolean;
}

const addCellStyles = css`
  position: relative;
  opacity: 0;
  transition: opacity 0.3s ease-in 0.1s;
  margin: 15px 0;
  &:hover {
    opacity: 1;
  }
  & .divider {
    position: absolute;
    top: 50%;
    bottom: 50%;
    right: 2.5%;
    left: 2.5%;
    border-bottom: 1px solid gray;
    width: 95%;
    z-index: 0;
  }

  & .add-buttons-wrapper {
    display: flex;
    justify-content: center;
    gap: 30px;
    position: relative;
    z-index: 1;
  }

  .add-button {
    cursor: pointer;
    background-color: #00aaa1;
    color: #fff;
    outline: none;
    border: none;
    border-radius: 10px;
    padding: 0.5rem 0.8rem;
    font-size: 0.95em;
    transition: 0.2s all ease-in-out;
    i {
      margin-right: 8px;
    }
    &:hover {
      background-color: #05c7bd;
      transform: translateY(-1.5px);
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }
  }
`;

export const AddCell: React.FC<AddCellProps> = ({
  nextCellId,
  forceVisible,
}) => {
  const { insertCellAfter } = useActions();
  return (
    <div className={forceVisible ? 'force-visible' : ''} css={addCellStyles}>
      <div className="add-buttons-wrapper">
        <button
          className="add-button"
          onClick={() => {
            insertCellAfter(nextCellId, 'code');
          }}
        >
          <span>
            <i className="fas fa-plus-circle"></i>
          </span>
          <span>Code</span>
        </button>
        <button
          className="add-button"
          onClick={() => {
            insertCellAfter(nextCellId, 'text');
          }}
        >
          <span>
            <i className="fas fa-plus-circle"></i>
          </span>
          <span>Text</span>
        </button>
        <button
          className="add-button"
          onClick={() => {
            insertCellAfter(nextCellId, 'sketch');
          }}
        >
          <span>
            <i className="fas fa-plus-circle"></i>
          </span>
          <span>Sketch</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};
