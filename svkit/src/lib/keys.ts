export function getPlayerKey(player: string): string {
	return player;
}

export function getGamePackKey(player: string, gamepack_id: number): string {
	return `${player}-${gamepack_id}`;
}

export function getGameKey(player: string, gamepack_id: number, game_id: number): string {
	return `${player}-${gamepack_id}-${game_id}`;
}

export function getOrbsKey(player: string, gamepack_id: number, game_id: number): string {
	return `${player}-${gamepack_id}-${game_id}`;
}
