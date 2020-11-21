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


  return (
    <Card key={playlist._id} variant="outlined" className={classes.root}>
      <Typography variant='h6'>
          Name: {playlist.playlist_name}
      </Typography>           
    </Card>
  );
}

export default Playlist;