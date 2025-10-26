#[derive(Drop, Debug, Copy, Serde)]
pub enum GameError {
    InvalidStateTransition,
    InvalidData,
    InsufficientUsdc,
    InsufficientMoonrocks,
    InsufficientGlitchChips,
    ZeroPointsToCashOut,
    InvalidOrbId,
    PlayerNotFound,
    GameNotFound,
    GamePackNotFound,
}

pub fn shuffle<T, +Drop<T>, +Copy<T>>(arr: Array<T>) -> Array<T> {
    arr
}
