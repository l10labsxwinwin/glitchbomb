use dojo_starter::glitchbomb_models::{Player, Gamepack, Game, GamepackState, GameState};
use starknet::ContractAddress;

// Library functions for glitchbomb game logic
// These are composable functions that can be used to build contract actions

// Initialize a new player with starting moonrocks
pub fn initialize_player(address: ContractAddress, initial_moonrocks: u128) -> Player {
    Player {
        address,
        moonrocks: initial_moonrocks,
        current_gamepack_id: 0,
    }
}

// Create a new gamepack for a player
// Returns the new gamepack in Active state with 0 games played
pub fn create_gamepack(player: ContractAddress, gamepack_id: u32) -> Gamepack {
    Gamepack {
        player,
        gamepack_id,
        state: GamepackState::Active,
        games_played: 0,
    }
}

// Create a single game component for a gamepack
// Each gamepack needs 10 of these (game_id 0-9)
pub fn create_game(player: ContractAddress, gamepack_id: u32, game_id: u8) -> Game {
    Game {
        player,
        gamepack_id,
        game_id,
        state: GameState::Unplayed,
    }
}

// Check if player can purchase a new gamepack
// Returns true if current gamepack is Completed or if this is their first gamepack
pub fn can_buy_gamepack(player: Player, current_gamepack: Gamepack) -> bool {
    // If current_gamepack_id is 0, this is the first purchase
    if player.current_gamepack_id == 0 {
        return true;
    }

    // Otherwise, current gamepack must be Completed
    current_gamepack.state == GamepackState::Completed
}

// Deduct moonrocks from player for gamepack purchase
pub fn deduct_moonrocks(mut player: Player, cost: u128) -> Player {
    player.moonrocks -= cost;
    player
}

// Increment player's current gamepack counter
pub fn increment_gamepack_id(mut player: Player) -> Player {
    player.current_gamepack_id += 1;
    player
}

// Mark a game as played
pub fn mark_game_played(mut game: Game) -> Game {
    game.state = GameState::Played;
    game
}

// Increment the games_played counter on a gamepack
pub fn increment_games_played(mut gamepack: Gamepack) -> Gamepack {
    gamepack.games_played += 1;
    gamepack
}

// Transition gamepack to Completed state
pub fn complete_gamepack(mut gamepack: Gamepack) -> Gamepack {
    gamepack.state = GamepackState::Completed;
    gamepack
}

// Check if a game can be played
// Returns true if game is Unplayed and gamepack is Active
pub fn can_play_game(game: Game, gamepack: Gamepack) -> bool {
    game.state == GameState::Unplayed && gamepack.state == GamepackState::Active
}

// Check if gamepack should transition to Completed
pub fn is_gamepack_complete(gamepack: Gamepack) -> bool {
    gamepack.games_played >= 10
}

// Validate game_id is within valid range (0-9)
pub fn is_valid_game_id(game_id: u8) -> bool {
    game_id < 10
}
