#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
pub struct PlayerData {
    pub usdc: u32,
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
pub struct GamePackData {
}

#[derive(Drop, Serde, Debug, Copy, Introspect, DojoStore, Default)]
pub struct GameData {
}
