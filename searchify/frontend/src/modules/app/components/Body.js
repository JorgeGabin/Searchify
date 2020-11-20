import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Home from './Home';
import { DoFacetedSearch } from '../../search';
import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';

const useStyles = makeStyles((theme) => ({
    root: {
      height:'100%'
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
                    <Route><Home /></Route>
                </Switch>
            </Container>
            <Toolbar/>
        </React.Fragment>
    );

};

export default Body;
