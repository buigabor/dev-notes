import { makeStyles, Theme, withStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React from 'react';

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiOutlinedInput-input': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white',
      },
      '&:hover fieldset': {
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white',
      },
    },
    '& label': {
      color: 'white',
    },
  },
})(TextField);

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    marginTop: '2rem',
    marginBottom: '1rem',
    padding: '.1rem 6rem 1.5rem 6rem',
    backgroundColor: '#20232c',
    borderRadius: '15px',
    maxWidth: '550px',
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  },
  text: {
    color: '#fff',
  },
  link: { color: '#00b5ad', textDecoration: 'none' },
  outlinedTextfield: {
    color: '#fff',
    borderColor: '#fff',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '2rem',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    color: 'white',
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#00b5ad',
    '&:hover': { backgroundColor: '#0cd1c7' },
  },
}));

export const Login: React.FC = () => {
  const classes = useStyles();
  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography className={classes.text} component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CssTextField
                InputLabelProps={{
                  className: classes.outlinedTextfield,
                }}
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
              />
            </Grid>
            <Grid item xs={12}>
              <CssTextField
                InputLabelProps={{
                  className: classes.outlinedTextfield,
                }}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link className={classes.link} href="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
