/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { motion } from 'framer-motion';
import React from 'react';
import Typist from 'react-typist';

const homeStyles = css`
  background: #070708;
  height: 100vh;
  .header {
    padding-top: 8.5rem;
    display: flex;
    align-items: center;
    flex-direction: column;

    h1 {
      color: #fff;
      font-size: 700;
      font-family: 'Architects Daughter';
      font-size: 3.8em;
      margin-bottom: 0.5rem;
    }
    p {
      color: gray;
      font-size: 2em;
      font-family: 'Architects Daughter';
    }
  }
`;

export const Home: React.FC = () => {
  return (
    <div css={homeStyles}>
      <div className="navbar"></div>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="header"
      >
        <h1>Write effective notes, together</h1>
        <Typist>
          <p>
            <Typist.Delay ms={1000} />
            Code. <Typist.Delay ms={500} /> Document.
            <Typist.Delay ms={500} /> Draw.
          </p>
        </Typist>
      </motion.div>
      <div></div>
    </div>
  );
};
