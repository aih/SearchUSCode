# Based on https://github.com/elastic/elasticsearch-py/blob/master/examples/fastapi-apm/app.py
# Licensed to Elasticsearch B.V under one or more agreements.
# Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
# See the LICENSE file in the project root for more information


import os
from typing import Optional
from fastapi import FastAPI
#from fastapi.encoders import jsonable_encoder
from elasticsearch import AsyncElasticsearch, NotFoundError

if os.environ.get("ELASTICSEARCH_HOSTS"):
  ELASTICSEARCH_HOSTS = os.environ["ELASTICSEARCH_HOSTS"]
else:
  ELASTICSEARCH_HOSTS = ['http://localhost:9200']
es = AsyncElasticsearch(ELASTICSEARCH_HOSTS)
app = FastAPI(
    title="Search the United States Code",
    description="A search interface for the United States Code in USLM",
    version="0.0.1",)

INDEX_DEFAULT = 'uscsections'

@app.on_event("shutdown")
async def app_shutdown():
    await es.close()

@app.get("/search/_health")
async def index():
    return await es.cluster.health()


@app.get("/search")
async def search(q: Optional[str] = '', fields: Optional[str] = '', maxresults: Optional[int] = 100):
  """
  Query string is passed as a query parameter (/search?q="this")
  The path may be used to specify the field to query on (e.g. 'heading') (NOT YET IMPLEMENTED)

  Args:
      q (Optional[str], optional): The string for an Elasticsearch querystring query. Defaults to ''.
      fields (Optional[str], optional): A comma-separated list of fields to search. Defaults to ''.
      maxresults (Optional[int], optional): Maximum number of results to retrieve. Defaults to 100.

  Returns:
      es.search:  An Elasticsearch search result, where `req.body.hits.hits` is a list of results.
                  `req.body.hits.total = { "value" : 63, "relation" : "eq" }`
  """
  if not q:
    q = ''
  return await es.search(
      index=INDEX_DEFAULT, body={"query": {"multi_match": {"query": q}}}
  )

#@app.get("/delete")
#async def delete():
#    return await es.delete_by_query(index="uscsections", body={"query": {"match_all": {}}})


#@app.get("/delete/{id}")
#async def delete_id(id):
#    try:
#        return await es.delete(index="games", id=id)
#    except NotFoundError as e:
#        return e.info, 404


#@app.get("/update")
#async def update():
#    response = []
#    docs = await es.search(
#        index=INDEX_DEFAULT, body={"query": {"multi_match": {"query": ""}}}
#    )
#    now = datetime.datetime.utcnow()
#    for doc in docs["hits"]["hits"]:
#        response.append(
#            await es.update(
#                index=INDEX_DEFAULT, id=doc["_id"], body={"doc": {"modified": now}}
#            )
#        )
#
#    return jsonable_encoder(response)


@app.get("/error")
async def error():
    try:
        await es.delete(index=INDEX_DEFAULT, id="somerandomid")
    except NotFoundError as e:
        return e.info


@app.get("/doc/{id}")
async def get_doc(id):
    return await es.get(index=INDEX_DEFAULT, id=id)
