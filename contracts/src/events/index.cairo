use crate::glitchbombv2::game::{GameData, GameState};

#[dojo::event]
pub struct GameEvent {
    #[key]
    pub gamepack_id: u32,
    #[key]
    pub game_id: u32,
    #[key]
    pub tick: u32,
    pub state: GameState,
    pub data: GameData,
}
