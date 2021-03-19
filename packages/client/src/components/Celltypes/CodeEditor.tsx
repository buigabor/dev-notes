/** @jsxImportSource @emotion/react */
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import codeShift from 'jscodeshift';
import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';
import { useRef } from 'react';
import { useActions } from '../../hooks/useActions';
import editorStyles from './styles/codeEditorStyles';

interface CodeEditorProps {
  cellId: string;
  value: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, cellId }) => {
  const editorRef = useRef<any>();
  const { createBundle } = useActions();

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    // Whenever there are changes in the editor, we get the code content from the editor and set it as a state
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

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
      createBundle(cellId, error.message);
    }
  };

  return (
    <div css={editorStyles}>
      <button className="format-btn" onClick={onFormatClick}>
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={value}
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
  );
};

export default CodeEditor;

/** @jsxImportSource @emotion/react */
// import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
// import codeShift from 'jscodeshift';
// import MonacoJSXHighlighter from 'monaco-jsx-highlighter';
// import prettier from 'prettier';
// import parser from 'prettier/parser-babel';
// import { useRef } from 'react';
// import MonacoEditor, { EditorDidMount } from 'react-monaco-editor';
// import { useActions } from '../../hooks/useActions';
// import { useTypedSelector } from '../../hooks/useTypedSelector';
// import editorStyles from './styles/codeEditorStyles';

// interface CodeEditorProps {
//   sharing: boolean;
//   cellId: string;
//   value: string;
//   sharedValue: string;
//   onChangeShareValue: (value: string) => void;
// }

// const CodeEditor: React.FC<CodeEditorProps> = ({
//   value,
//   // onChange,
//   cellId,
//   sharedValue,
//   onChangeShareValue,
//   sharing,
// }) => {
//   const editorRef = useRef<any>();
//   const { createBundle, updateCell } = useActions();
//   const cells = useTypedSelector((state) => state.cells);

//   const onEditorDidMount: EditorDidMount = (editor, monaco) => {
//     editorRef.current = editor;

//     editor.onDidChangeModelContent(() => {
//       // onChange(editor.getValue());
//       const codeContent = editor.getValue();
//         updateCell(cellId, codeContent);
//     });

//     // Whenever there are changes in the editor, we get the code content from the editor and set it as a state
//     // editor.onDidChangeModelContent(() => {
//     //   onChange(editor.getValue());
//     // });

//     // monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

//     // Highlight JSX syntax inside editor
//     const highlighter = new MonacoJSXHighlighter(
//       // @ts-ignore
//       monaco,
//       codeShift,
//       editor,
//     );

//     // Call empty functions when errors occurs
//     highlighter.highLightOnDidChangeModelContent(
//       () => {},
//       () => {},
//       undefined,
//       () => {},
//     );
//   };

//   const onFormatClick = () => {
//     // get current value from editor
//     try {
//       const currentCode = editorRef.current.getModel().getValue();
//       // format that value
//       const formattedCode = prettier
//         .format(currentCode, {
//           parser: 'babel',
//           plugins: [parser],
//           useTabs: false,
//           semi: true,
//           singleQuote: true,
//         })
//         .replace(/\n$/, '');
//       // set it as the new value
//       editorRef.current?.setValue(formattedCode);
//     } catch (error) {
//       createBundle(cellId, error.message);
//     }
//   };

//   if (sharing) {
//     return (
//       <div css={editorStyles}>
//         <button className="format-btn" onClick={onFormatClick}>
//           Format
//         </button>
//         <MonacoEditor
//           editorDidMount={onEditorDidMount}
//           value={sharedValue}
//           options={{
//             wordWrap: 'on',
//             minimap: { enabled: false },
//             showUnused: false,
//             folding: false,
//             lineNumbersMinChars: 3,
//             fontSize: 16,
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//           }}
//           theme="vs-dark"
//           language="javascript"
//           height="100%"
//         />
//       </div>
//     );
//   } else {
//     return (
//       <div css={editorStyles}>
//         <button className="format-btn" onClick={onFormatClick}>
//           Format
//         </button>
//         <MonacoEditor
//           editorDidMount={onEditorDidMount}
//           defaultValue={value}
//           options={{
//             wordWrap: 'on',
//             minimap: { enabled: false },
//             showUnused: false,
//             folding: false,
//             lineNumbersMinChars: 3,
//             fontSize: 16,
//             scrollBeyondLastLine: false,
//             automaticLayout: true,
//           }}
//           theme="vs-dark"
//           language="javascript"
//           height="100%"
//         />
//       </div>
//     );
//   }
// };

// export default CodeEditor;
