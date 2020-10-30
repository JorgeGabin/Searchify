#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from elasticsearch import Elasticsearch, helpers
import os, uuid, json

ELASTIC_URL = 'es01:9200'


def doFacetedSearch(indexName, queryString, facetList, fromParam=0, size=10):
    elastic = Elasticsearch(ELASTIC_URL)
    noQueryString = False
    noFacetList = False
    queryParam = [
        {
            "match": {
                "body": ""
            }
        }
    ]
    filterFacets = {
        "terms": {
            "tags": []
        }
    }
    query = {
        "from": fromParam,
        "size": size,
        "query": {
            "bool": {}
        },
        "aggs": {
            "Terms Filter": {
                "terms": {
                    "field": "tags",
                    "size": 20
                }
            }
        }
    }

    if queryString and queryString.strip() != '':
        queryParam[0]["match"]["body"] = queryString
        query["query"]["bool"]["must"] = queryParam
    else:
        noQueryString = True

    if facetList and len(facetList) != 0:
        filterFacets["terms"]["tags"] = facetList
        query["query"]["bool"]["filter"] = filterFacets
    else:
        noFacetList = True

    if noQueryString and noFacetList:
        return
    return elastic.search(index=indexName, body=query)


def searchDocByIndex(indexName, docId):
    elastic = Elasticsearch(ELASTIC_URL)
    return elastic.get(index=indexName, id=docId)
