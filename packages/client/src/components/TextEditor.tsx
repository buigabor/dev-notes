/** @jsxImportSource @emotion/react */
import MDEditor from '@uiw/react-md-editor';
import React, { useEffect, useRef, useState } from 'react';
import { useActions } from '../hooks/useActions';
import { Cell } from '../state';
import textEditorStyles from './styles/textEditorStyles';

interface TextEditorProps {
  cell: Cell;
}

export const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const { updateCell } = useActions();

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
          value={cell.content}
          onChange={(text) => {
            updateCell(cell.id, text || '');
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
        <MDEditor.Markdown source={cell.content || 'Click to edit'} />
      </div>
    </div>
  );
};
