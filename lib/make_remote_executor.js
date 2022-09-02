const { fetch } = require('cross-fetch');
const { print } = require('graphql');

module.exports = function makeRemoteExecutor(url) {
  return async ({ document, variables, context }) => {
    const query = typeof document === 'string' ? document : print(document);
    const fetchResult = await fetch(url, {
      method: 'POST',
      headers: {
        rand: context?.rand,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };
};
