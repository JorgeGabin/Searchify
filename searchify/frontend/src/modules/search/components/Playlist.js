import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5,
        padding: 10,
    },
}));

const Playlist = (props) => {
    const { playlist } = props;
    const classes = useStyles();
    const preventDefault = (event) => event.preventDefault();

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
                Name: <Link href={playlist.playlist_url} onClick={preventDefault}>
                    {playlist.playlist_name}
                </Link>
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