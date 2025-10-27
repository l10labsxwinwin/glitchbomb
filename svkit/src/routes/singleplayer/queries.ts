import { gql } from '@apollo/client/core';

export const GET_PLAYERS = gql`
	query GetPlayers {
		glitchbombPlayerModels {
			edges {
				node {
					player
					state
					data {
						usdc
						gamepacks_bought
					}
				}
			}
		}
	}
`;

export const GET_GAMEPACKS = gql`
	query GetGamepacks($playerId: String!) {
		glitchbombGamePackModels(where: { player: $playerId }) {
			edges {
				node {
					player
					gamepack_id
					state
					data {
						current_game_id
						accumulated_moonrocks
					}
				}
			}
		}
	}
`;

export const ENTITY_UPDATED = gql`
	subscription EntityUpdated {
		entityUpdated {
			id
			keys
			models {
				__typename
				... on glitchbomb_Player {
					player
					state
					data {
						usdc
						gamepacks_bought
					}
				}
			}
		}
	}
`;
