export function getPlayerKey(player_id: string): string {
	return player_id;
}

export function getGamePackKey(player_id: string, gamepack_id: number): string {
	return `${player_id}-${gamepack_id}`;
}

export function getGameKey(player_id: string, gamepack_id: number, game_id: number): string {
	return `${player_id}-${gamepack_id}-${game_id}`;
}

export function getOrbsKey(player_id: string, gamepack_id: number, game_id: number): string {
	return `${player_id}-${gamepack_id}-${game_id}`;
}
