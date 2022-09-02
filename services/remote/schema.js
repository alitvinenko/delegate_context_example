const { makeExecutableSchema } = require('@graphql-tools/schema');
const readFileSync = require('../../lib/read_file_sync');
const typeDefs = readFileSync(__dirname, 'schema.graphql');

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      rnd: (root, { upc }, context) => {

        console.log(context.headers)

        console.log(`Rand in remote resolver: ${context.headers?.rand}`)

        return context.headers?.rand || -1
      }
    }
  }
});
