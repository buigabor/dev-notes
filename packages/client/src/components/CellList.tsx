/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTypedSelector } from '../hooks/useTypedSelector';
import { AddCell } from './AddCell';
import { CellListItem } from './CellListItem';
import cellListStyles from './styles/cellListStyles';

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
    <>
      <button
        onClick={() => {
          // axios
          //   .post('http://localhost:4005/cells', '', { withCredentials: true })
          //   .then((res) => {
          //     console.log(res);
          //   })
          //   .catch((error) => {
          //     console.log(error);
          //   });
          fetch('http://localhost:4005/cells', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Cache: 'no-cache',
            },
            credentials: 'include',
          });
        }}
      >
        Saves
      </button>
      <div css={cellListStyles}>
        <AddCell
          forceVisible={orderedCellList.length === 0}
          nextCellId={null}
        />
        {renderedCells}
      </div>
    </>
  );
};
