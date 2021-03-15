import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '1.5rem',
      flexGrow: 1,
      backgroundColor: '#10151f',
    },
    logoText: {
      textDecoration: 'none',
      '& p': {
        color: '#fff',
        fontSize: '1.5rem',
        fontWeight: 800,

        fontFamily: 'Architects Daughter',
      },
    },
    buttonWrapper: {
      marginLeft: 'auto',
      '& a': {
        textDecoration: 'none',
      },
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
  useEffect(() => {
    axios.post('/');
  }, []);
  return (
    <div>
      <AppBar className={classes.root} position="static">
        <Toolbar>
          <Link className={classes.logoText} to="/">
            <Typography>DEVNOTES</Typography>
          </Link>
          <div className={classes.buttonWrapper}>
            <Link to="/signup">
              <Button className={classes.signUpBtn} color="inherit">
                SIGN UP
              </Button>
            </Link>
            <Link to="/login">
              <Button className={classes.loginBtn} color="inherit">
                LOGIN
              </Button>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
