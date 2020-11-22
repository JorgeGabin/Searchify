import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Home from './Home';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';
import SongsSearch from '../../search/components/SongsSearch';
import LyricsSearch from '../../search/components/LyricsSearch';
import PlaylistsSearch from '../../search/components/PlaylistsSearch';
import ArtistsSearch from '../../search/components/ArtistsSearch';

const useStyles = makeStyles((theme) => ({
    root: {
      height:'100%',
      minHeight: '87vh',
    },
  }));

const Body = () => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Toolbar/>
            <Container className={classes.root}>
                <br />
                <Switch>
                    <Route exact path="/"><Home /></Route>
                    <Route exact path="/songs"><SongsSearch /></Route>
                    <Route exact path="/lyrics"><LyricsSearch /></Route>
                    <Route exact path="/playlists"><PlaylistsSearch /></Route>
                    <Route exact path="/artists"><ArtistsSearch /></Route>
                    <Route><Home /></Route>
                </Switch>
            </Container>
        </React.Fragment>
    );

};

export default Body;
