/** @jsxImportSource @emotion/react */
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Project } from '../state/reducers/projectsReducer';
import { CellListItem } from './CellListItem';
import { DeleteCellsDialog } from './DeleteCellsDialog';
import { AddProjectLayout } from './Layouts/AddProjectLayout';
import { EditProjectLayout } from './Layouts/EditProjectLayout';
import { LoadProjectLayout } from './Layouts/LoadProjectLayout';
import { actionButtonsWrapperStyles } from './styles/cellListActionButtonStyles';
import cellListStyles from './styles/cellListStyles';
import { AddCell } from './Utils/AddCell';
import { Alert } from './Utils/Alert';

export const CellList: React.FC = () => {
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showLoadOverlay, setShowLoadOverlay] = useState(false);
  const [showEditOverlay, setShowEditOverlay] = useState(false);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { showAlert, hideAlert, editProject } = useActions();
  const history = useHistory();
  const project = useTypedSelector((state) => state.projects);
  const cells = useTypedSelector((state) => state.cells);

  const orderedCellList = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((cellId: string) => {
      return data[cellId];
    });
  });

  const checkIfLoggedIn = async () => {
    return await axios
      .get('http://localhost:4005/sessions', {
        withCredentials: true,
      })
      .then((res) => {
        if (res.status === 200) return true;
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
  };

  const renderedCells = orderedCellList.map((cell) => (
    <React.Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell nextCellId={cell.id} />
    </React.Fragment>
  ));
  return (
    <>
      <DeleteCellsDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
      <Alert />
      <AddProjectLayout
        setShowAddOverlay={setShowAddOverlay}
        showAddOverlay={showAddOverlay}
      />
      <LoadProjectLayout
        projects={projects}
        showLoadOverlay={showLoadOverlay}
        setShowLoadOverlay={setShowLoadOverlay}
      />
      <EditProjectLayout
        showEditOverlay={showEditOverlay}
        setShowEditOverlay={setShowEditOverlay}
      />
      <div css={actionButtonsWrapperStyles}>
        <button onClick={() => {}} className="save-btn">
          <i className="fas fa-save"></i>
          <span style={{ fontFamily: 'Architects Daughter' }}>Save</span>
        </button>
        <button
          onClick={async () => {
            const loggedIn = await checkIfLoggedIn();
            if (!loggedIn) {
              showAlert('Please login, to save your project.', 'error');
              setTimeout(() => {
                hideAlert();
              }, 1500);
              return;
            }
            setShowAddOverlay(true);
          }}
          className="load-btn"
        >
          <i className="fas fa-folder-plus"></i>{' '}
          <span style={{ fontFamily: 'Architects Daughter' }}>Create</span>
        </button>
        <button
          className="load-btn"
          onClick={async () => {
            const loggedIn = await checkIfLoggedIn();
            if (!project.id) {
              showAlert(
                'No project found. Please create or load one.',
                'error',
              );
              setTimeout(() => {
                hideAlert();
              }, 1500);
              return;
            }
            if (!loggedIn) {
              showAlert('Please login, to edit your project.', 'error');
              setTimeout(() => {
                hideAlert();
              }, 1500);
              return;
            }

            setShowEditOverlay(true);
          }}
        >
          <i className="fas fa-edit"></i>{' '}
          <span style={{ fontFamily: 'Architects Daughter' }}>Edit</span>
        </button>
        <button
          className="load-btn"
          onClick={async () => {
            const loggedIn = await checkIfLoggedIn();
            if (!loggedIn) {
              showAlert('Please login, to load your projects.', 'error');
              setTimeout(() => {
                hideAlert();
              }, 1500);
              return;
            }
            setShowLoadOverlay(true);
            const fetchAllProjects = async () => {
              const res = await axios.get('http://localhost:4005/projects', {
                withCredentials: true,
              });
              const projects = res.data.data.projects;
              setProjects(projects);
            };
            fetchAllProjects();
          }}
        >
          <i className="fas fa-file-upload"></i>{' '}
          <span style={{ fontFamily: 'Architects Daughter' }}>Load</span>
        </button>
        <button
          onClick={() => {
            setOpenDialog(true);
          }}
          className="delete-all-btn"
        >
          <i className="fas fa-trash"></i>{' '}
          <span style={{ fontFamily: 'Architects Daughter' }}>
            Delete Cells
          </span>
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
