#!/usr/bin/env python3
#-*- coding: utf-8 -*-
from elasticsearch import Elasticsearch, helpers
import os, json

ELASTIC_URL = 'es01:9200'
song_mapping = {
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
            "song_url": {
                "type": "text",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "song_name": {
                "type": "text",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "song_artists": {
                "type": "text",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "song_duration": {
                "type": "long",
            },
            "song_album": {
                "type": "object",
            },
            "song_lyrics": {
                "type": "text",
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
playlist_mapping = {
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
            "playlist_url": {
                "type": "text",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "playlist_name": {
                "type": "text",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "playlist_songs": {
                "type": "keyword",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "playlist_songs_number": {
                "type": "integer",
            },
            "playlist_artists_albums": {
                "type": "text",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "playlist_similar": {
                "type": "keyword",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
        }
    }
}

artist_mapping = {
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
            "artist_url": {
                "type": "text",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "artist_listeners": {
                "type": "long",
            },
            "artist_followers": {
                "type": "long",
            },
            "artist_name": {
                "type": "text",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
            "artist_locations": {
                "type": "keyword",
                "fields": {
                    "analyzed": {
                        "type": "text",
                        "analyzer": "eventNameAnalyzer",
                        "search_analyzer": "eventNameAnalyzer"
                    }
                }
            },
        }
    }
}
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
def bulk_json_data(json_file):
    json_list = get_data_from_file(json_file)
    i = 0
    for d in json_list:
        doc = json.loads(d)
        # use a `yield` generator so that the data
        # isn't loaded into memory
        if 'index' not in doc:
            index_info = json.loads(json_list[i-1])['index']
            yield {
                "_index": index_info['_index'],
                "_id": index_info['_id'],
                "_source": doc,
            }

        i += 1

def indexBulkDocs(elastic, datapath):
    # make the bulk call, and get a response
    response = helpers.bulk(elastic, bulk_json_data(datapath))
    print ("\nbulk_json_data() RESPONSE:", response)
    return True

def index():
    # create a new instance of the Elasticsearch client class
    elastic = Elasticsearch(ELASTIC_URL)

    filepath = os.path.dirname(os.path.abspath(__file__))
    datapath = '../../data/elasticitems.json'
    if(not os.path.exists(filepath + '/' + datapath)):
        print("No elasticitems.json found. No index will be created.")
        return False
    elastic.indices.delete(index='songs', ignore=[400, 404])
    elastic.indices.create(index='songs', body=song_mapping)
    elastic.indices.delete(index='playlists', ignore=[400, 404])
    elastic.indices.create(index='playlists', body=playlist_mapping)
    elastic.indices.delete(index='artists', ignore=[400, 404])
    elastic.indices.create(index='artists', body=artist_mapping)

    return indexBulkDocs(elastic, datapath)
