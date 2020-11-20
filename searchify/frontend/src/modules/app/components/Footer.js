import React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'white',
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
const Footer = () => {
    const classes = useStyles();

    return (
        <Box className={classes.root} variant="outlined">
            <Typography variant='button'>
                <FormattedMessage id="project.app.Footer.text"/>
            </Typography>
            <Divider />
        </Box>
    )
};

export default Footer;
