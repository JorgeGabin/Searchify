#!/usr/bin/env python3
#-*- coding: utf-8 -*-
from elasticsearch import Elasticsearch, helpers
import os, uuid, json

ELASTIC_URL = 'es01:9200'

'''
a simple function that gets the working path of
the Python script and returns it
'''
def script_path():
    path = os.path.dirname(os.path.realpath(__file__))
    if os.name == 'posix': # posix is for macOS or Linux
        path = path + "/"
    else:
        path = path + chr(92) # backslash is for Windows
    return path


'''
this function opens a file and returns its
contents as a list of strings split by linebreaks
'''
def get_data_from_file(self, path=script_path()):
    file = open(path + str(self), encoding="utf8", errors='ignore')
    data = [line.strip() for line in file]
    file.close()
    return data

'''
generator to push bulk data from a JSON
file into an Elasticsearch index
'''
def bulk_json_data(json_file, _index):
    json_list = get_data_from_file(json_file)
    i = 0
    for d in json_list:
        i += 1
        doc = json.loads(d)
        # use a `yield` generator so that the data
        # isn't loaded into memory
        if '{"index"' not in doc:
            yield {
                "_index": _index,
                "_id": i,
                "_source": doc,
            }

def indexBulkDocs(elastic, datapath, indexName):
    # make the bulk call, and get a response
    response = helpers.bulk(elastic, bulk_json_data(datapath, indexName))
    print ("\nbulk_json_data() RESPONSE:", response)
    return True

def index(indexName):
    mapping = {
        "settings": {
            "analysis": {
                "analyzer": {
                    "eventNameAnalyzer": {
                        "tokenizer": "standard",
                    }
                }
            }
        },
        "mappings": {
            "properties": {
                "body": {
                    "type": "text",
                    "fields": {
                        "analyzed": {
                            "type": "text",
                            "analyzer": "eventNameAnalyzer",
                            "search_analyzer": "eventNameAnalyzer"
                        }
                    }
                },
                "tags": {
                    "type": "keyword",
                    "fields": {
                        "analyzed": {
                            "type": "text",
                            "analyzer": "eventNameAnalyzer",
                            "search_analyzer": "eventNameAnalyzer"
                        }
                    }
                }
            }
        }
    }
    # create a new instance of the Elasticsearch client class
    elastic = Elasticsearch(ELASTIC_URL)
    #elastic = Elasticsearch("localhost")

    filepath = os.path.dirname(os.path.abspath(__file__))
    datapath = '../../data/{}/index/corpus.json'.format(indexName)
    if(not os.path.exists(filepath + '/' + datapath)):
        print("No corpus.json found. No index will be created.")
        return False
    if elastic.indices.exists(index=indexName):
        elastic.indices.delete(index=indexName, ignore=[400, 404])
    elastic.indices.create(index=indexName, body=mapping)
    return indexBulkDocs(elastic, datapath, indexName)
