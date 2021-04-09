/** @jsxImportSource @emotion/react */
import { MapClient } from '@roomservice/browser';
import { AnimateSharedLayout, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import cellListItemStyles from '../styles/cellListItemStyles';
import { ActionBarShared } from './ActionBarShared';
import { CodeCellShared } from './CodeCellShared';
import { TextEditorShared } from './TextEditorShared';

interface CellListItemSharedProps {
  cell: { id: string; type: string; content: string };
  dataMap: MapClient<any> | undefined;
  data: {
    [key: string]: {
      id: string;
      type: string;
      content: string;
    };
  };
  deleteCell: (id: string) => void;
  moveCell: (id: string, direction: 'up' | 'down') => void;
}

export const CellListItemShared: React.FC<CellListItemSharedProps> = ({
  cell,
  dataMap,
  data,
  deleteCell,
  moveCell,
}) => {
  const [cellToRender, setCellToRender] = useState<JSX.Element>();

  useEffect(() => {
    if (cell.type === 'code') {
      setCellToRender(
        <>
          <AnimateSharedLayout>
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 0.6 }}
            >
              <div className="action-bar-wrapper">
                <ActionBarShared
                  moveCell={moveCell}
                  deleteCell={deleteCell}
                  id={cell.id}
                />
              </div>

              <CodeCellShared data={data} dataMap={dataMap} cell={cell} />
            </motion.div>
          </AnimateSharedLayout>
        </>,
      );
    } else if (cell.type === 'text') {
      setCellToRender(
        <>
          <AnimateSharedLayout>
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 0.6 }}
            >
              <ActionBarShared
                moveCell={moveCell}
                deleteCell={deleteCell}
                id={cell.id}
              />
              <TextEditorShared data={data} dataMap={dataMap} cell={cell} />
            </motion.div>
          </AnimateSharedLayout>
        </>,
      );
    }
  }, [cell, cell.type, data, dataMap, deleteCell, moveCell]);

  return <div css={cellListItemStyles}>{cellToRender}</div>;
};
