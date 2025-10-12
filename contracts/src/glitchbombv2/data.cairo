#[derive(Drop, Serde, Debug, Copy, Introspect, Default)]
pub struct PlayerData {
    pub usdc: u32,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, Default)]
pub struct GamePackData {
}

#[derive(Drop, Serde, Debug, Copy, Introspect, Default)]
pub struct GameData {
}
