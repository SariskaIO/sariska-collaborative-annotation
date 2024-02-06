import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { colors } from '../../../assets/styles/colors';
import InitiatePoll from '../Poll/InitiatePoll';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    background: colors.primaryLight
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6" style={{fontWeight: 900, color: colors.white}}>{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon style={{fontWeight: 900, color: colors.white}} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function Model({open, poll, setPoll, handleChange, handleClose, handleSubmit}) {
  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open} maxWidth={'sm'} fullWidth={true} >
        <DialogTitle id="customized-dialog-title" onClose={handleClose} >
          Create Poll
        </DialogTitle>
        <DialogContent dividers>
        <InitiatePoll
          poll={poll}
          setPoll={setPoll}
          handleChange={handleChange}
        />
        </DialogContent>
        <DialogActions style={{justifyContent: 'space-between', padding: '8px 16px 8px 24px'}}>
          <Typography style={{color: "red"}} >{poll.error}</Typography>
          <Button autoFocus onClick={handleSubmit} color="primary" variant='contained' style={{textTransform: 'initial'}}>
            Poll Now
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
