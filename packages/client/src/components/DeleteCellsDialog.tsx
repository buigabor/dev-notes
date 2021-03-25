import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { MapClient } from '@roomservice/browser';
import React from 'react';
import { useActions } from '../hooks/useActions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface DeleteCellsDialogProps {
  openDeleteCellsDialog: boolean;
  setOpenDeleteCellsDialog: React.Dispatch<React.SetStateAction<boolean>>;
  data?: {
    [key: string]: {
      id: string;
      type: string;
      content: string;
    };
  };
  orderMap?: MapClient<{
    order: string[];
  }>;
  dataMap?: MapClient<{
    [key: string]: {
      id: string;
      type: string;
      content: string;
    };
  }>;
  collaboration: boolean;
}

export const DeleteCellsDialog: React.FC<DeleteCellsDialogProps> = ({
  openDeleteCellsDialog,
  setOpenDeleteCellsDialog,
  data,
  orderMap,
  dataMap,
  collaboration,
}) => {
  const { loadCells } = useActions();
  return (
    <div>
      <Dialog
        open={openDeleteCellsDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => {
          setOpenDeleteCellsDialog(false);
        }}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {'Delete all cells from your current project?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            After deletion you can not revert the changes. If you are sure,
            please click on 'Delete Cells'.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // Delete both cellsorder and data of cells
              if (!collaboration) {
                loadCells([], {});
              } else {
                for (const key in data) {
                  dataMap?.delete(key);
                }
                orderMap?.set('order', []);
              }
              setOpenDeleteCellsDialog(false);
            }}
            color="secondary"
          >
            Delete Cells
          </Button>
          <Button
            onClick={() => {
              setOpenDeleteCellsDialog(false);
            }}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
