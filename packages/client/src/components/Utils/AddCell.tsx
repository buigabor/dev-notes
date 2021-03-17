/** @jsxImportSource @emotion/react */
import React from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import addCellStyles from './styles/addCellStyles';

interface AddCellProps {
  nextCellId: string | null;
  forceVisible?: boolean;
}

export const AddCell: React.FC<AddCellProps> = ({
  nextCellId,
  forceVisible,
}) => {
  const { insertCellAfter } = useActions();

  const project = useTypedSelector((state) => state.projects);
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
          <span style={{ fontFamily: 'Architects Daughter' }}>CODE</span>
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
          <span style={{ fontFamily: 'Architects Daughter' }}>TEXT</span>
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
          <span style={{ fontFamily: 'Architects Daughter' }}>SKETCH</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};
