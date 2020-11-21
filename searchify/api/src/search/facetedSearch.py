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
    songs = {}
    hits = {}
    songs["timedOut"] = songs_result["timed_out"]
    hits["total"] = songs_result["hits"]["total"]["value"]
    hits["maxScore"] = songs_result["hits"]["max_score"]
    hits["docs"] = []
    for doc in songs_result["hits"]["hits"]:
        newDoc = {}
        newDoc["id"] = doc["_id"]
        newDoc["score"] = doc["_score"]
        newDoc["song_url"] = doc["_source"]["song_url"]
        newDoc["song_name"] = doc["_source"]["song_name"]
        newDoc["song_artists"] = doc["_source"]["song_artists"]
        newDoc["song_duration"] = doc["_source"]["song_duration"]
        newDoc["song_album"] = doc["_source"]["song_album"]
        try:
            newDoc["song_lyrics"] = doc["_source"]["song_lyrics"].replace("\\n", "\n")
        except:
            newDoc["song_lyrics"] = doc["_source"]["song_lyrics"]
        hits["docs"].append(newDoc)

    songs["hits"] = hits

    query["query"]["bool"]["must"] = {
        "prefix": {
            "artist_name": params["keywords"]
        }
    }

    artists_result = elastic.search(index="artists", body=query)
    artists = {}
    hits = {}
    songs["timedOut"] = artists_result["timed_out"]
    hits["total"] = artists_result["hits"]["total"]["value"]
    hits["maxScore"] = artists_result["hits"]["max_score"]
    hits["docs"] = []
    for doc in artists_result["hits"]["hits"]:
        newDoc = {}
        newDoc["id"] = doc["_id"]
        newDoc["score"] = doc["_score"]
        newDoc["artist_url"] = doc["_source"]["artist_url"]
        newDoc["artist_name"] = doc["_source"]["artist_name"]
        newDoc["artist_followers"] = doc["_source"]["artist_followers"]
        newDoc["artist_listeners"] = doc["_source"]["artist_listeners"]
        newDoc["artist_locations"] = doc["_source"]["artist_locations"]
        hits["docs"].append(newDoc)

    artists["hits"] = hits

    query["query"]["bool"]["must"] = {
        "prefix": {
            "playlist_name": params["keywords"]
        }
    }

    playlists_result = elastic.search(index="playlists", body=query)
    playlists = {}
    hits = {}
    playlists["timedOut"] = playlists_result["timed_out"]
    hits["total"] = playlists_result["hits"]["total"]["value"]
    hits["maxScore"] = playlists_result["hits"]["max_score"]
    hits["docs"] = []
    for doc in playlists_result["hits"]["hits"]:
        newDoc = {}
        newDoc["id"] = doc["_id"]
        newDoc["score"] = doc["_score"]
        newDoc["playlist_url"] = doc["_source"]["playlist_url"]
        newDoc["playlist_name"] = doc["_source"]["playlist_name"]
        newDoc["playlist_songs"] = doc["_source"]["playlist_songs"]
        newDoc["playlist_artists_albums"] = doc["_source"]["playlist_artists_albums"]
        newDoc["playlist_songs_number"] = doc["_source"]["playlist_songs_number"]
        newDoc["playlist_similar"] = doc["_source"]["playlist_similar"]
        hits["docs"].append(newDoc)

    playlists["hits"] = hits

    response = {
        "songs": songs,
        "artists": artists,
        "playlists": playlists,
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
