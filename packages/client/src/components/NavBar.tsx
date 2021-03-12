import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: '#10151f',
    },
    buttonWrapper: {
      marginLeft: 'auto',
    },

    signUpBtn: {
      color: '#06c8bf',
      border: '1px solid #06c8bf',
      padding: '8px 13px',
      margin: '0 8px',
      '&:hover': {
        backgroundColor: '#04ada5',
        border: '1px solid #04ada5',
        color: '#fff',
      },
    },

    loginBtn: {
      color: '#fff',
      border: '1px solid #fff',
      padding: '8px 13px',
      margin: '0 8px',
      '&:hover': {
        backgroundColor: '#fff',
        color: '#262d3b',
      },
    },
  }),
);

export const NavBar = () => {
  const classes = useStyles();
  return (
    <div>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <div className={classes.buttonWrapper}>
            <Button className={classes.signUpBtn} color="inherit">
              SIGN UP
            </Button>
            <Button className={classes.loginBtn} color="inherit">
              LOGIN
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      ;
    </div>
  );
};
