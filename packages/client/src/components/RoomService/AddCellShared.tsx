/** @jsxImportSource @emotion/react */
import React from 'react';
import addCellStyles from '../Utils/styles/addCellStyles';

interface AddCellSharedProps {
  insertAfterCell: (id: string | null, type: string) => void;
  nextCellId: string | null;
  forceVisible?: boolean;
}

export const AddCellShared: React.FC<AddCellSharedProps> = ({
  insertAfterCell,
  nextCellId,
  forceVisible,
}) => {
  return (
    <div className={forceVisible ? 'force-visible' : ''} css={addCellStyles}>
      <div className="add-buttons-wrapper">
        <button
          className="add-button"
          onClick={() => {
            insertAfterCell(nextCellId, 'code');
          }}
        >
          <span>
            <i className="fas fa-plus-circle"></i>
          </span>
          <span style={{ fontFamily: 'Architects Daughter' }}>CODE</span>
        </button>
        <button
          className="add-button"
          onClick={() => {
            insertAfterCell(nextCellId, 'text');
          }}
        >
          <span>
            <i className="fas fa-plus-circle"></i>
          </span>
          <span style={{ fontFamily: 'Architects Daughter' }}>TEXT</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};
