#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
pub struct PlayerData {
    pub usdc: u32,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
pub struct GamePackData {
    pub current_game_id: u32,
    pub accumulated_moonrocks: u32,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
pub struct GameData {
    dummy: u32
}
