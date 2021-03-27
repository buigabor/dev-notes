/** @jsxImportSource @emotion/react */
import { LinearProgress, withStyles } from '@material-ui/core';
import { ControlledEditor } from '@monaco-editor/react';
import { MapClient } from '@roomservice/browser';
import codeShift from 'jscodeshift';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import React, { useEffect, useRef, useState } from 'react';
import bundlerHandler from '../../bundler';
import { useCumulativeCodeShared } from '../../hooks/useCumulativeCodeShared';
import { Preview } from '../Celltypes/Preview';
import editorStyles from '../Celltypes/styles/codeEditorStyles';
import linearProgressStyles from '../Celltypes/styles/linearProgressStyles';
import { Resizable } from '../Utils/Resizable';

interface CodeCellSharedProps {
  cell: { id: string; type: string; content: string };
  dataMap: MapClient<any> | undefined;
  data: {
    [key: string]: {
      id: string;
      type: string;
      content: string;
    };
  };
}

export const CodeCellShared: React.FC<CodeCellSharedProps> = ({
  cell,
  data,
  dataMap,
}) => {
  const [bundle, setBundle] = useState('');
  const [bundleError, setBundleError] = useState('');
  const [bundleLoading, setBundleLoading] = useState(false);
  const [codeDebounced, setCodeDebounced] = useState('');
  const editorRef = useRef<any>();

  const cumulativeCode = useCumulativeCodeShared();

  async function bundleCode(input: string) {
    const result = await bundlerHandler(input);
    setBundle(result.code);
    setBundleError(result.error);
  }
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
      bundleCode(cumulativeCode + '\n' + data[cell.id].content);
      setBundleLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data[cell.id].content]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      dataMap?.set(cell.id, {
        id: cell.id,
        type: cell.type,
        content: codeDebounced,
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [codeDebounced]);

  const onEditorDidMount = (getValue: any, monacoEditor: any) => {
    editorRef.current = monacoEditor;
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

  const onFormatClick = () => {
    // get current value from editor
    try {
      const currentCode = editorRef.current.getModel().getValue();
      // format that value
      const formattedCode = prettier
        .format(currentCode, {
          parser: 'babel',
          plugins: [parser],
          useTabs: false,
          semi: true,
          singleQuote: true,
        })
        .replace(/\n$/, '');
      // set it as the new value
      editorRef.current?.setValue(formattedCode);
    } catch (error) {
      bundleCode(error.message);
    }
  };

  const StyledLinearProgress = withStyles({
    root: {
      width: 200,
      height: 15,
    },
    barColorPrimary: {
      backgroundColor: '#00b5ad',
    },
  })(LinearProgress);
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
              <button className="format-btn" onClick={onFormatClick}>
                Format
              </button>
              <ControlledEditor
                editorDidMount={onEditorDidMount}
                onChange={(event: any, value: any) => {
                  setCodeDebounced(value);
                }}
                value={data[cell.id].content || ''}
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
    </>
  );
};
