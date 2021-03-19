/** @jsxImportSource @emotion/react */
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { ControlledEditor } from '@monaco-editor/react';
import { useMap } from '@roomservice/react';
import MDEditor from '@uiw/react-md-editor';
import codeShift from 'jscodeshift';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import React, { useEffect, useState } from 'react';
import bundlerHandler from '../bundler';
import { useCumulativeCodeShared } from '../hooks/useCumulativeCodeShared';
import { Preview } from './Celltypes/Preview';
import editorStyles from './Celltypes/styles/codeEditorStyles';
import linearProgressStyles from './Celltypes/styles/linearProgressStyles';
import { Resizable } from './Utils/Resizable';

const StyledLinearProgress = withStyles({
  root: {
    width: 200,
    height: 15,
  },
  barColorPrimary: {
    backgroundColor: '#00b5ad',
  },
})(LinearProgress);

export const RoomService: React.FC = () => {
  const [content, map] = useMap<{
    textContent: string;
    codeContent: string;
    id: string;
    bundle: string;
    bundleError: string;
  }>('myroom', 'newMapName');

  const [codeDebounced, setCodeDebounced] = useState('');

  // Get the accumulated code content of the previous code cells
  const cumulativeCode = useCumulativeCodeShared();

  // Get the bundled code for this specific code cell

  // const memoizeBundle = useCallback(
  //   (input) => {
  //     async function bundleCode(input: string) {
  //       const result = await bundlerHandler(input);
  //       map?.set('bundle', result.code);
  //       map?.set('bundleError', result.error);
  //     }
  //     bundleCode(input);
  //   },
  //   [map],
  // );
  const onEditorDidMount = (getValue: any, monacoEditor: any) => {
    // Highlight JSX syntax inside editor
    const highlighter = new MonacoJSXHighlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor,
    );

    // Call empty functions when errors occurs
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {},
    );
  };

  async function bundleCode(input: string) {
    const result = await bundlerHandler(input);
    map?.set('bundle', result.code);
    map?.set('bundleError', result.error);
  }

  useEffect(() => {
    if (map) {
      map?.set('id', 'asdfasdf');
    }
  }, [map]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      map?.set('codeContent', codeDebounced);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [codeDebounced, map]);

  useEffect(() => {
    // Create the initial bundle
    if (!content.bundle) {
      bundleCode(cumulativeCode);
      return;
    }
    // Debounce logic
    const timer = setTimeout(async () => {
      // Bundle the raw code the user entered
      bundleCode(content.codeContent);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content.codeContent]);

  if (!map) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Resizable direction="vertical">
        <div
          style={{
            height: 'calc(100% - 10px)',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Resizable direction="horizontal">
            <div css={editorStyles}>
              <button className="format-btn">Format</button>
              <ControlledEditor
                editorDidMount={onEditorDidMount}
                onChange={(event: any, value: any) => {
                  setCodeDebounced(value);
                }}
                value={content.codeContent}
                options={{
                  wordWrap: 'on',
                  minimap: { enabled: false },
                  showUnused: false,
                  folding: false,
                  lineNumbersMinChars: 3,
                  fontSize: 16,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
                theme="vs-dark"
                language="javascript"
                height="100%"
              />
            </div>
          </Resizable>
          <div css={linearProgressStyles}>
            {!content.bundle ? (
              <div className="progress-cover">
                <StyledLinearProgress />
              </div>
            ) : (
              <Preview code={content.bundle} error={content.bundleError} />
            )}
          </div>
        </div>
      </Resizable>
      <div>
        {' '}
        <MDEditor
          textareaProps={{ value: map.get('textContent') }}
          value={content.textContent}
          onChange={(text) => {
            if (text) {
              // updateCell(cell.id, text || '');
              map.set('textContent', text);
            }
          }}
        />
      </div>
    </>
  );
};
