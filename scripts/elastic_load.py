import os
import json
import re
from lxml import etree
from elasticsearch import exceptions, Elasticsearch
es = Elasticsearch()
from typing import List

import logging
logging.basicConfig(filename='elastic_load.log', level=logging.INFO)

INDEX_USCSECTIONS = "uscsections"
PATH_USCMAPPING = os.path.join('..', 'elasticsearch', 'uscsections_mapping.json')
PATH_USC_TITLE_16 = os.path.join('..', 'data', 'usc16.xml')

NS_USLM = {'uslm': 'http://xml.house.gov/schemas/uslm/1.0'}

def getMapping(mapping_path: str=PATH_USCMAPPING):
  with open(mapping_path, 'r') as mapfile:
    return json.load(mapfile)

def createIndex(index: str='uscsections', body: dict=getMapping(PATH_USCMAPPING), delete=False):
  if delete:
    try:
      logging.info('Deleting index: ' + index)
      es.indices.delete(index=index)
    except exceptions.NotFoundError:
      print('No index to delete: {0}'.format(index))

  logging.info('Recreating index: ' + index)
  es.indices.create(index=index, ignore=400, body=body)

def getChildText(elem, xSelector):
  childItem = elem.xpath(xSelector, namespaces=NS_USLM)
  if childItem and len(childItem) > 0 and childItem[0].text:
      return childItem[0].text
  else:
    return ''

def getSections(doc_path: str=PATH_USC_TITLE_16, ns=NS_USLM):
    try:
      docTree = etree.parse(doc_path)
    except Exception as e:
      import sys
      raise type(e)(str(e) +
                      '; Could not parse document').with_traceback(sys.exc_info()[2])

    logging.info('Getting sections for: ' + doc_path)
    return docTree.xpath('//uslm:section', namespaces=ns)

def indexDocs(doc_paths: List[str]=[PATH_USC_TITLE_16], indexName: str=INDEX_USCSECTIONS):
  """
  Index XML documents (with section elements)

  Args:
      doc_paths (list[str], optional): list of document paths. In the future may update to directories. Defaults to [PATH_USC_TITLE_16].
      indexName (str, optional): name of index to index to. Defaults to INDEX_USCSECTIONS.

  Raises:
      type: parsing error when parsing from lxml
  """

  for doc_path in doc_paths:

    sections = getSections(doc_path)

    for i, section in enumerate(sections):

      sectionDoc = {
        'id':  section.get('id', ''),
        'identifier':  section.get('identifier', ''),
        'number': getChildText(section, 'uslm:num'),
        'heading':  getChildText(section, 'uslm:heading'),
        'text': etree.tostring(section, method="text", encoding="unicode"),
        'xml': etree.tostring(section, method="xml", encoding="unicode")
      }

      if (i % 50) == 0:
        logging.info('Sections indexed: ' + str(i))
        logging.info('Current section: ' + sectionDoc.get('number', '') + ' ' + sectionDoc.get('heading', ''))
      res = es.index(index=indexName, body=sectionDoc)

def refreshIndices(index: str=INDEX_USCSECTIONS):
  es.indices.refresh(index=index)

if __name__ == "__main__":
  createIndex(delete=True)
  indexDocs()
  refreshIndices()
