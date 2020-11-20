from flask import jsonify, Flask, request, redirect, url_for
from celery import Celery
import os,json
from search import facetedSearch

app = Flask(__name__)
app.config["DEBUG"] = True

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


@app.route('/songs', methods=['GET'])
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
        newDoc["song_artists"] = doc["_source"]["song_artists"]
        newDoc["song_duration"] = doc["_source"]["song_duration"]
        newDoc["song_album"] = doc["_source"]["song_album"]
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

    return json.dumps(response), 200, {}


@app.route('/songs-lyrics', methods=['GET'])
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
        newDoc["song_artists"] = doc["_source"]["song_artists"]
        newDoc["song_duration"] = doc["_source"]["song_duration"]
        newDoc["song_album"] = doc["_source"]["song_album"]
        newDoc["song_lyrics"] = doc["_source"]["song_lyrics"]
        hits["docs"].append(newDoc)

    response["hits"] = hits

    return json.dumps(response), 200, {}

@app.route('/playlists', methods=['GET'])
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

    return json.dumps(response), 200, {}

@app.route('/simple-search', methods=['GET'])
def simple_search():
    params = request.json

    if params is None or len(params) == 0:
        resp = jsonify('No search criteria provided.')
        resp.status_code = 401
        print(resp)
        return resp

    docs = facetedSearch.simpleSearch(params)
    print("RESULT ON API ", docs)

    return json.dumps(docs), 200, {}

if __name__ == '__main__':
    app.run()
