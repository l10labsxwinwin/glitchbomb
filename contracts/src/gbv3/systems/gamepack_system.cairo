use starknet::ContractAddress;
use dojo::model::{ModelStorage};
use dojo::world::{WorldStorage};
use crate::gbv3::models::gamepack::{GamePack, new_gamepack_data};
use crate::gbv3::models::enums::GamePackState;
use crate::gbv3::types::GameError;

#[generate_trait]
pub impl GamePackSystemImpl of GamePackSystemTrait {
    fn create_gamepack(
        ref world: WorldStorage, player: ContractAddress, gamepack_id: u32,
    ) -> GamePack {
        let gamepack = GamePack {
            player,
            gamepack_id,
            state: GamePackState::Unopened,
            data: new_gamepack_data(),
        };
        world.write_model(@gamepack);
        gamepack
    }

    fn open_gamepack(ref gamepack: GamePack) -> Result<(), GameError> {
        if gamepack.state != GamePackState::Unopened {
            return Result::Err(GameError::InvalidStateTransition);
        }
        gamepack.state = GamePackState::InProgress;
        Result::Ok(())
    }

    fn complete_gamepack(ref gamepack: GamePack) -> Result<(), GameError> {
        if gamepack.state != GamePackState::InProgress {
            return Result::Err(GameError::InvalidStateTransition);
        }
        gamepack.state = GamePackState::Completed;
        Result::Ok(())
    }

    fn end_gamepack_early(ref gamepack: GamePack) -> Result<(), GameError> {
        if gamepack.state != GamePackState::InProgress {
            return Result::Err(GameError::InvalidStateTransition);
        }
        gamepack.state = GamePackState::EndedEarly;
        Result::Ok(())
    }

    fn save_gamepack(ref world: WorldStorage, gamepack: @GamePack) {
        world.write_model(gamepack);
    }
}
