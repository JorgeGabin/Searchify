import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import backend from '../../../backend';
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Playlist from './Playlist';
import { Pager } from '../../common';

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
    },
    title: {
        marginBottom: 30
    },
    item: {
        marginLeft: theme.spacing(3),
        marginBottom: theme.spacing(3),
    },
    search: {
        display: 'block'
    },
}));

const PlaylistsSearch = () => {

    const classes = useStyles();
    const [name, setName] = useState('');
    const [songs, setSongs] = useState([]);
    const [artistAlbums, setArtistAlbums] = useState([]);
    const [from, setFrom] = useState(0);
    const [total, setTotal] = useState(0);

    const [playlists, setPlaylists] = useState([]);

    const handleSubmit = (newFrom) => {
        setFrom(newFrom);
        if ((!name || name === '')) {
            return;
        }
        backend.searchService.searchPlaylists(
            {
                playlist_name: name,
                playlist_songs: songs,
                playlist_artists_albums: artistAlbums,
            },
            newFrom,
            (response) => {
                setPlaylists(response.hits.docs);
                setTotal(response.hits.total);
            },
        );
    }

    return (
        <React.Fragment>
            <Paper className={classes.root} variant="outlined">
                <Typography className={classes.title} variant='h5'>
                    Playlists advanced search
                </Typography>
                <Divider />
                <div className={classes.search}>
                    <TextField
                        value={name}
                        type="text"
                        size="small"
                        id="queryString"
                        label="Playlist name"
                        variant="outlined"//filled
                        className={classes.item}
                        onChange={e => setName((e.target.value ? e.target.value : ''))} />
                    <TextField
                        value={songs}
                        type="text"
                        size="small"
                        id="queryString"
                        label="Songs in playlist"
                        variant="outlined"//filled
                        className={classes.item}
                        onChange={e => setSongs((e.target.value ? [e.target.value] : []))} />
                    <TextField
                        value={artistAlbums}
                        type="text"
                        size="small"
                        id="queryString"
                        label="Artists and albums"
                        variant="outlined"//filled
                        className={classes.item}
                        onChange={e => setArtistAlbums((e.target.value ? [e.target.value] : []))} />
                    <Button variant="contained" color='primary' onClick={() => handleSubmit(0)}
                        startIcon={<SearchIcon />}
                        className={classes.item}
                    >
                        <span>Search</span>
                    </Button>
                </div>
            </Paper>
            {
                playlists.length !== 0 &&
                <React.Fragment>
                    <Paper className={classes.root} variant="outlined">
                        <Typography className={classes.typography} variant='h5'>
                            Playlists
                        </Typography>
                        <Divider />
                        {
                            playlists.map((playlist) => (
                                <Playlist playlist={playlist} />
                            ))
                        }
                        
                        <Pager
                            back={{
                                enabled: from >= 1,
                                onClick: () => handleSubmit(from - 10)
                            }}
                            next={{
                                enabled: from + 10 < total,
                                onClick: () => handleSubmit(from + 10)
                            }}
                        />
                    </Paper>
                </React.Fragment>
            }
        </React.Fragment>
    );
}

export default PlaylistsSearch;