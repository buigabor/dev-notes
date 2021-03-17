/** @jsxImportSource @emotion/react */
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import React from 'react';
import { useActions } from '../../hooks/useActions';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Project } from '../../state/reducers/projectsReducer';
import { Alert } from '../Utils/Alert';

const useStyles = makeStyles({
  root: {
    width: '100%',
    marginBottom: 20,
    flexShrink: 0,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
  },
  subtitle: {
    marginBottom: 20,
  },
  loadBtn: { color: '#3C55E0', fontSize: 14 },
});

interface ProjectCardProps {
  project: Project;
  setShowLoadOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  setShowLoadOverlay,
}) => {
  const { loadCells, showAlert, hideAlert, loadProject } = useActions();
  const cellsState = useTypedSelector((state) => state.cells);

  const classes = useStyles();
  return (
    <>
      <Alert />
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title}>{project.title}</Typography>
          <Typography
            className={classes.subtitle}
            variant="body2"
            component="p"
            color="textSecondary"
          >
            {project.subtitle}
          </Typography>
          <Typography variant="body2" component="p">
            {project.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={async () => {
              try {
                const res = await axios.post(
                  'http://localhost:4005/cells',
                  { projectId: project.id },
                  {
                    withCredentials: true,
                  },
                );
                const data = res.data.data.cellsData;
                const order = res.data.data.order;
                loadCells(order, data);
                loadProject(project);
                setShowLoadOverlay(false);
                showAlert('Project loaded!', 'success');
                setTimeout(() => {
                  hideAlert();
                }, 2000);
              } catch (error) {
                showAlert('Project failed to load', 'error');
                setTimeout(() => {
                  hideAlert();
                }, 1500);
              }
            }}
            className={classes.loadBtn}
            size="small"
          >
            Load Project
          </Button>
        </CardActions>
      </Card>
    </>
  );
};
