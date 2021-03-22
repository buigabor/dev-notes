/** @jsxImportSource @emotion/react */
import axios from 'axios';
import React from 'react';
import { useHistory } from 'react-router';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Project } from '../state/reducers/projectsReducer';
import { actionButtonsWrapperStyles } from './styles/cellListActionButtonStyles';

interface ProjectActionsProps {
  setShowLoadOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[] | null>>;
}

export const ProjectActions: React.FC<ProjectActionsProps> = ({
  setShowLoadOverlay,
  setShowAddOverlay,
  setShowEditOverlay,
  setOpenDialog,
  setProjects,
}) => {
  const { showAlert, hideAlert } = useActions();
  const project = useTypedSelector((state) => state.projects);
  const cellsState = useTypedSelector((state) => state.cells);
  const history = useHistory();

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

  return (
    <div css={actionButtonsWrapperStyles}>
      <div className="project-details">
        <h1>Project:</h1>
        <span className="project-details__title">{project.title}</span>
        <span className="project-details__subtitle">{project.subtitle}</span>
      </div>
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
          if (!project.id) {
            showAlert('Please create or load a project to save.', 'error');
            setTimeout(() => {
              hideAlert();
            }, 1500);
            return;
          }
          axios.post(
            'http://localhost:4005/cells/save',
            { ...cellsState, projectId: project.id },
            {
              withCredentials: true,
            },
          );
          showAlert('Project Saved!', 'success');
          setTimeout(() => {
            hideAlert();
          }, 1000);
        }}
        className="save-btn"
      >
        <i className="fas fa-save"></i>
        <span style={{ fontFamily: 'Architects Daughter' }}>Save</span>
      </button>
      <button
        onClick={async () => {
          const loggedIn = await checkIfLoggedIn();
          if (!loggedIn) {
            showAlert('Please login, to create a project.', 'error');
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
            showAlert('No project found. Please create or load one.', 'error');
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
        <span style={{ fontFamily: 'Architects Daughter' }}>Delete Cells</span>
      </button>
    </div>
  );
};
