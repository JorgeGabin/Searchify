import {combineReducers} from 'redux';

import * as actionTypes from './actionTypes';

const initialState = {
    facetedSearch: null,
    doc: null,
};

const facetedSearch = (state = initialState.facetedSearch, action) => {

    switch (action.type) {

        case actionTypes.DO_FACETED_SEARCH_COMPLETED:
            return action.facetedSearch;

        case actionTypes.CLEAR_FACETED_SEARCH:
            return initialState.facetedSearch;

        default:
            return state;
    }

}

const doc = (state = initialState.doc, action) => {

    switch (action.type) {

        case actionTypes.FIND_DOC_COMPLETED:
            return action.doc;

        case actionTypes.CLEAR_DOC:
            return initialState.doc;

        default:
            return state;

    }

}

const reducer = combineReducers({
    facetedSearch: facetedSearch,
    doc: doc,
});

export default reducer;