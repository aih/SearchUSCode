# Based on https://github.com/elastic/elasticsearch-py/blob/master/examples/fastapi-apm/app.py
# Licensed to Elasticsearch B.V under one or more agreements.
# Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
# See the LICENSE file in the project root for more information


import os
from fastapi import FastAPI
#from fastapi.encoders import jsonable_encoder
from elasticsearch import AsyncElasticsearch, NotFoundError

es = AsyncElasticsearch(os.environ["ELASTICSEARCH_HOSTS"])
app = FastAPI()

INDEX_DEFAULT = 'uscsections'

@app.on_event("shutdown")
async def app_shutdown():
    await es.close()

@app.get("/")
async def index():
    return await es.cluster.health()


"""
  Query string is passed as a query parameter (/search?q="this")
  The path may be used to specify the field to query on (e.g. 'heading') (NOT YET IMPLEMENTED)
"""
@app.get("/search/{field}")
async def search(field: str, q: str):
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
