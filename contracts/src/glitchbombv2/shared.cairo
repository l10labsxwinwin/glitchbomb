use super::player::PlayerState;
use super::gamepack::GamePackState;
use super::game::GameState;
use core::poseidon::poseidon_hash_span;

// ============================================================================
// Shared Update Error
// ============================================================================

#[derive(Drop, Debug)]
pub enum UpdateError {
    InvalidStateTransition,
    InvalidData,
    InsufficientMoonrocks,
    InsufficientGlitchChips,
    ZeroPointsToCashOut,
}

// ============================================================================
// Helper Functions
// ============================================================================

// Constant seed for pseudorandom operations
// This can be changed to any value for different shuffling behavior
const SHUFFLE_SEED: felt252 = 0x123456789abcdef;

// Generate a pseudorandom index using Poseidon hash
// Uses seed and nonce to generate deterministic but unpredictable values
fn generate_random_index(seed: felt252, nonce: u32, max: u32) -> u32 {
    if max == 0 {
        return 0;
    }

    // Hash the seed with nonce to get a pseudorandom value
    let hash = poseidon_hash_span(array![seed, nonce.into()].span());

    // Convert to u256 for modulo operation
    let hash_u256: u256 = hash.into();
    let max_u256: u256 = max.into();

    // Return random index in range [0, max)
    let result: u32 = (hash_u256 % max_u256).try_into().unwrap();
    result
}

// Pseudorandom shuffle using Fisher-Yates algorithm with a constant seed
// Note: This is pseudorandom and deterministic - for production, consider VRF
pub fn shuffle<T, +Drop<T>, +Copy<T>>(arr: Array<T>) -> Array<T> {
    let len = arr.len();

    // Arrays with 0 or 1 elements are already "shuffled"
    if len <= 1 {
        return arr;
    }

    // Convert input array to span for reading
    let input_span = arr.span();

    // Initialize remaining elements (all indices initially available)
    let mut remaining: Array<T> = ArrayTrait::new();
    let mut i: u32 = 0;
    while i < len {
        remaining.append(*input_span[i]);
        i += 1;
    };

    // Build shuffled result using Fisher-Yates
    let mut result: Array<T> = ArrayTrait::new();
    let mut remaining_count = len;
    let mut shuffle_iteration: u32 = 0;

    while remaining_count > 0 {
        // Generate random index in range [0, remaining_count)
        let random_index = generate_random_index(SHUFFLE_SEED, shuffle_iteration, remaining_count);

        // Pick the element at random_index
        let remaining_span = remaining.span();
        let picked_element = *remaining_span[random_index];
        result.append(picked_element);

        // Remove picked element by rebuilding remaining array without it
        let mut new_remaining: Array<T> = ArrayTrait::new();
        let mut j: u32 = 0;
        while j < remaining_count {
            if j != random_index {
                new_remaining.append(*remaining_span[j]);
            }
            j += 1;
        };
        remaining = new_remaining;

        remaining_count -= 1;
        shuffle_iteration += 1;
    };

    result
}

// ============================================================================
// Legacy Cross-Cutting Validation
// ============================================================================

#[derive(Drop, Serde, Debug, Copy)]
pub enum Action {
    ClaimFreeUsdc,
    BuyGamepack,
    StartGame,
    CashOut,
    PullOrb,
    EnterShop,
    ConfirmFiveOrDie: bool,
    BuyOrb: u32,
    GoToNextLevel,
}

#[derive(Drop, Debug)]
pub enum ActionError {
    InvalidPlayerState,
    PlayerIsBroke,
    PlayerIsAlreadyStacked,
    InvalidGamePackState,
    GamePackDNE,
    GameDNE,
    InvalidGameState,
    InvalidActionInNewGame,
    InvalidActionInLevel,
    InvalidActionInLevelComplete,
    InvalidActionInFiveOrDiePhase,
    InvalidActionInShop,
    GameOver,
    UnhandledError,
}

pub fn validate_action(
    player_state: PlayerState,
    gamepack_state: GamePackState,
    game_state: GameState,
    action: Action
) -> Result<(), ActionError> {
    match (player_state, gamepack_state, game_state, action) {
        (PlayerState::Broke, _, _, Action::ClaimFreeUsdc) => Ok(()),
        (PlayerState::Stacked, _, _, Action::BuyGamepack) => Ok(()),
        (_, GamePackState::Unopened, GameState::New, Action::StartGame) => Ok(()),
        (_, GamePackState::InProgress, GameState::New, Action::StartGame) => Ok(()),
        (_, GamePackState::InProgress, GameState::Level, Action::PullOrb) => Ok(()),
        (_, GamePackState::InProgress, GameState::Level, Action::CashOut) => Ok(()),
        (_, GamePackState::InProgress, GameState::LevelComplete, Action::EnterShop) => Ok(()),
        (_, GamePackState::InProgress, GameState::LevelComplete, Action::CashOut) => Ok(()),
        (_, GamePackState::InProgress, GameState::FiveOrDiePhase, Action::ConfirmFiveOrDie(_)) => Ok(()),
        (_, GamePackState::InProgress, GameState::Shop, Action::BuyOrb(_)) => Ok(()),
        (_, GamePackState::InProgress, GameState::Shop, Action::GoToNextLevel) => Ok(()),

        (PlayerState::Broke, _, _, Action::BuyGamepack) => Err(ActionError::PlayerIsBroke),
        (PlayerState::Stacked, _, _, Action::ClaimFreeUsdc) => Err(ActionError::PlayerIsAlreadyStacked),
        (_, GamePackState::Empty, _, _) => Err(ActionError::GamePackDNE),
        (_, _, GameState::Empty, _) => Err(ActionError::GameDNE),
        (_, GamePackState::Unopened, _, _) => Err(ActionError::InvalidGamePackState),
        (_, GamePackState::EndedEarly, _, _) => Err(ActionError::InvalidGamePackState),
        (_, GamePackState::Completed, _, _) => Err(ActionError::InvalidGamePackState),
        (_, GamePackState::InProgress, GameState::New, _) => Err(ActionError::InvalidActionInNewGame),
        (_, GamePackState::InProgress, GameState::Level, _) => Err(ActionError::InvalidActionInLevel),
        (_, GamePackState::InProgress, GameState::LevelComplete, _) => Err(ActionError::InvalidActionInLevelComplete),
        (_, GamePackState::InProgress, GameState::FiveOrDiePhase, _) => Err(ActionError::InvalidActionInFiveOrDiePhase),
        (_, GamePackState::InProgress, GameState::Shop, _) => Err(ActionError::InvalidActionInShop),
        (_, GamePackState::InProgress, GameState::GameOver, _) => Err(ActionError::GameOver),
    }
}
