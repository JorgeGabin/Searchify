import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import SearchIcon from '@material-ui/icons/Search';
import * as actions from '../actions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import backend from '../../../backend';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(2),
        width: '100%',
        margin: 0,
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
    // const dispatch = useDispatch();
    const history = useHistory();
    const [query, setQuery] = useState(initialQuery || '');
    
    const handleSubmit = () => {
        if ((!query || query === '') /*&& facets.length === 0*/) {
            return;
        }
        backend.searchService.doFacetedSearch({ query });
    }

    // const handleDelete = (chipToDelete) => () => {
    //     setFacets((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    // };

    const checkDisabled = () => {
        return /*(!facets || facets.length === 0) &&*/ (!query || query.length < 1);
    }

    return (
        <React.Fragment>
            <Paper className={classes.root} variant="outlined">
                <Typography className={classes.typography} variant='h5'>
                    Search anything you want!
                </Typography>
                <Divider />
            </Paper>
            <Paper className={classes.root} variant="outlined">

                {/* {[].map(facet =>
                    <li key={facet.key}>
                        <Chip
                            label={facet.label}
                            onDelete={handleDelete(facet)}
                            className={classes.chip}
                        />
                    </li>
                )} */}
                <TextField
                    value={query}
                    type="text"
                    size="small"
                    id="queryString"
                    label="Search"
                    variant="outlined"//filled
                    onChange={e => setQuery((e.target.value ? e.target.value : ''))} />
                <Button variant="contained" color='primary' disabled={checkDisabled()} onClick={() => handleSubmit()}
                    startIcon={<SearchIcon/>}
                    className={classes.button}
                >
                    <span>Search</span>
                </Button>
            </Paper>
        </React.Fragment>
    );

}

export default SimpleSearch;
