/** @jsxImportSource @emotion/react */
import { AnimateSharedLayout, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { Cell } from '../state';
import CodeCell from './Celltypes/CodeCell';
import { Sketch } from './Celltypes/Sketch';
import { TextEditor } from './Celltypes/TextEditor';
import cellListItemStyles from './styles/cellListItemStyles';
import { ActionBar } from './Utils/ActionBar';

interface CellListItemProps {
  cell: Cell;
}

export const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
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
                <ActionBar id={cell.id} />
              </div>
              <CodeCell cell={cell} />
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
              <ActionBar id={cell.id} />
              <TextEditor cell={cell} />
            </motion.div>
          </AnimateSharedLayout>
        </>,
      );
    } else if (cell.type === 'sketch') {
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
                <ActionBar id={cell.id} />
              </div>
              <Sketch cell={cell} />
            </motion.div>
          </AnimateSharedLayout>
        </>,
      );
    }
  }, [cell, cell.type]);

  return <div css={cellListItemStyles}>{cellToRender}</div>;
};
