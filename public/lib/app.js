import GraphiQL from 'graphiql';
import React from 'react';

var search = window.location.search;
  var parameters = {};
  search.substr(1).split('&').forEach(function (entry) {
    var eq = entry.indexOf('=');
    if (eq >= 0) {
      parameters[decodeURIComponent(entry.slice(0, eq))] =
        decodeURIComponent(entry.slice(eq + 1));
    }
  });
  // if variables was provided, try to format it.
  if (parameters.variables) {
    try {
      parameters.variables =
        JSON.stringify(JSON.parse(parameters.variables), null, 2);
    } catch (e) {
      // Do nothing, we want to display the invalid JSON as a string, rather
      // than present an error.
    }
  }
  // When the query and variables string is edited, update the URL bar so
  // that it can be easily shared
  function onEditQuery(newQuery) {
    parameters.query = newQuery;
    updateURL();
  }
  function onEditVariables(newVariables) {
    parameters.variables = newVariables;
    updateURL();
  }
  function updateURL() {
    var newSearch = '?' + Object.keys(parameters).map(function (key) {
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(parameters[key]);
    }).join('&');
    history.replaceState(null, null, newSearch);
  }
  // Defines a GraphQL fetcher using the fetch API.
  function graphQLFetcher(graphQLParams) {
    return fetch(window.location.origin + '/graphql', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(graphQLParams),
    }).then(function (response) {
      return response.json()
    });
  }
  // Render <GraphiQL /> into the body.
  React.render(
    React.createElement(GraphiQL, {
      fetcher: graphQLFetcher,
      query: parameters.query,
      variables: parameters.variables,
      onEditQuery: onEditQuery,
      onEditVariables: onEditVariables
    }),
    // document.querySelector('#ctn')
    document.body
  );
