import { ApolloClient, InMemoryCache } from '@apollo/client'

export const client = new ApolloClient({
    uri: 'https://rickandmortyapi.com/graphql',
    cache: new InMemoryCache()
});

export const clientProduct = new ApolloClient({
    uri: 'https://graphql-compose.herokuapp.com/northwind',
    cache: new InMemoryCache()
});


  