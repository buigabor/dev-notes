/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Typist from 'react-typist';

const homeStyles = css`
  background: rgb(7, 7, 8);
  height: 100%;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;

  .loginBtn {
    color: #fff;
    border: 1px solid #fff;
    padding: 12px 13px;
    margin: 0 8px;
    background-color: transparent;
    border-radius: 5px;
    font-weight: 500;
    font-size: 0.9em;
    cursor: pointer;
    transition: all 0.2s ease-in;
    &:hover {
      background-color: #fff;
      color: #000;
    }
  }

  .signUpBtn {
    color: #06c8bf;
    border: 1px solid #06c8bf;
    background-color: transparent;
    border-radius: 5px;
    padding: 12px 13px;
    margin: 0 8px;
    font-weight: 500;
    font-size: 0.9em;
    cursor: pointer;
    transition: all 0.2s ease-in;

    &:hover {
      background-color: #04ada5;
      border: 1px solid #04ada5;
      color: #fff;
    }
  }

  .get-started {
    &-wrapper {
      padding-top: 15rem;
      align-self: center;
      margin-bottom: 14rem;
    }

    &-btn {
      color: #fff;
      border: none;
      font-size: 1.2em;
      border-radius: 10px;
      padding: 12px 24px;
      max-width: 12rem;
      cursor: pointer;
      background-color: #04ada5;
      transition: all 0.25s ease-in;

      &:hover {
        background-color: #05958e;
        transform: scale(1.02);
      }
    }
  }

  .navbar {
    padding: 1rem 0;
    display: flex;
    align-items: center;
    &-buttons {
      margin-left: auto;
      margin-right: 15px;
    }
    .logo {
      font-size: 2.1em;
      margin-left: 2rem;
      color: #fff;
      font-family: 'Architects Daughter';
    }
  }
  .Cursor {
    display: none;
  }
  .image-container {
    width: 50vw;
    position: absolute;
    top: 48%;
    left: 26%;
    transform: translate(-50%, -50%);

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .header {
    padding-top: 1.5rem;
    display: flex;
    align-items: center;
    flex-direction: column;

    h1 {
      color: #fff;
      font-size: 700;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
      font-size: 3.2em;
      margin-bottom: 0.4rem;
    }
    p {
      color: #1ab9b1;
      font-size: 2.25em;
      font-family: 'Architects Daughter';
    }
  }

  .collaboration {
    &-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding-top: 5rem;
    }
    &-header {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
      h1 {
        color: #fff;
        font-size: 3em;
      }
      p {
        color: #9e9d9d;
        font-size: 1.5em;
        font-weight: normal;
        color: rgb(153, 153, 153);
        text-align: center;
        margin-bottom: 5.5rem;
      }
    }
    &-img {
      background-image: linear-gradient(
          rgba(0, 0, 0, 0) 0%,
          rgba(7, 7, 8, 0.8) 100%
        ),
        url('/images/collaboration.png');
      width: 1100px;
      height: 580px;
      background-size: contain;
      img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        position: relative;
        z-index: 4;

        /* visibility:hidden; */
      }
    }
  }

  .what-we-do {

    display: flex;
    justify-content: center;
    gap: 45px;
    padding:10rem 0;

    &-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 220px;
      padding: 30px;
      border: 1.5px solid #04ada5;
      border-radius: 15px;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Open Sans, Helvetica Neue;
      i {
        padding-top: 20px;
        margin-bottom: 15px;
        color: #04ada5;
        font-size: 3.5em;
        align-self: center;
      }
      h1 {
        color: #fff;
        font-size: 1.45em;
      }
      p {
        text-align:center;
        color: rgb(153, 153, 153);
      }
    }
  }

  .footer {
    padding-top: 8rem;
    display: flex;
    justify-content: space-evenly;

    &-column {
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Open Sans, Helvetica Neue;
      span {
        color: #fff;
        font-size: 1.2em;
        font-weight: 600;
      }
      ul {
        padding: 0;
      }
      li {
        list-style: none;
        color: rgb(153, 153, 153);
      }
    }
  }

  .copyright {
    display:flex;
    justify-content:center;
    padding-top: 5rem;
    color: rgb(153, 153, 153);
  }
`;

const containerCodeVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2},
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: .55 },
  },
};

const containerTextVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2 },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: .55 },
  },
};

const containerSketchVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2 },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 2 },
  },
};

export const Home: React.FC = () => {
  const [showCodePic, setShowCodePic] = useState(false)
  const [showTextPic, setShowTextPic] = useState(false);
  const [showSketchPic, setShowSketchPic] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(()=>{

    setTimeout(() => {
      setShowCodePic(true);
    }, 2100);
    setTimeout(() => {
      setShowCodePic(false)
      setShowTextPic(true);
    }, 4400);
    setTimeout(() => {
      setShowTextPic(false);
      setShowSketchPic(true)
    }, 6400);

  },[])

  return (
    <div css={homeStyles}>
      <div className="navbar">
        <span className="logo">DEVNOTES</span>
        <div className="navbar-buttons">
          <button className="signUpBtn">SIGN UP</button>
          <button className="loginBtn">LOGIN</button>
        </div>
      </div>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.85 }}
        className="header"
      >
        <h1>Write effective notes, together</h1>
        <Typist>
          <p>
            <Typist.Delay ms={1900} />
            Code. <Typist.Delay ms={1500} /> Document.
            <Typist.Delay ms={1500} /> Draw.
          </p>
        </Typist>
      </motion.div>

      <AnimatePresence>
        {showCodePic && (
          <motion.div
            key={Math.random()}
            variants={containerCodeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="image-container"
          >
            <img alt="Code Cell" src="/images/code-cell.png" />
          </motion.div>
        )}
        {showTextPic && (
          <motion.div
            key={Math.random()}
            variants={containerTextVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="image-container"
          >
            <img alt="Text Cell" src="/images/text-cell.png" />
          </motion.div>
        )}
        {showSketchPic && (
          <motion.div
            key={Math.random()}
            variants={containerSketchVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="image-container"
          >
            <img alt="Sketch Cell" src="/images/sketch-cell.png" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 8, duration: 0.8 } }}
        className="get-started-wrapper"
      >
        <button type="button" className="get-started-btn">
          Get Started <i className="fas fa-arrow-alt-circle-right"></i>
        </button>
      </motion.div>
      <div
        data-aos="fade-up"
        data-aos-delay="300"
        data-aos-easing="ease"
        data-aos-duration="1600"
        data-aos-once="true"
        className="collaboration-wrapper"
      >
        <div className="collaboration-header">
          <h1>Code collaboration made easy</h1>
          <p>A link is all you need to hop into a room and share your notes.</p>
        </div>
        <div className="collaboration-img">
          {/* <img src="/images/collaboration.png" alt="Collaboration" /> */}
        </div>
      </div>
      <div
        data-aos="fade-up"
        data-aos-delay="300"
        data-aos-easing="ease"
        data-aos-duration="1600"
        data-aos-once="true"
        className="what-we-do"
      >
        <div className="what-we-do-container">
          <i className="far fa-sticky-note"></i>
          <h1>Take notes</h1>
          <p>
            Create projects with 3 different kind of tools. Write code online,
            create documentations and make quick sketches
          </p>
        </div>

        <div className="what-we-do-container">
          <i className="far fa-user"></i>
          <h1>Knowledge Sharing</h1>
          <p>
            Learn from each other and share your tricks and tips with others
          </p>
        </div>

        <div className="what-we-do-container">
          <i className="far fa-comments"></i>
          <h1>Better Feedback</h1>
          <p>
            Give and get feedback, on code or documentation. Learn more
            effectively.{' '}
          </p>
        </div>
      </div>

      <div className="footer">
        <div className="footer-column">
          <span>Product</span>
          <ul>
            <li>Coding</li>
            <li>Document</li>
            <li>Text</li>
          </ul>
        </div>
        <div className="footer-column">
          <span>Explore</span>
          <ul>
            <li>Github</li>
            <li>Featured Projects</li>
          </ul>
        </div>
        <div className="footer-column">
          <span>About</span>
          <ul>
            <li>Terms Of Use</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-column">
          <span>Support</span>
          <ul>
            <li>Hit me up boi</li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <span>Copyright &copy; 2021 Gabriel Bui</span>
      </div>
    </div>
  );
};
