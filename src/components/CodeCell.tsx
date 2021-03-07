import React, { useEffect, useState } from 'react';
import bundlerHandler from '../bundler';
import { useActions } from '../hooks/useActions';
import { Cell } from '../state';
import CodeEditor from './CodeEditor';
import { Preview } from './Preview';
import { Resizable } from './Resizable';

interface CodeCellProps {
  cell: Cell;
}

export const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { updateCell } = useActions();

  useEffect(() => {
    // Debounce logic
    const timer = setTimeout(async () => {
      // Bundle the raw code the user entered
      const output = await bundlerHandler(cell.content);
      setCode(output.code);
      setError(output.error);
    }, 850);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            setError={setError}
            initialValue=""
            onChange={(value) => {
              updateCell(cell.id, value);
            }}
          />
        </Resizable>
        <Preview code={code} error={error} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
