import React from 'react';
import {useHistory} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {useTheme} from '@material-ui/core';

const BackLink = ({times}) => {

    const history = useHistory();

    if (history.length <= 2) {
        return null;
    } 
    console.log(times);
    return (
        <IconButton onClick={times ? () => history.go(times) : () => history.goBack()}>
            <ChevronLeftIcon fontSize="large" color={"secondary"}/>
        </IconButton>

    );

};
{/* <FormattedMessage id='project.global.buttons.back'/> */}

export default BackLink;
