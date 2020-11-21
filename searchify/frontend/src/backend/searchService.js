import { config, appFetch } from './appFetch';

export const simpleSearch = (params, onSuccess, onErrors) => {
    appFetch(`/simple-search`,
        config('POST', params), onSuccess, onErrors);
}

export const searchSongs = (params, onSuccess, onErrors) => {
    appFetch(`/songs?from=0&size=10`,
        config('POST', params), onSuccess, onErrors);
}

export const searchLyrics = (params, onSuccess, onErrors) => {
    appFetch(`/songs-lyrics?from=0&size=10`,
        config('POST', params), onSuccess, onErrors);
}

export const searchPlaylists = (params, onSuccess, onErrors) => {
    appFetch(`/playlists?from=0&size=10`,
        config('POST', params), onSuccess, onErrors);
}

export const searchArtists = (params, onSuccess, onErrors) => {
    appFetch(`/artists?from=0&size=10`,
        config('POST', params), onSuccess, onErrors);
}