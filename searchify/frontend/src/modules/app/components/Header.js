import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SvgIcon from '@material-ui/core/SvgIcon';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import IconButton from '@material-ui/core/IconButton';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {ListItemLink} from '../../common';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      backgroundColor: theme.palette.primary.main,
    },

    title: {
      flexGrow: 1,
      marginLeft: '20px',
    },
  }));

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

const Header = () => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <div className={classes.root}>
            <CssBaseline />

            <AppBar
                position="fixed"
                className={classes.appBar}>
                <Toolbar>
                    <Link component={RouterLink} to="/">
                        <HomeIcon style={{ color: 'white' }} fontSize="large" />
                    </Link>
                    <Typography variant="h5" noWrap className={classes.title}>Searchify</Typography>
                    <List>
                        <ListItemLink to="/songs" primary="Songs" icon={<PersonIcon  style={{ color: 'white' }} />} />
                    </List>
                    <List>
                        <ListItemLink to="/playlists" primary="Playlists" icon={<PersonIcon  style={{ color: 'white' }} />} />
                    </List>
                    <List>
                        <ListItemLink to="/lyrics" primary="Lyrics" icon={<PersonIcon  style={{ color: 'white' }} />} />
                    </List>
                    <List>
                        <ListItemLink to="/artists" primary="Artists" icon={<PersonIcon  style={{ color: 'white' }} />} />
                    </List>
                </Toolbar>
            </AppBar>
        </div>

    );

};

export default Header;
