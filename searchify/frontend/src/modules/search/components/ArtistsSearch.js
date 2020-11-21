import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Switch from '@material-ui/core/Switch';
import backend from '../../../backend';
import Artist from './Artist';
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

const ArtistsSearch = () => {

    const classes = useStyles();
    const [query, setQuery] = useState('');

    const [artists, setArtists] = useState([]);
    const [checked, setChecked] = useState(false);
    const [from, setFrom] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        handleSubmit(null, 0)
    }, [checked]);

    const handleChange = (event) => {
        setChecked(event.target.checked)
    };
    
    const handleSubmit = (event, newFrom) => {
        setFrom(newFrom);

        if (event) {
            event.preventDefault();
        }
        let countryCode = null;
        
        if (checked) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                fetch(`http://api.geonames.org/countryCodeJSON?lat=${latitude}&lng=${longitude}&username=jorge`)
                    .then(res => {
                        res.json().then(body => {
                            countryCode = body.countryCode
                            if (countryCode) {
                            backend.searchService.searchArtists(
                                {
                                    artist_name: query,
                                    artist_location: countryCode
                                },
                                newFrom,
                                (response) => {
                                    setArtists(response);
                                    setTotal(response.hits.total);
                                },
                            )}
                        })
                    })
            });
        } else {
            if (!countryCode) {
                backend.searchService.searchArtists(
                    { artist_name: query },
                    newFrom,
                    (response) => {
                        setArtists(response);
                        setTotal(response.hits.total);
                    },
                );
            }
        }
    }

    return (
        <React.Fragment>
            <Paper className={classes.root} variant="outlined">
                <Typography className={classes.title} variant='h5'>
                    Artists advanced search
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
                    onKeyUp={e => handleSubmit(e, 0)} />

                <Typography gutterBottom>
                    Search by location?
                </Typography>
                <Switch
                    checked={checked}
                    onChange={handleChange}
                    color="primary"
                    name="location"
                />
            </Paper>
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
                    <Pager
                        back={{
                            enabled: from >= 1,
                            onClick: () => handleSubmit(null, from - 10)
                        }}
                        next={{
                            enabled: from + 10 < total,
                            onClick: () => handleSubmit(null, from + 10)
                        }}
                    />
                </Paper>
            }
        </React.Fragment>
    );

}

export default ArtistsSearch;
