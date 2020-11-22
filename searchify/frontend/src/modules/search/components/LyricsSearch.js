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
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  
  const handleSubmit = (newFrom) => {
      setFrom(newFrom);
      if ((!lyrics || lyrics === '')) {
          return;
      }
      backend.searchService.searchLyrics(
          { 
            song_lyrics: lyrics
          },
          newFrom,
          (response) => {
              setSongs(response.hits.docs);
              setTotal(response.hits.total);
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
                  <Button variant="contained" color='primary' onClick={() => handleSubmit(0)}
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
                    <Pager 
                        back={{
                            enabled: from >= 1,
                            onClick: () => handleSubmit(from - 10)}}
                        next={{
                            enabled: from + 10 < total,
                            onClick: () => handleSubmit(from + 10)}}
                    />
                </Paper>
            }
        </React.Fragment>
  );
}

export default LyricsSearch;