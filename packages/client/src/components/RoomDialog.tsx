import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import React from 'react';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    goToRoomBtn: {
      color: '#06c8bf',
    },
  }),
);

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
  const classes = useStyles();
  const history = useHistory();

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

          <Button
            onClick={() => {
              history.push(`/room/${roomId}`);
              setOpenRoomDialog(false);
            }}
            className={classes.goToRoomBtn}
          >
            Go To Room
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomDialog;
