import { config, appFetch } from './appFetch';

export const simpleSearch = (params, onSuccess, onErrors) => {
    appFetch(`/simple-search`,
        config('POST', params), onSuccess, onErrors);
}

export const searchSongs = (params, from, onSuccess, onErrors) => {
    appFetch(`/songs?from=${from}&size=10`,
        config('POST', params), onSuccess, onErrors);
}

export const searchLyrics = (params, from, onSuccess, onErrors) => {
    appFetch(`/songs-lyrics?from=${from}&size=10`,
        config('POST', params), onSuccess, onErrors);
}

export const searchPlaylists = (params, from, onSuccess, onErrors) => {
    appFetch(`/playlists?from=${from}&size=10`,
        config('POST', params), onSuccess, onErrors);
}

export const searchArtists = (params, from, onSuccess, onErrors) => {
    appFetch(`/artists?from=${from}&size=10`,
        config('POST', params), onSuccess, onErrors);
}