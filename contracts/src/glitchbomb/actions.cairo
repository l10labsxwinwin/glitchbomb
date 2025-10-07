#[derive(Drop, Serde, Debug, Default, Introspect, DojoStore)]
pub enum Action {
	#[default]
	NoAction,
    StartGame,
    PullOrb,
    CashOut,
    EnterShop,
    BuyOrb: u32,
    ConfirmFiveOrDie: bool,
    GoToNextLevel,
}

pub enum ActionError {
    InvalidActionInNewGame,
    InvalidActionInLevel,
    InvalidActionInLevelComplete,
    InvalidActionInFiveOrDiePhase,
    MilestoneNotMetYet,
    NoPointsToCashOut,
    InvalidActionInShop,
    OrbTooExpensive,
    BrokenErrorNonBuyableInShop,
    GameOver,
}
