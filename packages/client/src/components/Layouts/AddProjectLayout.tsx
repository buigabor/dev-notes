/** @jsxImportSource @emotion/react */
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import addProjectStyles from './styles/addProjectStyles';
interface AddProjectLayoutProps {
  showAddOverlay: boolean;
  setShowAddOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddProjectLayout: React.FC<AddProjectLayoutProps> = ({
  showAddOverlay: showOverlay,
  setShowAddOverlay,
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
        visibility: showOverlay ? 'visible' : 'hidden',
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
          transform: showOverlay ? 'translateY(0)' : 'translateY(-40rem)',
          opacity: showOverlay ? 100 : 0,
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
                'http://localhost:4005/projects/create',
                project,
                {
                  withCredentials: true,
                },
              );
              const projectCreated = res.data.data.project;
              createProject(projectCreated);
              setTimeout(() => {}, 100);

              axios.post(
                'http://localhost:4005/cells/create',
                { ...cellsState, projectId: projectCreated.id },
                {
                  withCredentials: true,
                },
              );
              showAlert('Project created!', 'success');
              setTimeout(() => {
                hideAlert();
              }, 1000);
              setShowAddOverlay(false);
            } catch (error) {
              console.log(error);
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
            id="filled-multiline-static"
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
