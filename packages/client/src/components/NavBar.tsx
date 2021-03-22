/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { useActions } from '../hooks/useActions';
import { Alert } from './Utils/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '1.5rem',
      flexGrow: 1,
      backgroundColor: '#10151f',
      padding: '0 12px',
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
    username: {
      justifyContent: 'flex-end',
      marginLeft: 10,
      cursor: 'pointer',
      '& span': {
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

    collabBtn: {
      color: '#06c8bf',
      border: '1px solid #06c8bf',
      borderRadius: 4,
      padding: '0px 8px',
      margin: '0 8px',
      marginLeft: 'auto',
      transition: 'all 0.2s ease-in-out',
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: '#04ada5',
        border: '1px solid #04ada5',
        color: '#fff',
      },

      '& i': {
        marginRight: 10,
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

const dropdownStyles = css`
  position: absolute;
  z-index: 50;
  width: 9rem;
  top: 3.5rem;
  right: 1rem;
  background-color: #fff;
  color: rgb(66, 66, 66);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 5px;
  .nav-dropdown__row:not(:first-of-type) {
    border-top: 1px solid gray;
  }
  .nav-dropdown__row {
    outline: none;
    cursor: pointer;
    font-size: 1em;
    padding: 0.8rem 0 0.8rem 1rem;
    span {
      width: 100%;
    }
    svg {
      margin: 0;
      margin-right: 8px;
    }
  }
  .fas {
    margin-right: 10px;
  }
`;

export const NavBar = () => {
  const classes = useStyles();
  const [user, setUser] = useState({ username: '', userId: null });
  const [profileClicked, setProfileClicked] = useState<boolean>(false);
  const [logoutClicked, setLogoutClicked] = useState(false);
  const [roomId, setRoomId] = useState('');
  const { showAlert, hideAlert } = useActions();
  const history = useHistory();
  const location = useLocation();

  const randomId = () => {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substr(2, 7);
    };
    return S4() + S4() + '-' + S4() + S4() + '-' + S4() + S4() + S4();
  };

  useEffect(() => {
    setRoomId(randomId());
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:4005/user', { withCredentials: true })
      .then((res) => {
        const { username, userId } = res.data;
        setUser({ username, userId });
      })
      .catch((error) => {
        setUser({ username: '', userId: null });
        console.log('User not found');
      });
  }, [location, logoutClicked]);

  return (
    <>
      <Alert />
      <div>
        <AppBar className={classes.root} position="static">
          <Toolbar>
            <Link className={classes.logoText} to="/">
              <Typography>DEVNOTES</Typography>
            </Link>

            {user.username ? (
              <>
                <Link className={classes.collabBtn} to={`/room/${roomId}`}>
                  <Button color="inherit">
                    <i className="fas fa-comments"></i> Collaborate
                  </Button>
                </Link>
                <div
                  onClick={() => {
                    setProfileClicked(!profileClicked);
                  }}
                  className={classes.username}
                >
                  <span>{user.username}</span>
                </div>
              </>
            ) : (
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
            )}
          </Toolbar>
        </AppBar>
        <div
          css={dropdownStyles}
          style={{ display: profileClicked ? 'inline-block' : 'none' }}
        >
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'l') {
                setProfileClicked(false);
              }
            }}
            className="nav-dropdown__row"
            onClick={() => {
              setProfileClicked(false);
            }}
          >
            <span>
              <i className="fas fa-user"></i>Profile
            </span>
          </div>
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'l') {
                setProfileClicked(false);
              }
            }}
            className="nav-dropdown__row"
            onClick={() => {
              setProfileClicked(false);
            }}
          >
            <span
              onClick={async () => {
                try {
                  await axios.get('http://localhost:4005/auth/logout', {
                    withCredentials: true,
                  });
                  setLogoutClicked(!logoutClicked);
                  showAlert('Logout successful!', 'success');
                  setTimeout(() => {
                    hideAlert();
                  }, 1500);
                  history.push('/');
                } catch (error) {
                  showAlert('Logout failed!', 'error');
                  setTimeout(() => {
                    hideAlert();
                  }, 1500);
                }
              }}
            >
              <i className="fas fa-sign-out-alt"></i>Logout
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
