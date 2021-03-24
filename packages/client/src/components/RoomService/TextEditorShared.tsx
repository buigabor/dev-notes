/** @jsxImportSource @emotion/react */
import { MapClient } from '@roomservice/browser';
import MDEditor from '@uiw/react-md-editor';
import React, { useEffect, useRef, useState } from 'react';
import textEditorStyles from '../Celltypes/styles/textEditorStyles';

interface TextEditorSharedProps {
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

export const TextEditorShared: React.FC<TextEditorSharedProps> = ({
  cell,
  dataMap,
  data,
}) => {
  const [editing, setEditing] = useState(false);
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
          onChange={(text) => {
            dataMap?.set(cell.id, {
              id: cell.id,
              type: cell.type,
              content: text,
            });
          }}
          value={data[cell.id].content}
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
        <MDEditor.Markdown source={data[cell.id].content || 'Click to edit'} />
      </div>
    </div>
  );
};
