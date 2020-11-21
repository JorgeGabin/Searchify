import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

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
    item: {
        marginTop: '0.5rem'
    }
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
            <Grid container spacing={3} className={classes.gridStyle}>
                <Grid item lg={5} md={5} sm={12} xs={12}>
                    <Typography variant='h6' className={classes.item}>
                        Name: <Link href={song.song_url} target="_blank">
                                {song.song_name}
                        </Link>
                    </Typography>
                    <Typography variant='h6' className={classes.item}>
                        Artist: {song.song_artist}
                    </Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Typography variant='h6' className={classes.item}>
                        Duration:&nbsp;
                        {moment.duration({
                            'seconds': song.song_duration
                        }).minutes()}
                        min&nbsp;
                        {moment.duration({
                            'seconds': song.song_duration
                        }).seconds()}
                        s
                    </Typography>
                    <Typography variant='h6' className={classes.item}>
                        Album: {song.song_album_name}
                    </Typography>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12}>
                    <Typography variant='h6' className={classes.item}>
                        Release year: {song.song_album_year}
                    </Typography>
                    {
                        song.song_lyrics !== '' &&
                        <Button variant="outlined" color="primary" onClick={handleClickOpen} className={classes.item}>
                            Lyrics
                        </Button>
                    }
                </Grid>
            </Grid>
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