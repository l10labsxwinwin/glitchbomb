use starknet::ContractAddress;
use dojo::model::{ModelStorage};
use dojo::world::{WorldStorage};
use crate::gbv3::models::game::{Game, GameData, new_game_data};
use crate::gbv3::models::enums::GameState;
use crate::gbv3::types::GameError;
use crate::gbv3::constants::{level_cost_in_moonrocks, milestones};

#[generate_trait]
pub impl GameSystemImpl of GameSystemTrait {
    fn create_game(
        ref world: WorldStorage,
        player: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        temp_moonrocks: u32,
    ) -> Game {
        let mut game_data = new_game_data();
        game_data.temp_moonrocks = temp_moonrocks;

        let game = Game { player, gamepack_id, game_id, state: GameState::New, data: game_data };
        world.write_model(@game);
        game
    }

    fn start_game(ref game: Game) -> Result<(), GameError> {
        if game.state != GameState::New {
            return Result::Err(GameError::InvalidStateTransition);
        }

        let game_cost = level_cost_in_moonrocks(game.data.level);
        if game.data.temp_moonrocks < game_cost {
            return Result::Err(GameError::InsufficientMoonrocks);
        }

        game.data.moonrocks_spent += game_cost;
        game.state = GameState::Level;
        Result::Ok(())
    }

    fn end_game(ref game: Game) -> Result<(), GameError> {
        game.state = GameState::GameOver;
        Result::Ok(())
    }

    fn transition_to_level_complete(ref game: Game) -> Result<(), GameError> {
        if game.state != GameState::Level {
            return Result::Err(GameError::InvalidStateTransition);
        }
        game.state = GameState::LevelComplete;
        Result::Ok(())
    }

    fn transition_to_shop(ref game: Game) -> Result<(), GameError> {
        if game.state != GameState::LevelComplete {
            return Result::Err(GameError::InvalidStateTransition);
        }
        game.state = GameState::Shop;
        Result::Ok(())
    }

    fn transition_to_five_or_die(ref game: Game) -> Result<(), GameError> {
        if game.state != GameState::Level {
            return Result::Err(GameError::InvalidStateTransition);
        }
        game.state = GameState::FiveOrDiePhase;
        Result::Ok(())
    }

    fn advance_to_next_level(ref game: Game, glitch_chips: u32) -> Result<(), GameError> {
        if game.state != GameState::Shop {
            return Result::Err(GameError::InvalidStateTransition);
        }

        let next_level = game.data.level + 1;
        let temp_moonrocks = game.data.temp_moonrocks;
        let moonrocks_spent = game.data.moonrocks_spent;
        let moonrocks_earned = game.data.moonrocks_earned;

        game.data = new_game_data();
        game.data.level = next_level;
        game.data.milestone = milestones(next_level);
        game.data.glitch_chips = glitch_chips;
        game.data.temp_moonrocks = temp_moonrocks;
        game.data.moonrocks_spent = moonrocks_spent;
        game.data.moonrocks_earned = moonrocks_earned;
        game.state = GameState::Level;

        Result::Ok(())
    }

    fn save_game(ref world: WorldStorage, game: @Game) {
        world.write_model(game);
    }
}
