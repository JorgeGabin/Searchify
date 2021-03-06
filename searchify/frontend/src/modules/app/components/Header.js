import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import {ListItemLink} from '../../common';

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      backgroundColor: '#191414',
      color: 'white'
    },
    title: {
      marginLeft: '20px',
      color: theme.palette.primary.main
    },
    navItem: {
        '&:hover': {
            color: theme.palette.primary.main
        }
    }
  }));

const Header = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <AppBar
                position="fixed"
                className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h5" noWrap className={classes.title}>Searchify</Typography>
                    <List className={classes.navItem}>
                        <ListItemLink to="/" primary="Home" />
                    </List>
                    <List className={classes.navItem}>
                        <ListItemLink to="/songs" primary="Songs" />
                    </List>
                    <List className={classes.navItem}>
                        <ListItemLink to="/lyrics" primary="Lyrics" />
                    </List>
                    <List className={classes.navItem}>
                        <ListItemLink to="/playlists" primary="Playlists" />
                    </List>
                    <List className={classes.navItem}>
                        <ListItemLink to="/artists" primary="Artists" />
                    </List>
                </Toolbar>
            </AppBar>
        </div>

    );

};

export default Header;
