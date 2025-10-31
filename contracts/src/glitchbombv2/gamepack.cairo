use starknet::ContractAddress;
use super::constants::{INITIAL_GAME_ID, INITIAL_MOONROCKS, MAX_GAMES_PER_PACK};
use super::player::Player;
use super::shared::UpdateError;

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum GamePackState {
    #[default]
    Empty,
    Unopened,
    InProgress,
    EndedEarly,
    Completed,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore)]
pub struct GamePackData {
    pub current_game_id: u32,
    pub accumulated_moonrocks: u32,
}

pub fn new_gamepack_data() -> GamePackData {
    GamePackData { current_game_id: INITIAL_GAME_ID, accumulated_moonrocks: INITIAL_MOONROCKS }
}

#[derive(Drop, Serde, Debug, Copy)]
pub enum GamePackAction {
    OpenPack,
    NextGame,
    SubmitScore,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct GamePack {
    #[key]
    pub player_id: ContractAddress,
    #[key]
    pub gamepack_id: u32,
    pub state: GamePackState,
    pub data: GamePackData,
}

#[generate_trait]
pub impl GamePackImpl of GamePackTrait {
    fn create_for_player(ref player: Player, player_id: ContractAddress) -> GamePack {
        player.gamepacks_bought += 1;

        GamePack {
            player_id,
            gamepack_id: player.gamepacks_bought,
            state: GamePackState::Unopened,
            data: new_gamepack_data(),
        }
    }
}

fn handle_open_pack(data: GamePackData) -> Result<(GamePackState, GamePackData), UpdateError> {
    Ok((GamePackState::InProgress, data))
}

fn handle_next_game(data: GamePackData) -> Result<(GamePackState, GamePackData), UpdateError> {
    let next_game_id = data.current_game_id + 1;
    if next_game_id > MAX_GAMES_PER_PACK {
        Ok((GamePackState::Completed, data))
    } else {
        let mut new_data = data;
        new_data.current_game_id = next_game_id;
        Ok((GamePackState::InProgress, new_data))
    }
}

fn handle_submit_score(data: GamePackData) -> Result<(GamePackState, GamePackData), UpdateError> {
    match data.current_game_id == MAX_GAMES_PER_PACK {
        true => Ok((GamePackState::Completed, data)),
        false => Err(UpdateError::InvalidData),
    }
}

pub fn update_gamepack(
    state: GamePackState, data: GamePackData, action: GamePackAction,
) -> Result<(GamePackState, GamePackData), UpdateError> {
    match (state, action) {
        (GamePackState::Unopened, GamePackAction::OpenPack) => handle_open_pack(data),
        (GamePackState::InProgress, GamePackAction::NextGame) => handle_next_game(data),
        (GamePackState::InProgress, GamePackAction::SubmitScore) => handle_submit_score(data),
        _ => Err(UpdateError::InvalidStateTransition),
    }
}
