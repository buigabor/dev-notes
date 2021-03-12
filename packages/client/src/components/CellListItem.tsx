/** @jsxImportSource @emotion/react */
import axios from 'axios';
import { AnimateSharedLayout, motion } from 'framer-motion';
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
    axios.get('http://localhost:4005').then((res) => {
      console.log(res);
    });
  }, []);

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
              <Sketch />
            </motion.div>
          </AnimateSharedLayout>
        </>,
      );
    }
  }, [cell, cell.type]);

  return <div css={cellListItemStyles}>{cellToRender}</div>;
};
