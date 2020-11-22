const getModuleState = state => state.index;

export const getFacetedSearch = state =>
    getModuleState(state).facetedSearch;

export const getDoc = state =>
    getModuleState(state).doc;