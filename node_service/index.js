'use strict';

// From https://github.com/searchkit/searchkit/blob/next/examples/with-express/index.js
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const {
  MultiMatchQuery,
  SearchkitResolvers,
  SearchkitSchema,
  RefinementSelectFacet
} = require('@searchkit/schema')

const searchkitConfig = {
  host: 'http://localhost:9200',
  index: 'billsections',
  hits: {
    fields: ['section_text', 'section_header']
  },
  query: new MultiMatchQuery({ fields: ['section_text', 'section_header'] }),
  facets: []
}


const { typeDefs, withSearchkitResolvers, context } = SearchkitSchema({
  config: searchkitConfig, // searchkit configuration
  typeName: 'ResultSet', // base typename
  hitTypeName: 'ResultHit',
  addToQueryType: true // When true, adds a field called results to Query type
})

const combinedTypeDefs = [
  gql`
    type Query {
      root: String
    }
    type Mutation {
      root: String
    }
    type ResultHit implements SKHit {
      id: ID!
      fields: HitFields
    }
    type HitFields {
      section_header: String
      section_text: String
    }
  `,
  ...typeDefs
]

const server = new ApolloServer({
  typeDefs: combinedTypeDefs,
  resolvers: withSearchkitResolvers({}),
  context: {
    ...context
  },
  playground: true,
  introspection: true,
});

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
