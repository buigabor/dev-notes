/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { CellListItem } from './CellListItem';
import { AddProjectLayout } from './Layouts/AddProjectLayout';
import cellListStyles from './styles/cellListStyles';
import { AddCell } from './Utils/AddCell';
import { Alert } from './Utils/Alert';

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

export const CellList: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const { showAlert, hideAlert } = useActions();
  const history = useHistory();
  const project = useTypedSelector((state) => state.projects);
  const cells = useTypedSelector((state) => state.cells);

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
      <AddProjectLayout
        setShowOverlay={setShowOverlay}
        showOverlay={showOverlay}
      />
      <div css={actionButtonsWrapperStyles}>
        <button onClick={() => {}} className="save-btn">
          <i className="fas fa-save"></i>
          Save
        </button>
        <button
          onClick={() => {
            axios
              .get('http://localhost:4005/sessions', {
                withCredentials: true,
              })
              .then((res) => {
                setShowOverlay(true);
              })
              .catch((error) => {
                const errorMessage = error.response.data.error;
                showAlert(errorMessage, 'error');
                setTimeout(() => {
                  hideAlert();
                }, 3000);
                if (error.response.status === 408) {
                  history.push('/login');
                }
              });
          }}
          className="load-btn"
        >
          <i className="fas fa-file-upload"></i>Create
        </button>
        <button className="load-btn">
          <i className="fas fa-file-upload"></i>Edit
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
