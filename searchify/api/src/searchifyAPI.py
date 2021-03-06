from flask import jsonify, Flask, request, redirect, url_for
from celery import Celery
import os,json
from search import facetedSearch
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

DATA_DIR = os.path.dirname(os.path.abspath(__file__)) + "/../data/"

app.config['CELERY_BROKER_URL'] = 'redis://redis:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://redis:6379/0'
app.config['CELERY_REDIS_MAX_CONNECTIONS'] = 5

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@celery.task(bind=True)
def build_index(self, arglist):
    executePipeline(arglist=arglist)
    return {'current': 100, 'total': 100, 'result': 0}


@app.route('/status/<task_id>')
def taskstatus(task_id):
    task = build_index.AsyncResult(task_id)
    if task.state == 'PENDING':
        # job did not start yet
        response = {
            'state': task.state,
            'current': 0,
            'total': 1,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('current', 0),
            'total': task.info.get('total', 1),
            'status': task.info.get('status', '')
        }
        if 'result' in task.info:
            response['result'] = task.info['result']
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'current': -1,
            'total': 1,
            'status': str(task.info),  # this is the exception raised
        }
    response['taskId'] = task_id
    print(response)
    return jsonify(response)


@app.route('/songs', methods=['POST'])
@cross_origin()
def find_songs():
    params = request.json
    size = request.args.get('size')
    fromParam = request.args.get('from')

    if params is None or len(params) == 0:
        resp = jsonify('No search criteria provided.')
        resp.status_code = 401
        print(resp)
        return resp

    docs = facetedSearch.searchSongs(params, fromParam, size)

    response = {}
    hits = {}
    aggregations = []
    response["timedOut"] = docs["timed_out"]
    hits["total"] = docs["hits"]["total"]["value"]
    hits["maxScore"] = docs["hits"]["max_score"]
    hits["docs"] = []
    for doc in docs["hits"]["hits"]:
        newDoc = {}
        newDoc["id"] = doc["_id"]
        newDoc["score"] = doc["_score"]
        newDoc["song_url"] = doc["_source"]["song_url"]
        newDoc["song_name"] = doc["_source"]["song_name"]
        newDoc["song_artist"] = doc["_source"]["song_artist"]
        newDoc["song_duration"] = doc["_source"]["song_duration"]
        newDoc["song_album_name"] = doc["_source"]["song_album_name"]
        newDoc["song_album_year"] = doc["_source"]["song_album_year"]
        try:
            newDoc["song_lyrics"] = doc["_source"]["song_lyrics"].replace("\\n", "\n")
        except:
            newDoc["song_lyrics"] = doc["_source"]["song_lyrics"]
        hits["docs"].append(newDoc)

    aggregationList = docs["aggregations"]["Terms Filter"]["buckets"]
    for agg in aggregationList:
        newAggregation = {}
        newAggregation["key"] = agg["key"]
        newAggregation["count"] = agg["doc_count"]
        aggregations.append(newAggregation)

    response["hits"] = hits
    response["aggregations"] = aggregations

    return response


@app.route('/songs-lyrics', methods=['POST'])
@cross_origin()
def find_songs_by_lyrics():
    params = request.json
    size = request.args.get('size')
    fromParam = request.args.get('from')

    if params is None or len(params) == 0:
        resp = jsonify('No search criteria provided.')
        resp.status_code = 401
        print(resp)
        return resp

    docs = facetedSearch.searchSongsByLyrics(params, fromParam, size)

    response = {}
    hits = {}
    response["timedOut"] = docs["timed_out"]
    hits["total"] = docs["hits"]["total"]["value"]
    hits["maxScore"] = docs["hits"]["max_score"]
    hits["docs"] = []
    for doc in docs["hits"]["hits"]:
        newDoc = {}
        newDoc["id"] = doc["_id"]
        newDoc["score"] = doc["_score"]
        newDoc["song_url"] = doc["_source"]["song_url"]
        newDoc["song_name"] = doc["_source"]["song_name"]
        newDoc["song_artist"] = doc["_source"]["song_artist"]
        newDoc["song_duration"] = doc["_source"]["song_duration"]
        newDoc["song_album_name"] = doc["_source"]["song_album_name"]
        newDoc["song_album_year"] = doc["_source"]["song_album_year"]
        try:
            newDoc["song_lyrics"] = doc["_source"]["song_lyrics"].replace("\\n", "\n")
        except:
            newDoc["song_lyrics"] = doc["_source"]["song_lyrics"]
        hits["docs"].append(newDoc)

    response["hits"] = hits

    return response

@app.route('/playlists', methods=['POST'])
@cross_origin()
def find_playlists():
    params = request.json
    size = request.args.get('size')
    fromParam = request.args.get('from')

    if params is None or len(params) == 0:
        resp = jsonify('No search criteria provided.')
        resp.status_code = 401
        print(resp)
        return resp

    docs = facetedSearch.searchPlaylists(params, fromParam, size)

    response = {}
    hits = {}
    response["timedOut"] = docs["timed_out"]
    hits["total"] = docs["hits"]["total"]["value"]
    hits["maxScore"] = docs["hits"]["max_score"]
    hits["docs"] = []
    for doc in docs["hits"]["hits"]:
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

    response["hits"] = hits

    return response

@app.route('/artists', methods=['POST'])
@cross_origin()
def find_artists():
    params = request.json
    size = request.args.get('size')
    fromParam = request.args.get('from')

    if params is None or len(params) == 0:
        resp = jsonify('No search criteria provided.')
        resp.status_code = 401
        print(resp)
        return resp

    docs = facetedSearch.searchArtists(params, fromParam, size)

    response = {}
    hits = {}
    response["timedOut"] = docs["timed_out"]
    hits["total"] = docs["hits"]["total"]["value"]
    hits["maxScore"] = docs["hits"]["max_score"]
    hits["docs"] = []
    for doc in docs["hits"]["hits"]:
        newDoc = {}
        newDoc["id"] = doc["_id"]
        newDoc["score"] = doc["_score"]
        newDoc["artist_url"] = doc["_source"]["artist_url"]
        newDoc["artist_name"] = doc["_source"]["artist_name"]
        newDoc["artist_locations"] = doc["_source"]["artist_locations"]
        newDoc["artist_followers"] = doc["_source"]["artist_followers"]
        newDoc["artist_listeners"] = doc["_source"]["artist_listeners"]
        hits["docs"].append(newDoc)

    response["hits"] = hits

    return response

@app.route('/simple-search', methods=['POST'])
@cross_origin()
def simple_search():
    params = request.json

    if params is None or len(params) == 0:
        resp = jsonify('No search criteria provided.')
        resp.status_code = 401
        print(resp)
        return resp

    docs = facetedSearch.simpleSearch(params)

    return docs

if __name__ == '__main__':
    app.run()
