/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { Project } from '../../state/reducers/projectsReducer';
import { ProjectCard } from './ProjectCard';
import loadProjectStyles from './styles/loadProjectStyles';

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
                return (
                  <ProjectCard
                    setShowLoadOverlay={setShowLoadOverlay}
                    key={project.id}
                    project={project}
                  />
                );
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
