/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { AddCell } from './AddCell';
import { CellListItem } from './CellListItem';

const cellListStyles = css`
  padding: 0 10px;

  .force-visible {
    opacity: 1;
  }
`;

export const CellList: React.FC = () => {
  const orderedCellList = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((cellId: string) => {
      return data[cellId];
    });
  });

  const renderedCells = orderedCellList.map((cell) => (
    <React.Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell nextCellId={cell.id} />
    </React.Fragment>
  ));
  return (
    <div css={cellListStyles}>
      <AddCell forceVisible={orderedCellList.length === 0} nextCellId={null} />
      {renderedCells}
    </div>
  );
};
