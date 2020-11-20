import { config, appFetch } from './appFetch';

export const doFacetedSearch = (params, onSuccess,
    onErrors) => {
    appFetch(`/simple-search`,
        config('POST', params), onSuccess, onErrors);
}

export const addEntitiesToDirectory = (dataId, entities, sentences, onSuccess,
    onErrors) => {
    let formData = new FormData();
    formData.append('entities', entities.file);
    formData.append('sentences', sentences.file);
    appFetch(`/directory/entities?dataId=${dataId}`,
        config('POST', formData), onSuccess, onErrors);
}
