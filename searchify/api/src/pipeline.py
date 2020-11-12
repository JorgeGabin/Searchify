import os, argparse
from index import createIndex

def updateProgress(task, state, current, message):
    task.update_state(state=state, \
        meta={'current': current, 'total': 100, \
        'status': message})

def makeIndex(dataset, taxonPrefix):
    createIndex.index(dataset, taxonPrefix)

def executePipeline(asyncTask=None, arglist=[]):
    parser = argparse.ArgumentParser(prog='main.py', description='Run HiExpan algorithm on input data')

    parser.add_argument('-indexName', type=str, default="sample_dataset", help='CorpusName')
    # Model Parameters
    # parser.add_argument('-max-iter-tree', type=int, default=5,
    #                     help='maximum iteration number of hierarchical tree expansion')
    # parser.add_argument('-use-type', action='store_true', default=False,
    #                     help='use type feature or not, default is not use')
    # parser.add_argument('-use-global-ref-edges', action='store_true', default=False,
    #                     help='use global reference edges or not, default is not use')
    # parser.add_argument('-debug', action='store_true', default=False,
    #                     help='debug mode or not, default is not debug')
    # parser.add_argument('-num_initial_edge', type=int, default=1, help='number of each niece/nephew nodes for depth expansion')
    # parser.add_argument('-num_initial_node', type=int, default=3,
    #                     help='number of each node\'s initial children for depth expansion')
    args = parser.parse_args(arglist)

    try:
    # updateProgress(asyncTask, 'CORPUS', 0, 'Corpus processing step')
    # processCorpus(args.data, args.taxonPrefix, skipCorpusProcess)
    # updateProgress(asyncTask, 'FEATURE', 25, 'Feature extraction step')
    # extractFeatures(args.data, skipExtractFeatures)
    # updateProgress(asyncTask, 'TAXONOMY', 50, 'Taxonomy construction step')
    # createTaxonomy(args, seedlist=seedlist);
        updateProgress(asyncTask, 'INDEXING', 75, 'Creating index step')
        makeIndex(args.indexName)
        updateProgress(asyncTask, 'SUCCESS', 100, "Done.")

    except Exception as e:
        asyncTask.update_state(state='FAILURE', \
            meta={'current': -1	, 'total': 100, \
            'status': 'Something went wrong in the taxonomy procedure. Contact system administrator.'})