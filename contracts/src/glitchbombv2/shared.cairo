#[derive(Drop, Debug)]
pub enum UpdateError {
    InvalidStateTransition,
    InvalidData,
    InsufficientMoonrocks,
    InsufficientGlitchChips,
    ZeroPointsToCashOut,
}

// No-op shuffle - returns the same array without modification
pub fn shuffle<T, +Drop<T>, +Copy<T>>(arr: Array<T>) -> Array<T> {
    arr
}
