/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef, useState } from 'react';
import { SketchField, Tools } from 'react-sketch';
import { Resizable } from '../Utils/Resizable';
import { SketchToolBox } from './SketchToolBox';
import sketchStyles from './styles/sketchStyles';

export const Sketch: React.FC = () => {
  const sketchRef = useRef<any>();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [tool, setTool] = useState(Tools.Pencil);
  const [color, setColor] = useState('black');
  const [eraserClicked, setEraserClicked] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {}, []);

  return (
    <>
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
            }}
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
    </>
  );
};
