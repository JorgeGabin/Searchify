from flask import jsonify, Flask, request, redirect, url_for
from celery import Celery
import os,json,pickle
from elasticsearch import Elasticsearch, helpers
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

@app.route('/crawl', methods=['POST'])
def crawl():
    task = build_index.apply_async(args=[arglist])
    return jsonify(task.id), 202, {'Location': url_for('taskstatus', task_id=task.id)}

@app.route('/do-faceted-search/<indexName>', methods=['POST'])
def do_faceted_search(indexName):
    queryString = request.args.get('query')
    size = request.args.get('size')
    fromParam = request.args.get('from')
    facets = request.json
    if (facets is None or len(facets) == 0) and (queryString is None or queryString == ''):
        resp = jsonify('No search criteria provided.')
        resp.status_code = 401
        print(resp)
        return resp

    if dataname == None:
        resp = jsonify('No dataname provided.')
        resp.status_code = 401
        print(resp)
        return resp

    if taxonprefix == None:
        resp = jsonify('No taxon prefix provided.')
        resp.status_code = 401
        print(resp)
        return resp

    docs = facetedSearch.doFacetedSearch(indexName, queryString, facets, fromParam=fromParam, size=size)
    response = {}
    hits = {}
    aggregations = []
    response["timedOut"] = docs["timed_out"]
    hits["total"] = docs["hits"]["total"]["value"]
    hits["maxScore"] = docs["hits"]["max_score"]
    hits["docs"] = []
    for doc in docs["hits"]["hits"]:
        newDoc = {}
        textArray = doc["_source"]["body"].split(' ')
        body = ' '.join(textArray[:100])
        newDoc["id"] = doc["_id"]
        newDoc["score"] = doc["_score"]
        newDoc["body"] = body
        newDoc["tags"] = doc["_source"]["tags"]
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

@app.route('/find-doc/<indexName>/<docId>', methods=['GET'])
def find_doc(indexName, docId):

    if (docId is None or len(docId) == 0):
        resp = jsonify('No docID provided.')
        resp.status_code = 401
        return resp

    if indexName == None:
        resp = jsonify('No index name provided.')
        resp.status_code = 401
        return resp

    doc = facetedSearch.searchDocByIndex(indexName, docId)
    returnDoc = doc['_source']
    returnDoc['id'] = docId
    return json.dumps(returnDoc), 200, {}

if __name__ == '__main__':
    app.run()
