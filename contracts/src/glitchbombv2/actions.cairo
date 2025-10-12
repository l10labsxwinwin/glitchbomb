#[derive(Drop, Serde, Debug, Copy)]
pub enum PlayerAction {
    ClaimFreeUsdc,
    BuyGamePack,
}

#[derive(Drop, Serde, Debug, Copy)]
pub enum GamePackAction {
    StartGame,
    CashOut,
}

#[derive(Drop, Serde, Debug, Copy)]
pub enum GameAction {
    PullOrb,
    EnterShop,
    ConfirmFiveOrDie: bool,
    BuyOrb: u32,
    GoToNextLevel,
    CashOut,
}
