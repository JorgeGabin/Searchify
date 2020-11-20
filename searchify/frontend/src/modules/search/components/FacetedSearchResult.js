import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {FormattedMessage} from 'react-intl';
import {Pager} from '../../common';
import DoFacetedSearch from './DoFacetedSearch';
import FacetedSearchResultList from './FacetedSearchResultList';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';

import List from '@material-ui/core/List';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import * as actions from '../actions';
import * as selectors from '../selectors';

const drawerWidth = 240;

const useStyles =  makeStyles((theme) => ({
    root: {
        minWidth: 275,
    },
    drawer: {
        textAlign: 'center',
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        zIndex: 'auto'
    },
    drawerContainer: {
        overflow: 'auto',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    typography: {
        ...theme.typography.button,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
    info: {
        backgroundColor: theme.palette.primary.light,
        padding: theme.spacing(1),
        paddingLeft: theme.spacing(2.7),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    icon:{
        marginRight: theme.spacing(1),
    },
    caption: {
        ...theme.typography.button,
    },
}));

const FindConstructionCallsResult = () => {

    const facetedSearch = useSelector(selectors.getFacetedSearch);
    const [facets, setFacets] = useState([]);
    const dispatch = useDispatch();
    const classes = useStyles();

    const addToFacets = (label) => {
        if (facets.some(facet => label === facet.label)) {
            return;
        }
        const newFacets = facets.concat({ key: uuidv4(), label })
        setFacets(newFacets);
    };

    useEffect(() => {
        if(facetedSearch)
            setFacets(facetedSearch.criteria.facets);
    }, [facetedSearch]);

    if (!facetedSearch) {
        return null;
    }

    if (facetedSearch.result.hits.total === 0) {
        return (
            <div className="alert alert-danger" role="alert">
                <FormattedMessage id='project.index.FacetedSearchResult.noSearchResults'/>
            </div>
        );
    }
    return (
        <div>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar />
                <div className={classes.drawerContainer}>
                    <Typography className={classes.typography} color="primary">
                        <FormattedMessage id='project.index.FacetedSearchResult.tagsInThisList'/>
                    </Typography>
                    <List dense>
                        {facetedSearch.result.aggregations.map((aggr) => (
                            <ListItem key={aggr.key}>
                                    {!facets.some(item => aggr.key === item.label) &&
                                        <IconButton className={classes.icon} size="small" onClick={() => addToFacets(aggr.key)}>
                                            <AddIcon fontSize="small" color="primary"/>
                                        </IconButton>
                                    }
                                <ListItemText primary={aggr.key} />
                                <ListItemText align='right' primary={aggr.count} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <DoFacetedSearch dataId={facetedSearch.criteria.dataId} taxonPrefix={facetedSearch.criteria.taxonPrefix} facets={facets} setFacets={setFacets} initialQuery={facetedSearch.criteria.query}/>
            <Card className={classes.info}> 
                <Typography className={classes.caption}>
                    <FormattedMessage id='project.index.FacetedSearchResult.totalHits'/>:&nbsp;{facetedSearch.result.hits.total}&nbsp;-&nbsp;<FormattedMessage id='project.index.FacetedSearchResult.maxScore'/>:&nbsp;{facetedSearch.result.hits.maxScore}
                </Typography>
            </Card>
            
            <FacetedSearchResultList facetedSearchResultList={facetedSearch.result.hits.docs} dataId={facetedSearch.criteria.dataId} taxonPrefix={facetedSearch.criteria.taxonPrefix}/>
            
            <Pager 
                back={{
                    enabled: facetedSearch.criteria.from >= 1,
                    onClick: () => dispatch(actions.previousDoFacetedSearchResultPage(facetedSearch.criteria))}}
                next={{
                    enabled: facetedSearch.criteria.from + 10 < facetedSearch.result.hits.total,
                    onClick: () => dispatch(actions.nextDoFacetedSearchResultPage(facetedSearch.criteria))}}
            />
        </div>

    );

}

export default FindConstructionCallsResult;