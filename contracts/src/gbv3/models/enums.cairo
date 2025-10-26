#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum PlayerState {
    #[default]
    Broke,
    Stacked,
}

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum GamePackState {
    #[default]
    Unopened,
    InProgress,
    EndedEarly,
    Completed,
}

#[derive(Drop, Serde, Debug, Copy, PartialEq, Introspect, DojoStore, Default)]
pub enum GameState {
    #[default]
    New,
    Level,
    LevelComplete,
    FiveOrDiePhase,
    Shop,
    GameOver,
}

#[derive(Copy, Drop, Serde, Debug, Introspect, PartialEq, DojoStore, Default)]
pub enum OrbEffect {
    #[default]
    Empty,
    PointRewind,
    FiveOrDie,
    Point: u32,
    PointPerOrbRemaining: u32,
    PointPerBombPulled: u32,
    GlitchChips: u32,
    Moonrocks: u32,
    Health: u32,
    Bomb: u32,
    Multiplier: u32,
    BombImmunity: u32,
}
