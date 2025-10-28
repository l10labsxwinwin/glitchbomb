import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client/core';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
	uri: 'https://api.cartridge.gg/x/glitchbomb-dev/torii/graphql'
});

const wsLink = new GraphQLWsLink(
	createClient({
		url: 'wss://api.cartridge.gg/x/glitchbomb-dev/torii/graphql'
	})
);

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
	},
	wsLink,
	httpLink
);

export const client = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache()
});
