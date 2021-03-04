import React, { useEffect, useState } from 'react';
import bundlerHandler from '../bundler';
import CodeEditor from './CodeEditor';
import { Preview } from './Preview';
import { Resizable } from './Resizable';

export const CodeCell = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Debounce logic
    const timer = setTimeout(async () => {
      // Bundle the raw code the user entered
      const output = await bundlerHandler(input);
      setCode(output.code);
      setError(output.error);
    }, 850);

    return () => {
      clearTimeout(timer);
    };
  }, [input]);

  return (
    <Resizable direction="vertical">
      <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            setError={setError}
            initialValue="const a = 1;"
            onChange={(value) => {
              setInput(value);
            }}
          />
        </Resizable>
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
