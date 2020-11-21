import React, {useState} from 'react';
import { duration, makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Slider from '@material-ui/core/Slider';
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

const SongsSearch = () => {

  const classes = useStyles();
  const [name, setName] = useState('');
  const [artists, setArtists] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [durations, setDurations] = useState([0, 1000]);
  const [years, setYears] = useState([1900, 2020]);

  const handleDurationsChange = (event, newValue) => {
    setDurations(newValue);
  };

  const handleYearsChange = (event, newValue) => {
    setYears(newValue);
  };

  const [songs, setSongs] = useState([]);
  
  const handleSubmit = () => {
      if ((!name || name === '')) {
          return;
      }
      backend.searchService.searchSongs(
          { 
            song_name: name,
            song_artists: artists,
            song_album_name: albumName,
            song_duration_max: durations[1],
            song_duration_min: durations[0],
            song_year_max: years[1],
            song_year_min: years[0]
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
                    Songs advanced search
                </Typography>
                <Divider />
                <div className={classes.search}>
                    <TextField
                        value={name}
                        type="text"
                        size="small"
                        id="queryString"
                        label="Song name"
                        variant="outlined"//filled
                        onChange={e => setName((e.target.value ? e.target.value : ''))} />

                    <TextField
                        value={artists}
                        type="text"
                        size="small"
                        id="queryString"
                        label="Artist name"
                        variant="outlined"//filled
                        onChange={e => setArtists((e.target.value ? e.target.value : ''))} />

                    <TextField
                        value={albumName}
                        type="text"
                        size="small"
                        id="queryString"
                        label="Album name"
                        variant="outlined"//filled
                        onChange={e => setAlbumName((e.target.value ? e.target.value : ''))} />

                    <Typography id="range-slider" gutterBottom>
                        Duration range
                    </Typography>
                    <Slider
                        min={0}
                        step={10}
                        max={1000}
                        value={durations}
                        onChange={handleDurationsChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />    
                    
                    <Typography id="range-slider" gutterBottom>
                        Release year range
                    </Typography>
                    <Slider
                        min={1900}
                        step={1}
                        max={2021}
                        value={years}
                        onChange={handleYearsChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                    />
                
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

export default SongsSearch;