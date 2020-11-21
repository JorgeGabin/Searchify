import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import Link from '@material-ui/core/Link';

import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import { Grid } from '@material-ui/core';

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

const Artist = (props) => {
    const { artist } = props;
    const classes = useStyles();

    return (
        <Card key={artist._id} variant="outlined" className={classes.root}>
            <Grid container spacing={2} className={classes.gridStyle}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Typography variant='h6'>
                        Name: <Link href={artist.artist_url} target="_blank">
                            {artist.artist_name}
                        </Link>
                    </Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Typography variant='h6'>
                        Followers:&nbsp;
                        <NumberFormat displayType={'text'} thousandSeparator=' ' value={artist.artist_followers} />
                    </Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <Typography variant='h6'>
                        Listeners:&nbsp;
                        <NumberFormat displayType={'text'} thousandSeparator=' ' value={artist.artist_listeners} />
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    );
}

export default Artist;