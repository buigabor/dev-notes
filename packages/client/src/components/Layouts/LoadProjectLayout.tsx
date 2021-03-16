/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { ChangeEvent, useEffect } from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Project } from '../../state/reducers/projectsReducer';
import { ProjectCard } from './ProjectCard';

const loadProjectStyles = css`
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
    font-size: 3em;
    text-align: center;
  }
  .load-project {
    &-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      flex-basis: 79%;
      overflow-y: scroll;
    }
    &-wrapper {
      display: flex;
      justify-content: center;

      position: relative;
      background-color: #fff;
      width: 50vw;
      height: 80vh;
      padding: 2rem 4rem;
      border-radius: 10px;

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

interface LoadProjectLayoutProps {
  projects: Project[] | null;
  showLoadOverlay: boolean;
  setShowLoadOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoadProjectLayout: React.FC<LoadProjectLayoutProps> = ({
  showLoadOverlay,
  setShowLoadOverlay,
  projects,
}) => {
  const projectState = useTypedSelector((state) => state.projects);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {};

  useEffect(() => {}, []);

  return (
    <div
      className="overlay"
      style={{ visibility: showLoadOverlay ? 'visible' : 'hidden' }}
      css={loadProjectStyles}
      onClick={(e) => {
        if ((e.target as HTMLDivElement).classList.contains('overlay')) {
          setShowLoadOverlay(false);
        }
      }}
    >
      <div className="load-project-wrapper">
        <div className="load-project-container">
          <h1>Your Projects</h1>
          {projects
            ? projects.map((project) => {
                return <ProjectCard key={project.id} project={project} />;
              })
            : ''}
        </div>
        <i
          onClick={() => {
            setShowLoadOverlay(false);
          }}
          className="fas fa-times"
        ></i>
      </div>
    </div>
  );
};
