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

const LyricsSearch = () => {

  const classes = useStyles();
  const [lyrics, setLyrics] = useState('');

  const [songs, setSongs] = useState([]);
  
  const handleSubmit = () => {
      if ((!lyrics || lyrics === '')) {
          return;
      }
      backend.searchService.searchLyrics(
          { 
            song_lyrics: lyrics
          },
          (response) => {
              setSongs(response.hits.docs)
          },
      );
  }

  return (
    <React.Fragment>
            <Paper className={classes.root} variant="outlined">
                <Typography className={classes.title} variant='h5'>
                    Search songs by lyrics
                </Typography>
                <Divider />
                <div className={classes.search}>
                  <TextField
                      value={lyrics}
                      type="text"
                      size="small"
                      id="queryString"
                      label="Search"
                      variant="outlined"//filled
                      onChange={e => setLyrics((e.target.value ? e.target.value : ''))} />
                  <Button variant="contained" color='primary' onClick={() => handleSubmit()}
                    startIcon={<SearchIcon/>}
                    className={classes.button}
                  >
                    <span>Search</span>
                  </Button>
                </div>
            </Paper>
            {
                songs.length !== 0 &&
                <Paper className={classes.root} variant="outlined">
                    <Typography className={classes.typography} variant='h5'>
                        Songs
                    </Typography>
                    <Divider />
                    {
                        songs.map((song) => (
                            <Song song={song} />
                        ))
                    }
                </Paper>
            }
        </React.Fragment>
  );
}

export default LyricsSearch;