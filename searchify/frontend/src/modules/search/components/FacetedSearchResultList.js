import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

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

const FacetedSearchResultList = ({ dataId, taxonPrefix }) => {
    const classes = useStyles();

    const facetedSearchResultList = [
        {
            "id": 1,
            "score": 100,
            "body": "test",
            "tags": []
        }
    ]

    return (
        <div className={classes.root}>
            <CssBaseline />
            {facetedSearchResultList.map((doc) => (
                <Card key={doc.id} className={classes.content} variant="outlined">
                    <Typography variant='h6'>
                        ID :&nbsp;{doc.id} {doc.title && ` - ${doc.title}`}
                    </Typography>
                    <Typography paragraph className={classes.typographyScore} color="primary">
                        Score:&nbsp;{doc.score}
                    </Typography>
                    <Typography paragraph>
                        {doc.body}&nbsp;
                        {/* <Link to={`/index/doc/${doc.id}?dataId=${dataId}&taxonPrefix=${taxonPrefix}`}>
                            More
                        </Link> */}
                    </Typography>
                    {doc.tags.length > 0 ? 
                        <Typography className={classes.typographyTags} color="primary">
                            Tags :&nbsp;
                            {doc.tags.join(", ")}
                        </Typography>
                        : 
                        <Typography className={classes.typographyTags} color="primary">
                            No tags 
                        </Typography>
                    }
                </Card>

            ))}

        </div>
    );
};

FacetedSearchResultList.propTypes = {
    facetedSearchResultList: PropTypes.array.isRequired,
};

export default FacetedSearchResultList;