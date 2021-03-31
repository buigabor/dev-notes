/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Typist from 'react-typist';

const homeStyles = css`
  background: rgb(7, 7, 8);
  height: 100%;
  padding-bottom: 8rem;

  .signUpBtn: {
      color: #06c8bf,
      border: 1px solid #06c8bf,
      padding: 8px 13px,
      margin: 0 8px,

      &:hover: {
        backgroundColor: #04ada5,;
        border: 1px solid #04ada5,;
        color: #fff,
      },
    },

  .navbar {
    padding: 1rem 0;
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
    top: 45%;
    left: 26%;
    transform: translate(-50%, -50%);

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .header {
    padding-top: 5.5rem;
    display: flex;
    align-items: center;
    flex-direction: column;

    h1 {
      color: #fff;
      font-size: 700;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue';
      font-size: 3.5em;
      margin-bottom: 0.5rem;
    }
    p {
      color: #9e9d9d;
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
      padding-top: 48rem;
    }
    &-header {
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
          rgba(7, 7, 8, 1) 85%
        ),
        /* linear-gradient(
          rgba(0, 0, 0, 0) 0%,
          rgba(7, 7, 8, 1) 110%
        ), */
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
    transition: { duration: .7 },
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
    transition: { duration: .7 },
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

  useEffect(()=>{

    setTimeout(() => {
      setShowCodePic(true);
    }, 2500);
    setTimeout(() => {
      setShowCodePic(false)
      setShowTextPic(true);
    }, 4700);
    setTimeout(() => {
      setShowTextPic(false);
      setShowSketchPic(true)
    }, 6700);

  },[])

  return (
    <div css={homeStyles}>
      <div className="navbar"><span className='logo'>DEVNOTES</span></div>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.75, duration: 1.2 }}
        className="header"
      >
        <h1>Write effective notes, together</h1>
        <Typist>
          <p>
            <Typist.Delay ms={2200} />
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
      <div className="collaboration-wrapper">
        <div className="collaboration-header">
          <h1>Code collaboration made easy</h1>
          <p>A link is all you need to hop into a room and share your notes.</p>
        </div>
        <div className="collaboration-img">
          {/* <img src="/images/collaboration.png" alt="Collaboration" /> */}
        </div>
      </div>
    </div>
  );
};
