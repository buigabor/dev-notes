/** @jsxImportSource @emotion/react */
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import codeShift from 'jscodeshift';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef } from 'react';
import editorStyles from './styles/codeEditorStyles';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    // Whenever there are changes in the editor, we get the code content from the editor and set it as a state
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

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
  };

  return (
    <div css={editorStyles}>
      <button className="format-btn" onClick={onFormatClick}>
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
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
        height="500px"
      />
    </div>
  );
};

export default CodeEditor;
