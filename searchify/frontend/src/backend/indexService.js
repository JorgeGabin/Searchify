import { config, appFetch } from './appFetch';

export const doFacetedSearch = (dataId, taxonPrefix, query, facets, from, onSuccess) => {
    appFetch(`/index/search?dataId=${dataId}&taxonPrefix=${taxonPrefix}`,
        config('POST',{query, facets, from}), onSuccess);
}

export const findDoc = (dataId, taxonPrefix, docId, onSuccess) => {
    appFetch(`/index/doc/${docId}?dataId=${dataId}&taxonPrefix=${taxonPrefix}`,
        config('GET'), onSuccess);
}
