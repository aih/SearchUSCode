import os
import json
import re
from lxml import etree
from elasticsearch import exceptions, Elasticsearch
es = Elasticsearch()
from collections import OrderedDict

PATH_USCMAPPING = os.path.join('..', 'elasticsearch', 'uscsections_mapping.json')
PATH_USC_TITLE_16 = os.path.join('..', 'data', 'usc16.xml')

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

def indexDocs(doc_paths: list[str]=[PATH_USC_TITLE_16]):
  """
  Index XML documents (with section elements)

  Args:
      doc_paths (list[str], optional): list of document paths. In the future may update to directories. Defaults to [PATH_USC_TITLE_16].

  Raises:
      Exception: raises parsing exception
  """
  for doc_path in doc_paths:
    try:
      docTree = etree.parse(doc_path)
    except Exception as e:
      import sys
      raise type(e)(str(e) +
                      '; Could not parse document').with_traceback(sys.exc_info()[2])
    sections = docTree.xpath('//section')

    for section in sections:
      sectionDoc = {
        'id':  '',
        'identifier':  '',
        'number': getChildText(section, 'num'),
        'heading':  getChildText(section, 'heading'),
        'text': etree.tostring(section, method="text", encoding="unicode"),
        'xml': etree.tostring(section, method="xml", encoding="unicode")
      }

      res = es.index(index="uscsections", body=sectionDoc)

def refreshIndices(index: str="uscsections"):
  es.indices.refresh(index=index)


if __name__ == "__main__":
  createIndex(delete=True)
  indexDocs()
  refreshIndices()
