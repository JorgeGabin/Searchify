import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import { SimpleSearch } from '../../search';

const useStyles = makeStyles((theme) => ({
    root: {
        justifyContent: 'left',
        flexWrap: 'wrap',
        listStyle: 'none',
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(4),
        paddingLeft: theme.spacing(5),
        paddingRight: theme.spacing(5),
        width: '100%',
        marginTop: theme.spacing(10),
        backgroundColor: 'rgb(255,255,255,0.97)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    typography: {
        backgroundColor: theme.palette.background.paper,
        paddingBottom: theme.spacing(5),
        backgroundColor: 'transparent',
    },
    media: {
        height: 0,
        paddingTop: '20.25%', // 16:9
        backgroundSize:'100%'
      },

}));

const Home = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <SimpleSearch initialQuery=''/>
        </React.Fragment>
    )
};

export default Home;
