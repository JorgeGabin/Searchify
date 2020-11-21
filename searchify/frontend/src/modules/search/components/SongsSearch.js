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
import {Pager} from '../../common';

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
    slider: {
        marginLeft: theme.spacing(3),
        marginBottom: theme.spacing(3),
        marginRight: theme.spacing(3),
    },
    sliderLabel: {
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
  const [durations, setDurations] = useState([0, 1200]);
  const [years, setYears] = useState([1800, 2020]);

  const handleDurationsChange = (event, newValue) => {
    setDurations(newValue);
  };

  const handleYearsChange = (event, newValue) => {
    setYears(newValue);
  };

  const [songs, setSongs] = useState([]);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);

  const handleSubmit = (newFrom) => {
      setFrom(newFrom);
      backend.searchService.searchSongs(
          { 
            song_name: name,
            song_artist: artists,
            song_album_name: albumName,
            song_duration_max: durations[1],
            song_duration_min: durations[0],
            song_year_max: years[1],
            song_year_min: years[0]
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
                        className={classes.item}
                        onChange={e => setName((e.target.value ? e.target.value : ''))} />

                    <TextField
                        value={artists}
                        type="text"
                        size="small"
                        id="queryString"
                        label="Artist name"
                        variant="outlined"//filled
                        className={classes.item}
                        onChange={e => setArtists((e.target.value ? e.target.value : ''))} />

                    <TextField
                        value={albumName}
                        type="text"
                        size="small"
                        id="queryString"
                        label="Album name"
                        variant="outlined"//filled
                        className={classes.item}
                        onChange={e => setAlbumName((e.target.value ? e.target.value : ''))} />

                    <Typography id="range-slider" gutterBottom className={classes.sliderLabel}>
                        Duration range in seconds
                    </Typography>
                    <Slider
                        min={0}
                        step={10}
                        max={1200}
                        value={durations}
                        onChange={handleDurationsChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        className={classes.slider}
                    />    
                    
                    <Typography id="range-slider" gutterBottom className={classes.sliderLabel}>
                        Release year range
                    </Typography>
                    <Slider
                        min={1800}
                        step={10}
                        max={2020}
                        value={years}
                        onChange={handleYearsChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        className={classes.slider}
                    />
                
                    <Button variant="contained" color='primary' onClick={() => handleSubmit(0)}
                    startIcon={<SearchIcon/>}
                    className={classes.item}
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

export default SongsSearch;