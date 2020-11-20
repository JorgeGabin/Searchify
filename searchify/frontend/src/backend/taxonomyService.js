import { config, appFetch } from './appFetch';

export const createTaxonomy = (dataId, skipCorpusProcess, skipExtractFeatures, constructionCall, seed, onSuccess, 
    onErrors) => {
    appFetch(`/taxonomy?dataId=${dataId}`,
        config('POST',
        {skipCorpusProcess, skipExtractFeatures, constructionCall, seed}),
        onSuccess, onErrors);
}

export const getFinalTaxonomy = (dataId, taxonPrefix, onSuccess) => {
    appFetch(`/taxonomy?dataId=${dataId}&taxonPrefix=${taxonPrefix}`,
        config('GET'),
        onSuccess);
}

export const findConstructionCalls = ({ dataId, page }, onSuccess) =>
    appFetch(`/taxonomy/calls?dataId=${dataId}&page=${page}`, config('GET'), onSuccess);

export const getTaxonPrefixes = (dataId, onSuccess) =>
    appFetch(`/taxonomy/taxons?dataId=${dataId}`, config('GET'), onSuccess);

export const getPendingTasks = (onSuccess) =>
    appFetch(`/taxonomy/pending`, config('GET'), onSuccess);
