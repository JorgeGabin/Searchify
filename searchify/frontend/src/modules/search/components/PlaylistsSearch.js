import React, {useState} from 'react';
import { duration, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import backend from '../../../backend';
import Song from './Song';
import { Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Playlist from './Playlist';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(2),
        width: '100%',
        margin: 30,
        flexDirection: 'column',
        width: '90vw'
    },
    title: {
        marginBottom: 30
    },
    button: {
        marginLeft: theme.spacing(3),
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

  const [playlists, setPlaylists] = useState([]);
  
  const handleSubmit = () => {
      if ((!name || name === '')) {
          return;
      }
      backend.searchService.searchPlaylists(
          { 
            playlist_name: name,
            playlist_songs: songs,
            playlist_artists_albums: artistAlbums,
          },
          (response) => {
            setPlaylists(response.hits.docs)
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
                      onChange={e => setName((e.target.value ? e.target.value : ''))} />
                <TextField
                    value={songs}
                    type="text"
                    size="small"
                    id="queryString"
                    label="Songs in playlist"
                    variant="outlined"//filled
                    onChange={e => setSongs((e.target.value ? [e.target.value] : []))} />
                <TextField
                    value={artistAlbums}
                    type="text"
                    size="small"
                    id="queryString"
                    label="Artists and albums"
                    variant="outlined"//filled
                    onChange={e => setArtistAlbums((e.target.value ? [e.target.value] : []))} />
                  <Button variant="contained" color='primary' onClick={() => handleSubmit()}
                    startIcon={<SearchIcon/>}
                    className={classes.button}
                  >
                    <span>Search</span>
                  </Button>
                </div>
            </Paper>
            {
                playlists.length !== 0 &&
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
                </Paper>
            }
        </React.Fragment>
  );
}

export default PlaylistsSearch;