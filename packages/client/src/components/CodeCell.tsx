/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useActions } from '../hooks/useActions';
import { useCumulativeCode } from '../hooks/useCumulativeCode';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { Cell } from '../state';
import CodeEditor from './CodeEditor';
import { Preview } from './Preview';
import { Resizable } from './Resizable';

interface CodeCellProps {
  cell: Cell;
}

const linearProgressStyles = css`
  height: 100%;
  flex-grow: 1;
  background-color: #fff;
  .progress-cover {
    height: 100%;
    width: 100%;
    flex-grow: 1;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.5s;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const StyledLinearProgress = withStyles({
  root: {
    width: 200,
    height: 15,
  },
  barColorPrimary: {
    backgroundColor: '#00b5ad',
  },
})(LinearProgress);

export const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  // Get the accumulated code content of the previous code cells
  const cumulativeCode = useCumulativeCode(cell.id);

  // Get the bundled code for this specific code cell
  const bundle = useTypedSelector((state) => {
    return state.bundles[cell.id];
  });

  useEffect(() => {
    // Create the initial bundle
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    // Debounce logic
    const timer = setTimeout(async () => {
      // Bundle the raw code the user entered
      createBundle(cell.id, cumulativeCode);
    }, 850);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.id, createBundle, cumulativeCode]);

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
            cellId={cell.id}
            initialValue=""
            onChange={(value) => {
              updateCell(cell.id, value);
            }}
          />
        </Resizable>
        <div css={linearProgressStyles}>
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <StyledLinearProgress />
            </div>
          ) : (
            <Preview code={bundle.code} error={bundle.error} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
