// import backend from '../../backend';
import * as actionTypes from './actionTypes';

const findDocCompleted = doc => ({
    type: actionTypes.FIND_DOC_COMPLETED,
    doc
});

export const clearDoc = () => ({
    type: actionTypes.CLEAR_DOC
});


export const findDoc = (dataId, taxonPrefix, docId, onErrors) => dispatch => {
    // backend.indexService.findDoc(dataId, taxonPrefix, docId,
    //     doc => { console.log(doc);
    //         dispatch(findDocCompleted(doc))
    //     }, onErrors);
}

const clearFacetedSearch = () => ({
    type: actionTypes.CLEAR_FACETED_SEARCH
});

const doFacetedSearchCompleted = facetedSearch => ({
    type: actionTypes.DO_FACETED_SEARCH_COMPLETED,
    facetedSearch
});

export const previousDoFacetedSearchResultPage = (criteria) =>
    doFacetedSearch({ dataId: criteria.dataId, taxonPrefix: criteria.taxonPrefix, query: criteria.query, facets: criteria.facets, from: criteria.from - 10 >= 0 ? criteria.from - 10 : 0 });

export const nextDoFacetedSearchResultPage = (criteria) =>
    doFacetedSearch({ dataId: criteria.dataId, taxonPrefix: criteria.taxonPrefix, query: criteria.query, facets: criteria.facets, from: criteria.from + 10 });

export const doFacetedSearch = ({ dataId, taxonPrefix, query, facets, from }) => dispatch => {

    dispatch(clearFacetedSearch());
    // backend.indexService.doFacetedSearch(
    //     dataId,
    //     taxonPrefix,
    //     query,
    //     facets.map((f) => f.label),
    //     from,
    //     (result) => {
    //         dispatch(doFacetedSearchCompleted(
    //             {
    //                 criteria:{dataId, taxonPrefix, query, facets, from},
    //                 result
    //             }
    //         ));
    //     }
    // );
}