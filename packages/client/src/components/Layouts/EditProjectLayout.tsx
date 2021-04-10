/** @jsxImportSource @emotion/react */
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { ChangeEvent, useEffect, useState } from 'react';
import baseURL from '../../../server';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import addProjectStyles from './styles/addProjectStyles';

interface EditProjectLayoutProps {
  showEditOverlay: boolean;
  setShowEditOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EditProjectLayout: React.FC<EditProjectLayoutProps> = ({
  showEditOverlay,
  setShowEditOverlay,
}) => {
  const [project, setProject] = useState({
    title: '',
    subtitle: '',
    description: '',
  });
  const { showAlert, hideAlert } = useActions();
  const projectState = useTypedSelector((state) => state.projects);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value } as any);
  };

  useEffect(() => {
    setProject({
      title: projectState.title,
      subtitle: projectState.subtitle,
      description: projectState.description,
    });
  }, [projectState]);

  const { editProject } = useActions();

  return (
    <div
      className="overlay"
      style={{
        visibility: showEditOverlay ? 'visible' : 'hidden',
      }}
      css={addProjectStyles}
      onClick={(e) => {
        if ((e.target as HTMLDivElement).classList.contains('overlay')) {
          setShowEditOverlay(false);
        }
      }}
    >
      <div
        style={{
          transform: showEditOverlay ? 'translateY(0)' : 'translateY(-40rem)',
          opacity: showEditOverlay ? 100 : 0,
        }}
        className="add-project-wrapper"
      >
        <i
          onClick={() => {
            setShowEditOverlay(false);
          }}
          className="fas fa-times"
        ></i>
        <h1>Project Details</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const res = await axios.patch(
                `${baseURL}/projects/${projectState.id}`,
                project,
                { withCredentials: true },
              );
              const currentProject = res.data.data.project;

              editProject(currentProject);
              setShowEditOverlay(false);
              showAlert('Project updated!', 'success');
              setTimeout(() => {
                hideAlert();
              }, 1500);
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
