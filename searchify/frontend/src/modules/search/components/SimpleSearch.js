import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import backend from '../../../backend';
import Song from './Song';
import Playlist from './Playlist';
import Artist from './Artist';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(2),
        margin: 30,
        flexDirection: 'column',
        width: '90vw'
    },
    title: {
        marginBottom: 30
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    button: {
        marginLeft: theme.spacing(1.5),
    },
}));

const SimpleSearch = ({initialQuery}) => {

    const classes = useStyles();
    const [query, setQuery] = useState(initialQuery || '');

    const [songs, setSongs] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        handleSubmit()
    }, []);
    
    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }

        backend.searchService.simpleSearch(
            { keywords: query },
            (response) => {
                setSongs(response.songs)
                setPlaylists(response.playlists)
                setArtists(response.artists)
            },
        );
    }

    return (
        <React.Fragment>
            <Paper className={classes.root} variant="outlined">
                <Typography className={classes.title} variant='h5'>
                    Search anything you want!
                </Typography>
                <Divider />
                <TextField
                    value={query}
                    type="text"
                    size="small"
                    id="queryString"
                    label="Search"
                    variant="outlined"//filled
                    onChange={e => setQuery((e.target.value ? e.target.value : ''))}
                    onKeyUp={e => handleSubmit(e)} />
            </Paper>
            {
                songs.length !== 0 &&
                <Paper className={classes.root} variant="outlined">
                    <Typography className={classes.typography} variant='h5'>
                        Songs
                    </Typography>
                    <Divider />
                    {
                        songs.hits.docs.map((song) => (
                            <Song song={song} />
                        ))
                    }
                </Paper>
            }
            {
                playlists.length !== 0 &&
                <Paper className={classes.root} variant="outlined">
                    <Typography className={classes.typography} variant='h5'>
                        Playlists
                    </Typography>
                    <Divider />
                    {
                        playlists.hits.docs.map((playlist) => (
                            <Playlist playlist={playlist} /> 
                        ))
                    }
                </Paper>
            }
            {
                artists.length !== 0 &&
                <Paper className={classes.root} variant="outlined">
                    <Typography className={classes.typography} variant='h5'>
                        Artists
                    </Typography>
                    <Divider />
                    {
                        artists.hits.docs.map((artist) => (
                            <Artist artist={artist} />
                        ))
                    }
                </Paper>
            }
        </React.Fragment>
    );

}

export default SimpleSearch;
