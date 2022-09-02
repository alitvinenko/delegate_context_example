const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();
app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));
app.listen(4001, () => console.log('remote running at http://localhost:4001/graphql'));
