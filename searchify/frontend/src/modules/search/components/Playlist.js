import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';

import MusicNoteIcon from '@material-ui/icons/MusicNote';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5,
        padding: 10,
        width: '90%',
    },
    [theme.breakpoints.down('sm')]: {
      gridStyle: {
          textAlign: 'center'
      },
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
          <Grid container spacing={3} className={classes.gridStyle}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Typography variant='h6'>
                    Name: <Link href={playlist.playlist_url} target="_blank">
                        {playlist.playlist_name}
                    </Link>
                </Typography>
              </Grid>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <Typography variant='h6'>
                   Number of songs: {playlist.playlist_songs_number}
                </Typography>
              </Grid>
              <Grid item lg={2} md={2} sm={12} xs={12}>
              {
                playlist.playlist_songs &&
                <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                    Songs
                </Button>
              }
              </Grid>
          </Grid>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                Playlist songs
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {playlist.playlist_songs.map((song) => (
              <ListItem>
                <ListItemIcon>
                  <MusicNoteIcon />
                </ListItemIcon>
                <ListItemText>
                  {song}
                </ListItemText>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Card>
  );

}

export default Playlist;