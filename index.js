const waitOn = require('wait-on');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { stitchSchemas } = require('@graphql-tools/stitch');
const {delegateToSchema} = require("@graphql-tools/delegate");
const { UrlLoader } = require('@graphql-tools/url-loader')
const { loadSchema } = require('@graphql-tools/load')

const makeRemoteExecutor = require('./lib/make_remote_executor');

async function makeGatewaySchema() {
  const remoteExecutor = makeRemoteExecutor('http://localhost:4001/graphql');

  const remoteSchema = await loadSchema('http://localhost:4001/graphql', {
    loaders: [new UrlLoader()],
    headers: {
      testheader: Math.random()
    }
  });

  return stitchSchemas({
    subschemas: [
      {
        schema: remoteSchema,
        executor: remoteExecutor,
      }
    ],
    typeDefs: 'type Query { delegateRnd: Float }',
    resolvers: {
      Query: {
        delegateRnd: async (root, { upc }, context, info) => {
          console.log(`Rand in delegateRnd resolver: ${context?.rand}`)

          return await delegateToSchema({
            schema: remoteSchema,
            operation: 'query',
            fieldName: 'rnd',
            args: {},
            context,
            info
          });
        }
      }
    }
  });
}

waitOn({ resources: ['tcp:4001'] }, async () => {
  const schema = await makeGatewaySchema();
  const app = express();
  app.use('/graphql', graphqlHTTP((req) => ({
    schema,
    context: {
      rand: Math.random()
    },
    graphiql: true
  })));
  app.listen(4000, () => console.log('gateway running at http://localhost:4000/graphql'));
});
