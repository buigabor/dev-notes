/** @jsxImportSource @emotion/react */
import { useMap } from '@roomservice/react';
import MDEditor, { ICommand, TextApi, TextState } from '@uiw/react-md-editor';
import React from 'react';
import CodeEditor from './Celltypes/CodeEditor';
import { Resizable } from './Utils/Resizable';

const title3: ICommand = {
  name: 'title3',
  keyCommand: 'title3',
  buttonProps: { 'aria-label': 'Insert title3' },

  execute: (state: TextState, api: TextApi) => {
    let modifyText = `### ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `### `;
    }
    api.replaceSelection(modifyText);
  },
};

export const RoomService: React.FC = () => {
  const [content, map] = useMap<{
    textContent: string;
    codeContent: string;
  }>('myroom', 'newMapName');
  console.log(content);

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
            <CodeEditor
              cellId={'asd'}
              initialValue={content.codeContent}
              onChange={(value) => {
                // updateCell(cell.id, value);
                console.log(value);

                map.set('codeContent', value);
                // getMap()?.set('codeContent', value);
              }}
            />
          </Resizable>
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
