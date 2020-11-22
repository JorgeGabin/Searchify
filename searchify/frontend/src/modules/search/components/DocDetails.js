import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormattedMessage, FormattedDate, FormattedTime } from 'react-intl';
import { useParams, useHistory, useLocation, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import * as selectors from '../selectors';
import * as actions from '../actions';
import { BackLink, Errors } from '../../common';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'block',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    typographyTags: {
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
    },
    typographyScore: {
        ...theme.typography.caption,
        backgroundColor: theme.palette.background.paper,
    },
}));

const DocDetails = () => {
    const classes = useStyles();

    const [backendErrors, setBackendErrors] = useState(null);
    const doc = useSelector(selectors.getDoc);
    const dispatch = useDispatch();
    const { id } = useParams();
    const docId = Number(id);
    const { dataId, taxonPrefix } = ((search) => {
        return {
            dataId: Number(search.get("dataId")),
            taxonPrefix: search.get("taxonPrefix")
        }
    })(new URLSearchParams(useLocation().search));

    const clearErrors = () => {
        setBackendErrors(null)
    }

    const onErrors = errors => {
        setBackendErrors(errors)
    }

    useEffect(() => {

        if (!Number.isNaN(dataId) && !Number.isNaN(docId)) {
            clearErrors();
            dispatch(actions.findDoc(dataId, taxonPrefix, docId, onErrors));
        }

        return () => dispatch(actions.clearDoc());

    }, [dataId, taxonPrefix, docId, dispatch]);

    if (backendErrors) {
        return <Errors errors={backendErrors} onClose={() => setBackendErrors(null)} />;
    }

    if (!doc) {
        return null;
    }
    console.log(doc);
    return (

        <div>

            <BackLink />

            <Card key={doc.id} className={classes.content} variant="outlined">
                <Typography variant='h6'>
                    <FormattedMessage id='project.index.FacetedSearchResult.docNo'/>:&nbsp;{doc.id} {doc.title && ` - ${doc.title}`}
                </Typography>
                <Typography paragraph align='justify'>
                    {doc.body}
                </Typography>
                {doc.tags.length > 0 ? 
                    <Typography className={classes.typographyTags} color="primary">
                        <FormattedMessage id='project.index.FacetedSearchResult.tags'/>:&nbsp;
                        {doc.tags.join(", ")}
                    </Typography>
                    : 
                    <Typography className={classes.typographyTags} color="primary">
                        <FormattedMessage id='project.index.FacetedSearchResult.noTags'/> 
                    </Typography>
                }
            </Card>
        </div>
    );

}

export default DocDetails;
