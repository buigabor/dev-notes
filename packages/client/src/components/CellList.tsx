/** @jsxImportSource @emotion/react */
import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Project } from '../state/reducers/projectsReducer';
import { CellListItem } from './CellListItem';
import { AddProjectLayout } from './Layouts/AddProjectLayout';
import { LoadProjectLayout } from './Layouts/LoadProjectLayout';
import { actionButtonsWrapperStyles } from './styles/cellListActionButtonStyles';
import cellListStyles from './styles/cellListStyles';
import { AddCell } from './Utils/AddCell';
import { Alert } from './Utils/Alert';

export const CellList: React.FC = () => {
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [showLoadOverlay, setShowLoadOverlay] = useState(false);
  const [projects, setProjects] = useState<Project[] | null>(null);

  const { showAlert, hideAlert } = useActions();
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
      <div css={actionButtonsWrapperStyles}>
        <button onClick={() => {}} className="save-btn">
          <i className="fas fa-save"></i>
          <span style={{ fontFamily: 'Architects Daughter' }}>Save</span>
        </button>
        <button
          onClick={async () => {
            const loggedIn = await checkIfLoggedIn();
            if (loggedIn) {
              return setShowAddOverlay(true);
            }
          }}
          className="load-btn"
        >
          <i className="fas fa-folder-plus"></i>{' '}
          <span style={{ fontFamily: 'Architects Daughter' }}>Create</span>
        </button>
        <button className="load-btn">
          <i className="fas fa-edit"></i>{' '}
          <span style={{ fontFamily: 'Architects Daughter' }}>Edit</span>
        </button>
        <button
          className="load-btn"
          onClick={async () => {
            const loggedIn = await checkIfLoggedIn();
            if (loggedIn) {
              setShowLoadOverlay(true);
            }
            let fetchAllProjects = async () => {
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
        <button className="delete-all-btn">
          <i className="fas fa-trash"></i>{' '}
          <span style={{ fontFamily: 'Architects Daughter' }}>Delete All</span>
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
