import { css, Global } from '@emotion/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { TextEditor } from './components/TextEditor';

export const App = () => {
  return (
    <>
      <Global
        styles={css`
          body {
            margin: 0;
            padding: 0;
          }
          ol,
          ul {
            list-style: none;
          }
        `}
      />
      <div>
        <TextEditor />
        {/* <CodeCell /> */}
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
