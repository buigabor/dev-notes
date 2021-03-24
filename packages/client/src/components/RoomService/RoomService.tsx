/** @jsxImportSource @emotion/react */
import { useList, useMap, useRoom } from '@roomservice/react';
import { default as React } from 'react';
import { RouteComponentProps } from 'react-router';
import cellListStyles from '../styles/cellListStyles';
import { AddCellShared } from './AddCellShared';
import { CellListItemShared } from './CellListItemShared';

interface IReactRouterParams {
  id: string;
}

const randomId = () => {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substr(2, 7);
  };
  return S4() + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};

export const RoomService: React.FC<RouteComponentProps<IReactRouterParams>> = ({
  match,
}) => {
  const [data, dataMap] = useMap<{
    [key: string]: { id: string; type: string; content: string };
  }>(match.params?.id, 'mydata');
  const [cellsOrder, order] = useList(match.params?.id, 'cellsOrderMap');

  const insertAfterCell = (id: string | null, type: string) => {
    const cell = {
      id: randomId(),
      type,
      content: '',
    };
    dataMap?.set(cell.id, cell);

    const index = cellsOrder.findIndex((cellId) => cellId === id);

    if (index && index < 0) {
      order?.insertAt(0, cell.id);
    } else {
      if (index) {
        order?.insertAfter(index, cell.id);
      }
    }
    return;
  };

  const deleteCell = (id: string) => {
    console.log(id);

    const cellToDeleteIndex = cellsOrder.findIndex((cellId) => cellId === id);
    console.log(cellToDeleteIndex);

    order?.delete(cellToDeleteIndex);
    dataMap?.delete(id);
  };

  const orderedCellList = cellsOrder.map((cellId) => {
    return data[cellId];
  });

  const renderedCells = orderedCellList.map((cell) => {
    if (!cell) {
      return 'emppty';
    }
    return (
      <React.Fragment key={cell.id}>
        <CellListItemShared
          deleteCell={deleteCell}
          data={data}
          dataMap={dataMap}
          cell={cell}
        />
        <AddCellShared insertAfterCell={insertAfterCell} nextCellId={cell.id} />
      </React.Fragment>
    );
  });

  const room = useRoom(match.params?.id);
  console.log(cellsOrder);
  console.log(data);

  // **** CODECELL ****

  // **** SKETCH STATES ****
  // const sketchRef = useRef<any>();
  // const [canUndo, setCanUndo] = useState(false);
  // const [canRedo, setCanRedo] = useState(false);
  // const [tool, setTool] = useState(Tools.Pencil);
  // const [color, setColor] = useState('black');
  // const [eraserClicked, setEraserClicked] = useState(false);
  // const [lineWidth, setLineWidth] = useState(3);
  // const [sketchContent, setSketchContent] = useState('');

  // Get the accumulated code content of the previous code cells

  if (!dataMap || !order || !order.toArray() || !cellsOrder) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div css={cellListStyles}>
        <AddCellShared
          insertAfterCell={insertAfterCell}
          forceVisible={orderedCellList.length === 0}
          nextCellId={null}
        />
        {renderedCells}
        {/* <div>
          <SketchToolBox
            setEraserClicked={setEraserClicked}
            setLineWidth={setLineWidth}
            setColor={setColor}
            canRedo={canRedo}
            canUndo={canUndo}
            setCanRedo={setCanRedo}
            setCanUndo={setCanUndo}
            sketchRef={sketchRef}
            setTool={setTool}
            color={color}
          />
          <Resizable direction="vertical-sketch">
            <div
              style={{
                height: 'calc(100% - 10px)',
              }}
            >
              <SketchField
                lineColor={eraserClicked ? 'white' : color}
                onChange={() => {
                  setCanUndo(sketchRef.current.canUndo());
                  setCanRedo(sketchRef.current.canRedo());
                  map.set(
                    'sketchContent',
                    JSON.stringify(sketchRef.current.toJSON()),
                  );
                }}
                value={sketchContent}
                backgroundColor={'white'}
                ref={sketchRef}
                css={sketchStyles}
                style={{ border: '1px solid gray' }}
                width="100%"
                height="100%"
                tool={tool}
                lineWidth={lineWidth}
                undoSteps={15}
              />
            </div>
          </Resizable>
        </div> */}
        <button
          onClick={() => {
            order?.delete(0);
          }}
        >
          clear
        </button>
      </div>
    </>
  );
};
