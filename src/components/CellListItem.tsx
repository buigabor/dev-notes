/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Cell } from '../state';
import { ActionBar } from './ActionBar';
import CodeCell from './CodeCell';
import { Sketch } from './Sketch';
import cellListItemStyles from './styles/cellListItemStyles';
import { TextEditor } from './TextEditor';

interface CellListItemProps {
  cell: Cell;
}

export const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  const [cellToRender, setCellToRender] = useState<JSX.Element>();

  useEffect(() => {
    if (cell.type === 'code') {
      setCellToRender(
        <>
          <div className="action-bar-wrapper">
            <ActionBar id={cell.id} />
          </div>
          <CodeCell cell={cell} />
        </>,
      );
    } else if (cell.type === 'text') {
      setCellToRender(
        <>
          <ActionBar id={cell.id} />
          <TextEditor cell={cell} />
        </>,
      );
    } else if (cell.type === 'sketch') {
      setCellToRender(
        <>
          <ActionBar id={cell.id} />
          <Sketch />
        </>,
      );
    }
  }, [cell, cell.type]);

  return <div css={cellListItemStyles}>{cellToRender}</div>;
};
