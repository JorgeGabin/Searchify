import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

const useStyles =  makeStyles((theme) => ({

pager: {
    backgroundColor: "white",
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    textAlign: 'center'
},
}));

const Pager = ({back, next}) => {
    const classes = useStyles();

    return  (
        <Card className={classes.pager}> 
            <Button disabled={!back.enabled} onClick={back.onClick} variant="contained" color="primary">
                <FormattedMessage id='project.global.buttons.back'/>
            </Button>
            <Button style={{marginLeft:10 + 'px'}} disabled={!next.enabled} onClick={next.onClick} variant="contained" color="primary">
                <FormattedMessage id='project.global.buttons.next'/>
            </Button>
        </Card>
    )
};

Pager.propTypes = {
    back: PropTypes.object.isRequired,
    next: PropTypes.object.isRequired
};

export default Pager;