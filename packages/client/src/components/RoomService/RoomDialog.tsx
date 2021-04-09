import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React from 'react';

interface RoomDialogProps {
  roomId: string;
  roomUrl: string;
  openRoomDialog: boolean;
  setOpenRoomDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const RoomDialog: React.FC<RoomDialogProps> = ({
  roomId,
  roomUrl,
  openRoomDialog,
  setOpenRoomDialog,
}) => {

  return (
    <div>
      <Dialog
        open={openRoomDialog}
        onClose={() => {
          setOpenRoomDialog(false);
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Invite a friend</DialogTitle>
        <DialogContent>
          <DialogContentText>
            A Room has been created for you. Please copy and paste this link to
            enter the room:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Link"
            fullWidth
            value={roomUrl}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(roomUrl);
            }}
            color="primary"
          >
            Copy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomDialog;
