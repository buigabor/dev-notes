/** @jsxImportSource @emotion/react */
import React from 'react';
import actionBarStyles from '../Utils/styles/actionBarStyles';

interface ActionBarSharedProps {
  id: string;
  deleteCell: (id: string) => void;
  moveCell: (id: string, direction: 'up' | 'down') => void;
}

export const ActionBarShared: React.FC<ActionBarSharedProps> = ({
  id,
  deleteCell,
  moveCell,
}) => {
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
