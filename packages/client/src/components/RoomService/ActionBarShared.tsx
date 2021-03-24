/** @jsxImportSource @emotion/react */
import React from 'react';
import { useActions } from '../../hooks/useActions';
import actionBarStyles from '../Utils/styles/actionBarStyles';

interface ActionBarSharedProps {
  id: string;
  deleteCell: (id: string) => void;
}

export const ActionBarShared: React.FC<ActionBarSharedProps> = ({
  id,
  deleteCell,
}) => {
  const { moveCell } = useActions();
  return (
    <div css={actionBarStyles}>
      <button
        className="action-button"
        onClick={() => {
          moveCell(id, 'up');
        }}
      >
        <span className="action-icon">
          <i className="fas fa-arrow-up" />
        </span>
      </button>
      <button
        className="action-button"
        onClick={() => {
          moveCell(id, 'down');
        }}
      >
        <span className="action-icon">
          <i className="fas fa-arrow-down" />
        </span>
      </button>
      <button
        className="action-button"
        onClick={() => {
          deleteCell(id);
        }}
      >
        <span className="action-icon">
          <i className="fas fa-times" />
        </span>
      </button>
    </div>
  );
};
