import os
import json
import re
from lxml import etree
from elasticsearch import exceptions, Elasticsearch
es = Elasticsearch()

INDEX_USCSECTIONS = "uscsections"
PATH_USCMAPPING = os.path.join('..', 'elasticsearch', 'uscsections_mapping.json')
PATH_USC_TITLE_16 = os.path.join('..', 'data', 'usc16.xml')

NS_USLM = {'': 'http://xml.house.gov/schemas/uslm/1.0'}

def getMapping(mapping_path: str=PATH_USCMAPPING):
  with open(mapping_path, 'r') as mapfile:
    return json.load(mapfile)

def createIndex(index: str='billsections', body: dict=getMapping(PATH_USCMAPPING), delete=False):
  if delete:
    try:
      es.indices.delete(index=index)
    except exceptions.NotFoundError:
      print('No index to delete: {0}'.format(index))

  es.indices.create(index=index, ignore=400, body=body)

def getChildText(elem, xSelector):
  childItem = elem.xpath(xSelector)
  if childItem and len(childItem) > 0 and childItem[0].text:
      return childItem[0].text
  else:
    return ''

def indexDocs(doc_paths: list[str]=[PATH_USC_TITLE_16], indexName: str=INDEX_USCSECTIONS):
  """
  Index XML documents (with section elements)

  Args:
      doc_paths (list[str], optional): list of document paths. In the future may update to directories. Defaults to [PATH_USC_TITLE_16].
      indexName (str, optional): name of index to index to. Defaults to INDEX_USCSECTIONS.

  Raises:
      type: parsing error when parsing from lxml
  """

  for doc_path in doc_paths:
    try:
      docTree = etree.parse(doc_path)
    except Exception as e:
      import sys
      raise type(e)(str(e) +
                      '; Could not parse document').with_traceback(sys.exc_info()[2])
    sections = docTree.xpath('//section', namespaces=NS_USLM)

    for section in sections:
      sectionDoc = {
        'id':  section.get('id', ''),
        'identifier':  section.get('identifier', ''),
        'number': getChildText(section, 'num'),
        'heading':  getChildText(section, 'heading'),
        'text': etree.tostring(section, method="text", encoding="unicode"),
        'xml': etree.tostring(section, method="xml", encoding="unicode")
      }

      res = es.index(index=indexName, body=sectionDoc)

def refreshIndices(index: str=INDEX_USCSECTIONS):
  es.indices.refresh(index=index)

if __name__ == "__main__":
  createIndex(delete=True)
  indexDocs()
  refreshIndices()
