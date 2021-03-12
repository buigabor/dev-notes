/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useRef, useState } from 'react';
import { BlockPicker, ColorResult } from 'react-color';
import { Tools } from 'react-sketch';

const sketchToolBoxStyles = css`
  position: absolute;
  top: 3rem;
  left: 10px;
  z-index: 5;
  display: flexbox;
  flex-direction: column;
  width: 5rem;
  border: 1px solid black;
  border-radius: 4px;
  .toolbox {
    &-row {
      display: flex;
      padding: 0 0.3rem;
      flex-basis: 100%;
      gap: 5px;
      &:not(:last-of-type) {
        border-bottom: 1px solid black;
      }
    }

    &-cell {
      cursor: pointer;
      padding: 0.4rem 0.2rem;
      flex-basis: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      &:first-of-type {
        border-right: 1px solid black;
      }
    }
    &-line {
      height: 2px;
      width: 16px;
      background-color: black;
    }
    &-rectangle {
      width: 13px;
      height: 9px;
      border: 2px solid black;
    }
    &-arrow-btn {
      background-color: transparent;
      border: none;
      font-size: 1em;
      cursor: pointer;
      outline: none;
    }
    &-blockcolor {
      position: absolute;
      top: 10.1rem;
      right: 0.2rem;
    }
    &-download-link {
      outline: none;
      color: black;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

interface SetToolBoxProps {
  canRedo: boolean;
  canUndo: boolean;
  color: string;
  setEraserClicked: React.Dispatch<React.SetStateAction<boolean>>;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setCanUndo: React.Dispatch<React.SetStateAction<boolean>>;
  setCanRedo: React.Dispatch<React.SetStateAction<boolean>>;
  sketchRef: React.MutableRefObject<any>;
  setTool: React.Dispatch<
    React.SetStateAction<{
      pencil: any;
      circle: any;
      rectangle: any;
      line: any;
    }>
  >;
}

export const SketchToolBox: React.FC<SetToolBoxProps> = ({
  setTool,
  setCanUndo,
  setCanRedo,
  setColor,
  setLineWidth,
  setEraserClicked,
  sketchRef,
  canRedo,
  canUndo,
  color,
}) => {
  const [showColor, setShowColor] = useState(false);
  const anchorRef = useRef<any>(null);

  const handleColorChange = (
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setColor(color.hex);
  };

  useEffect(() => {
    (function (console) {
      /*eslint-disable no-console*/
      // @ts-ignore
      console.save = function (data, filename) {
        if (!data) {
          console.error('Console.save: No data');
          return;
        }
        if (!filename) filename = 'console.json';
        if (typeof data === 'object') {
          data = JSON.stringify(data, undefined, 4);
        }
        var blob = new Blob([data], { type: 'text/json' }),
          e = document.createEvent('MouseEvents'),
          a = document.createElement('a');
        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
        e.initMouseEvent(
          'click',
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null,
        );
        a.dispatchEvent(e);
      };
    })(console);
  }, []);

  const download = () => {
    /*eslint-disable no-console*/
    // @ts-ignore
    console.save(sketchRef.current.toDataURL(), 'toDataURL.txt');
    /*eslint-disable no-console*/
    // @ts-ignore
    console.save(JSON.stringify(sketchRef.current.toJSON()), 'toDataJSON.txt');
    if (anchorRef) {
      let event = new Event('click', {});

      anchorRef.current.href = sketchRef.current.toDataURL();
      anchorRef.current.download = 'toPNG.png';
      anchorRef.current?.dispatchEvent(event);
    }
  };
  return (
    <div css={sketchToolBoxStyles}>
      <div className="toolbox-row">
        <div
          onClick={() => {
            setTool(Tools.Pencil);
            setLineWidth(3);
            setColor(color);
            setEraserClicked(false);
          }}
          className="toolbox-cell"
        >
          <i className="fas fa-pencil-alt" />
        </div>
        <div
          onClick={() => {
            setTool(Tools.Line);
            setLineWidth(3);
            setColor(color);
            setEraserClicked(false);
          }}
          className="toolbox-cell"
        >
          <div className="toolbox-line"></div>
        </div>
      </div>
      <div className="toolbox-row">
        <div
          onClick={() => {
            setTool(Tools.Circle);
            setLineWidth(3);
            setColor(color);
            setEraserClicked(false);
          }}
          className="toolbox-cell"
        >
          <i className="far fa-circle"></i>
        </div>
        <div
          onClick={() => {
            setTool(Tools.Rectangle);
            setLineWidth(3);
            setColor(color);
            setEraserClicked(false);
          }}
          className="toolbox-cell"
        >
          <span className="toolbox-rectangle"></span>
        </div>
      </div>
      <div className="toolbox-row">
        <div className="toolbox-cell">
          <button
            onClick={() => {
              sketchRef.current.undo();
              setCanUndo(sketchRef.current.canUndo());
              setCanRedo(sketchRef.current.canRedo());
            }}
            disabled={canUndo ? false : true}
            style={{ opacity: canUndo ? 1 : 0.4 }}
            className="toolbox-arrow-btn"
          >
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        <div className="toolbox-cell">
          <button
            onClick={() => {
              sketchRef.current.redo();
              setCanUndo(sketchRef.current.canUndo());
              setCanRedo(sketchRef.current.canRedo());
            }}
            disabled={canRedo ? false : true}
            style={{ opacity: canRedo ? 1 : 0.4 }}
            className="toolbox-arrow-btn"
          >
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
      <div className="toolbox-row">
        <div
          onClick={() => {
            sketchRef.current.clear();
            setCanUndo(sketchRef.current.canUndo());
            setCanRedo(sketchRef.current.canRedo());
          }}
          className="toolbox-cell"
        >
          <i className="fas fa-trash"></i>
        </div>
        <div
          className="toolbox-cell"
          onClick={() => {
            setTool(Tools.Pencil);
            setEraserClicked(true);
            setLineWidth(20);
          }}
        >
          <i className="fas fa-eraser"></i>
        </div>
      </div>
      <div className="toolbox-row">
        <div
          onClick={() => {
            setShowColor(!showColor);
          }}
          className="toolbox-cell"
        >
          <i className="fas fa-tint"></i>
        </div>
        <div
          style={{ display: showColor ? 'inline-block' : 'none' }}
          className="toolbox-blockcolor"
        >
          <BlockPicker
            color={color}
            width="110px"
            onChange={handleColorChange}
          />
        </div>
        <div className="toolbox-cell">
          <a
            className="toolbox-download-link"
            ref={anchorRef}
            onClick={download}
          >
            <i className="fas fa-cloud-download-alt"></i>
          </a>
        </div>
      </div>
    </div>
  );
};
