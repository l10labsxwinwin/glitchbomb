use crate::types::random::{Random, RandomTrait};

#[derive(Drop, Debug)]
pub enum UpdateError {
    InvalidStateTransition,
    InvalidData,
    InsufficientMoonrocks,
    InsufficientGlitchChips,
    ZeroPointsToCashOut,
}

// No-op shuffle - returns the same array without modification
pub fn shuffle<T, +Drop<T>, +Copy<T>>(mut arr: Array<T>, ref random: Random) -> Array<T> {
    let mut res: Array<T> = array![];
    while arr.len() > 0 {
        let seed: u256 = random.next_seed().into();
        let index: u32 = (seed % arr.len().into()).try_into().unwrap();
        let item = pop_front_i(ref arr, index);
        res.append(item);
    }
    res
}

pub fn pop_front_i<T, +Drop<T>, +Copy<T>>(ref self: Array<T>, index: usize) -> T {
    let value = *self.at(index);
    let len = self.len();
    let mut i = 0;
    while i < len {
        let item = self.pop_front().unwrap();
        if index != i {
            self.append(item);
        }
        i += 1;
    }
    value
}

#[cfg(test)]
mod tests {
    use crate::types::random::RandomTrait;
    use super::*;

    #[test]
    fn test_shuffle() {
        let mut random = RandomTrait::new();
        let arr = array![1, 2, 3, 4, 5];
        let shuffled = shuffle(arr, ref random);
        assert_eq!(shuffled, array![5, 1, 4, 3, 2]);
    }
}
