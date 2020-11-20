import { config, appFetch } from './appFetch';

export const findDataById = (dataId, onSuccess, onErrors) =>
    appFetch(`/project/data/${dataId}`, config('GET'), onSuccess, onErrors);

export const findData = ({ page }, onSuccess) =>
    appFetch(`/project/data?page=${page}`, config('GET'), onSuccess);

export const addData = (name, description, accesibility, onSuccess, onErrors) =>
    appFetch(`/project/data`, config('POST', {name, description, accesibility}), onSuccess, onErrors);

export const deleteData = (dataId, onSuccess) => {
    appFetch(`/project/data/${dataId}`, config('POST'), onSuccess);}
