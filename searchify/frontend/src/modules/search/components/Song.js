import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 5,
    padding: 10,
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
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
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
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

const Song = (props) => {
  const { song } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  return (
    <Card key={song._id} variant="outlined" className={classes.root}>
      <Typography variant='h6'>
          Name: {song.song_name}
      </Typography>
      <Typography variant='h6'>
          Artist: {song.song_artists[0]}
      </Typography>
      <Typography variant='h6'>
          Duration: {song.song_duration}
      </Typography>
      <Typography variant='h6'>
          Album: {song.song_album.album_name}
      </Typography>
      <Typography variant='h6'>
          Release year: {song.song_album.album_release_year}
      </Typography>
      {
        song.song_lyrics !== '' &&
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Open dialog
        </Button>
      }
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Song lyrics
        </DialogTitle>
        <DialogContent dividers>
          <p style={{
          'white-space': 'pre-wrap'
          }}>
            {song.song_lyrics}
          </p>
        </DialogContent>
      </Dialog>          
    </Card>
  );
}

export default Song;