/** @jsxImportSource @emotion/react */
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { ControlledEditor } from '@monaco-editor/react';
import { useMap, useRoom } from '@roomservice/react';
import MDEditor from '@uiw/react-md-editor';
import codeShift from 'jscodeshift';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import bundlerHandler from '../bundler';
import { useCumulativeCodeShared } from '../hooks/useCumulativeCodeShared';
import { Preview } from './Celltypes/Preview';
import editorStyles from './Celltypes/styles/codeEditorStyles';
import linearProgressStyles from './Celltypes/styles/linearProgressStyles';
import cellListStyles from './styles/cellListStyles';
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

interface IMyProps {}

interface IReactRouterParams {
  id: string;
}

export const RoomService: React.FC<RouteComponentProps<IReactRouterParams>> = ({
  match,
}) => {
  const [content, map] = useMap<{
    textContent: string;
    codeContent: string;
    id: string;
  }>(match.params?.id, 'newMapName');
  const room = useRoom('myroom2');
  console.log(room);

  const [bundle, setBundle] = useState('');
  const [bundleError, setBundleError] = useState('');
  const [bundleLoading, setBundleLoading] = useState(false);
  const [textArea, setTextArea] = useState('');

  useEffect(() => {
    setTextArea(content.textContent);
  }, [content.textContent]);

  const [codeDebounced, setCodeDebounced] = useState('');

  // Get the accumulated code content of the previous code cells
  const cumulativeCode = useCumulativeCodeShared();

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
    setBundle(result.code);
    setBundleError(result.error);
  }

  useEffect(() => {
    if (map) {
      map?.set('id', 'asdfasdf');
    }
  }, [map]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      map?.set('codeContent', codeDebounced);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [codeDebounced]);

  useEffect(() => {
    // Create the initial bundle

    if (!bundle) {
      setBundleLoading(true);
      bundleCode(cumulativeCode);
      setBundleLoading(false);
      return;
    }

    // Debounce logic
    const timer = setTimeout(async () => {
      setBundleLoading(true);
      // Bundle the raw code the user entered
      bundleCode(cumulativeCode + '\n' + content.codeContent);
      setBundleLoading(false);
    }, 2000);

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
      <div css={cellListStyles}>
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
              {!bundle && bundleLoading ? (
                <div className="progress-cover">
                  <StyledLinearProgress />
                </div>
              ) : (
                <Preview code={bundle} error={bundleError} />
              )}
            </div>
          </div>
        </Resizable>
        <div>
          {' '}
          <MDEditor
            textareaProps={{
              value: content.textContent,
            }}
            value={content.textContent}
            onChange={(text) => {
              if (text) {
                map.set('textContent', text);
                setTextArea(text);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};
