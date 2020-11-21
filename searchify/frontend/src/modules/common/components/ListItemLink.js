import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';

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

function ListItemLink(props) {
    const classes = useStyles();
    const theme = useTheme();
    const { icon, primary, to } = props;

    const renderLink = React.useMemo(
        () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
        [to],
    );

    return (
        <li>
            <ListItem button component={renderLink}>
                {/* {icon ? <ListItemIcon style={{ minWidth: 35 + "px" }}>{icon}</ListItemIcon> : null} */}
                <Typography variant="h6" noWrap className={classes.title}>{primary}</Typography>
            </ListItem>
        </li>
    );
}

ListItemLink.propTypes = {
    icon: PropTypes.element,
    primary: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

export default ListItemLink