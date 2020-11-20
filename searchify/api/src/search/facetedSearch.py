#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from elasticsearch import Elasticsearch, helpers
import os, uuid, json

ELASTIC_URL = 'es01:9200'


def simpleSearch(params):
    elastic = Elasticsearch(ELASTIC_URL)

    query = {
        "from": 0,
        "size": 4,
        "query": {
            "bool": {}
        }
    }

    query["query"]["bool"]["must"] = {
        "prefix": {
            "song_name": params["keywords"]
        }
    }

    songs_result = elastic.search(index="songs", body=query)

    query["query"]["bool"]["must"] = {
        "prefix": {
            "artist_name": params["keywords"]
        }
    }

    artists_result = elastic.search(index="artists", body=query)

    query["query"]["bool"]["must"] = {
        "prefix": {
            "playlist_name": params["keywords"]
        }
    }

    playlists_result = elastic.search(index="playlists", body=query)

    response = {
        "songs": songs_result["hits"]["hits"]["_source"],
        "artists": artists_result["hits"]["hits"]["_source"],
        "playlists": playlists_result["hits"]["hits"]["_source"],
    }

    return response


def searchSongs(params, fromParam=0, size=10):
    elastic = Elasticsearch(ELASTIC_URL)

    query = {
        "from": fromParam,
        "size": size,
        "query": {
            "bool": {}
        },
        "aggs": {
            "Terms Filter": {
                "terms": {
                    "field": "song_artists",
                    "size": 1000
                }
            }
        }
    }

    must = []

    if "song_name" in params:
        must.append({
            "match": {
                "song_name": params["song_name"]
            }
        })

    if must:
        query["query"]["bool"]["must"] = must

    should = []

    if "song_artists" in params:
        should.append({
            "match": {
                "song_artists": params["song_artists"]
            }
        })

    if "song_album_name" in params:
        should.append({
            "match": {
                "song_album.album_name": params["song_album_name"]
            }
        })

    if "song_duration_max" in params and "song_duration_min" in params:
        should.append({
            "range": {
                "song_duration": {
                    "gte": params["song_duration_min"],
                    "lte": params["song_duration_max"],
                    "boost": 10.0
                }
            }
        })

    if "song_year_max" in params and "song_year_min" in params:
        should.append({
            "range": {
                "song_album.album_release_year": {
                    "gte": params["song_year_min"],
                    "lte": params["song_year_max"],
                    "boost": 10.0
                }
            }
        })

    if should:
        query["query"]["bool"]["should"] = should

    if query["query"]["bool"]:
        print(query)
        return elastic.search(index="songs", body=query)
    else:
        return {
            "backendError": "No params received in the request"
        }


def searchSongsByLyrics(params, fromParam=0, size=10):
    elastic = Elasticsearch(ELASTIC_URL)

    query = {
        "from": fromParam,
        "size": size,
        "query": {
            "bool": {}
        }
    }

    if "song_lyrics" in params:
        query["query"]["bool"]["must"] = {
            "match": {
                "song_lyrics": params["song_lyrics"]
            }
        }

    if query["query"]["bool"]:
        return elastic.search(index="songs", body=query)
    else:
        return {
            "backendError": "No params received in the request"
        }


def searchPlaylists(params, fromParam=0, size=10):
    elastic = Elasticsearch(ELASTIC_URL)

    query = {
        "from": fromParam,
        "size": size,
        "query": {
            "bool": {}
        }
    }

    if "playlist_name" in params:
        query["query"]["bool"]["must"] = {
            "match": {
                "playlist_name": params["playlist_name"]
            }
        }

    should = []

    if "playlist_songs" in params:
        should.append({
            "terms": {
                "playlist_songs": params["playlist_songs"]
            }
        })

    if "playlist_artists_albums" in params:
        should.append({
            "terms": {
                "playlist_artists_albums": params["playlist_artists_albums"]
            }
        })

    if should:
        query["query"]["bool"]["should"] = should

    if query["query"]["bool"]:
        return elastic.search(index="playlists", body=query)
    else:
        return {
            "backendError": "No params received in the request"
        }


def searchDocByIndex(indexName, docId):
    elastic = Elasticsearch(ELASTIC_URL)
    return elastic.get(index=indexName, id=docId)
