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
import axios from 'axios';
import React, { ChangeEvent, useState } from 'react';
import { useHistory } from 'react-router';

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

interface User {
  username: string;
  password: string;
  email: string;
}

export const SignUp: React.FC = () => {
  const [user, setUser] = useState<User>({
    username: '',
    password: '',
    email: '',
  });

  const history = useHistory();
  const classes = useStyles();

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value } as any);
  };

  return (
    <Container className={classes.container} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography className={classes.text} component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            axios
              .post(
                'http://localhost:4005/user/register',
                { ...user },
                { withCredentials: true },
              )
              .then((res) => {
                if (res.status === 200) {
                  alert('Registration successful');
                  history.push('/');
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }}
          className={classes.form}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CssTextField
                onChange={onChange}
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
                onChange={onChange}
                InputLabelProps={{
                  className: classes.outlinedTextfield,
                }}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <CssTextField
                onChange={onChange}
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link className={classes.link} href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
