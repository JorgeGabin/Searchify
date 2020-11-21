import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';

import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5,
        padding: 10,
    },
}));

const Artist = (props) => {
    const { artist } = props;
    const classes = useStyles();
    const preventDefault = (event) => event.preventDefault();

    return (
        <Card key={artist._id} variant="outlined" className={classes.root}>
            <Typography variant='h6'>
                Name: <Link href={artist.artist_url} onClick={preventDefault}>
                    {artist.artist_name}
                </Link>
            </Typography>
            <Typography variant='h6'>
                Followers: {artist.artist_followers}
            </Typography>
            <Typography variant='h6'>
                Listeners: {artist.artist_listeners}
            </Typography>
        </Card>
    );
}

export default Artist;