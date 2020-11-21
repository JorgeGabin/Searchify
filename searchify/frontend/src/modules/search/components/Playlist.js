import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 5,
    padding: 10,
  },
}));

const Playlist = (props) => {
  const { playlist } = props;
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Card key={playlist._id} variant="outlined" className={classes.root}>
      <Typography variant='h6'>
          Name: {playlist.playlist_name}
      </Typography>
      <Typography variant='h6'>
          Number of songs: {playlist.playlist_songs_number}
      </Typography>
      {
        playlist.playlist_songs &&
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Songs
        </Button>
      }
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Playlist songs
        </DialogTitle>
        <DialogContent dividers>
          <p style={{
          'white-space': 'pre-wrap'
          }}>
            {playlist.playlist_songs}
          </p>
        </DialogContent>
      </Dialog>
    </Card>
  );

}

export default Playlist;