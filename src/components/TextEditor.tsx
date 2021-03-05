/** @jsxImportSource @emotion/react */
import MDEditor from '@uiw/react-md-editor';
import React, { useEffect, useRef, useState } from 'react';
import textEditorStyles from './styles/textEditorStyles';

export const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('# Header');
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        editorRef.current &&
        event.target &&
        editorRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });
    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (editing) {
    return (
      <div css={textEditorStyles} ref={editorRef}>
        <MDEditor
          value={value}
          onChange={(text) => {
            setValue(text || '');
          }}
        />
      </div>
    );
  }
  return (
    <div
      css={textEditorStyles}
      onClick={() => {
        setEditing(true);
      }}
    >
      <div className="card">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};
