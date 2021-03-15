/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import axios from 'axios';
import React from 'react';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { AddCell } from './AddCell';
import { Alert } from './Alert';
import { CellListItem } from './CellListItem';
import cellListStyles from './styles/cellListStyles';

const actionButtonStyles = css`
  color: #fff;
  border-radius: 4px;
  background-color: #f5534f;
  font-weight: 500;
  border: none;
  padding: 0.65rem 0.7rem;
  font-size: 0.85em;
  max-width: 120px;
  cursor: pointer;
  text-transform: uppercase;
  outline: none;
  transition: all 0.2s linear;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  &:hover {
    background-color: #fb706e;
  }
`;

const actionButtonsWrapperStyles = css`
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding-right: 1rem;

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

export const CellList: React.FC = () => {
  const { showAlert, hideAlert } = useActions();
  const orderedCellList = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((cellId: string) => {
      return data[cellId];
    });
  });

  const renderedCells = orderedCellList.map((cell) => (
    <React.Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell nextCellId={cell.id} />
    </React.Fragment>
  ));
  return (
    <>
      <Alert />
      <div css={actionButtonsWrapperStyles}>
        <button
          className="save-btn"
          onClick={() => {
            axios
              .post('http://localhost:4005/cells', '', {
                withCredentials: true,
              })
              .then((res) => {
                console.log(res);
                showAlert('Cells Saved!', 'success');
                setTimeout(() => {
                  hideAlert();
                }, 1000);
              })
              .catch((error) => {
                const errorMessage = error.response.data.error;
                showAlert(errorMessage, 'error');
                setTimeout(() => {
                  hideAlert();
                }, 3000);
                console.log(error.response);
              });
          }}
        >
          <i className="fas fa-save"></i>
          Save
        </button>
        <button className="load-btn">
          <i className="fas fa-file-upload"></i>Load
        </button>
        <button className="delete-all-btn">
          <i className="fas fa-trash"></i>Delete All
        </button>
      </div>
      <div css={cellListStyles}>
        <AddCell
          forceVisible={orderedCellList.length === 0}
          nextCellId={null}
        />
        {renderedCells}
      </div>
    </>
  );
};
