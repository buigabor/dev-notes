/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useHistory } from 'react-router';
import { useActions } from '../hooks/useActions';
import { useTypedSelector } from '../hooks/useTypedSelector';

const addProjectStyles = css`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  transition: all 0.2s linear;
  background: rgba(26, 26, 26, 0.7);
  z-index: 2;
  visibility: 'visible';
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    transform: translateY(-20px);
    font-family: 'Architects Daughter';
    font-size: 2.5em;
  }
  .add-project {
    &-wrapper {
      position: relative;
      background-color: #fff;
      width: 380px;
      padding: 2rem 4rem;
      border-radius: 10px;

      form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .fa-times {
        cursor: pointer;
        font-size: 1.5em;
        position: absolute;
        top: 25px;
        right: 30px;
      }
    }
    &-btn {
      color: #fff;
      border-radius: 4px;
      font-weight: 500;
      border: none;
      padding: 0.65rem 0.7rem;
      font-size: 0.85em;
      max-width: 100px;
      cursor: pointer;
      text-transform: uppercase;
      outline: none;
      transition: all 0.2s linear;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
      align-self: flex-end;
      background-color: #00b5ad;
      &:hover {
        background-color: #05c7bd;
      }
    }
  }
`;

interface AddProjectLayoutProps {
  showOverlay: boolean;
  setShowOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddProjectLayout: React.FC<AddProjectLayoutProps> = ({
  showOverlay,
  setShowOverlay,
}) => {
  const { showAlert, hideAlert } = useActions();
  const [project, setProject] = useState({
    title: '',
    subtitle: '',
    description: '',
  });
  const history = useHistory();
  const cells = useTypedSelector((state) => state.cells);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value } as any);
  };

  return (
    <div
      className="overlay"
      style={{ visibility: showOverlay ? 'visible' : 'hidden' }}
      css={addProjectStyles}
      onClick={(e) => {
        if ((e.target as HTMLDivElement).classList.contains('overlay')) {
          setShowOverlay(false);
        }
      }}
    >
      <div className="add-project-wrapper">
        <i
          onClick={() => {
            setShowOverlay(false);
          }}
          className="fas fa-times"
        ></i>
        <h1>Project Details</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            axios
              .post(
                'http://localhost:4005/projects/create',
                { ...project },
                {
                  withCredentials: true,
                },
              )
              .then((res) => {
                console.log(res);
                showAlert('Cells Saved!', 'success');
                setTimeout(() => {
                  hideAlert();
                }, 1000);
                setShowOverlay(false);
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
                console.log(error.response);
              });
          }}
          autoComplete="off"
        >
          <TextField
            onChange={onChange}
            value={project.title}
            id="filled-basic"
            label="Project Title"
            variant="filled"
            name="title"
          />
          <TextField
            onChange={onChange}
            value={project.subtitle}
            id="filled-basic"
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
            defaultValue="Default Value"
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
