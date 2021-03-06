/** @jsxImportSource @emotion/react */
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import baseURL from '../../server';
import addProjectStyles from './styles/addProjectStyles';
interface AddProjectLayoutProps {
  showAddOverlay: boolean;
  setShowAddOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  data?: {
    [key: string]: {
      id: string;
      type: string;
      content: string;
    };
  };
  orderCells?: {
    order: string[];
  };
  collaboration: boolean;
}

export const AddProjectLayout: React.FC<AddProjectLayoutProps> = ({
  showAddOverlay,
  setShowAddOverlay,
  data,
  orderCells,
  collaboration,
}) => {
  const { showAlert, hideAlert, createProject } = useActions();
  const [project, setProject] = useState({
    title: '',
    subtitle: '',
    description: '',
  });
  const cellsState = useTypedSelector((state) => state.cells);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value } as any);
  };

  return (
    <div
      className="overlay"
      style={{
        visibility: showAddOverlay ? 'visible' : 'hidden',
      }}
      css={addProjectStyles}
      onClick={(e) => {
        if ((e.target as HTMLDivElement).classList.contains('overlay')) {
          setShowAddOverlay(false);
        }
      }}
    >
      <div
        style={{
          transform: showAddOverlay ? 'translateY(0)' : 'translateY(-40rem)',
          opacity: showAddOverlay ? 100 : 0,
        }}
        className="add-project-wrapper"
      >
        <i
          onClick={() => {
            setShowAddOverlay(false);
          }}
          className="fas fa-times"
        ></i>
        <h1>Project Details</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              const res = await axios.post(
                `${baseURL}/projects/create`,
                project,
                {
                  withCredentials: true,
                },
              );
              const projectCreated = res.data.data.project;
              createProject(projectCreated);
              setTimeout(() => {}, 100);
              if (!collaboration) {
                axios.post(
                  `${baseURL}/cells/create`,
                  { ...cellsState, projectId: projectCreated.id },
                  {
                    withCredentials: true,
                  },
                );
              } else {
                axios.post(
                  `${baseURL}/cells/create`,
                  {
                    data,
                    order: orderCells?.order,
                    projectId: projectCreated.id,
                  },
                  {
                    withCredentials: true,
                  },
                );
              }
              showAlert('Project created!', 'success');
              setTimeout(() => {
                hideAlert();
              }, 1000);
              setShowAddOverlay(false);
            } catch (error) {
              showAlert('Project creation failed!', 'error');
              setTimeout(() => {
                hideAlert();
              }, 1000);
              setShowAddOverlay(false);
            }
          }}
          autoComplete="off"
        >
          <TextField
            onChange={onChange}
            value={project.title}
            label="Project Title"
            variant="filled"
            name="title"
          />
          <TextField
            onChange={onChange}
            value={project.subtitle}
            label="Sub-title"
            variant="filled"
            name="subtitle"
          />
          <TextField
            onChange={onChange}
            value={project.description}
            label="Project description"
            multiline
            rows={4}
            variant="filled"
            name="description"
          />
          <button type="submit" className="add-project-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
