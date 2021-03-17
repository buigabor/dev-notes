/** @jsxImportSource @emotion/react */
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import React, { useEffect } from 'react';
import { useActions } from '../../hooks/useActions';
import { useCumulativeCode } from '../../hooks/useCumulativeCode';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { Cell } from '../../state';
import { Resizable } from '../Utils/Resizable';
import CodeEditor from './CodeEditor';
import { Preview } from './Preview';
import linearProgressStyles from './styles/linearProgressStyles';

interface CodeCellProps {
  cell: Cell;
}

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
            initialValue={cell.content || ''}
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
