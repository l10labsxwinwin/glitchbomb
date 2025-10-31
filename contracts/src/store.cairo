use dojo::model::ModelStorage;
use dojo::world::WorldStorage;
use crate::interfaces::vrf::IVrfProviderDispatcher;
use crate::models::index::Game;

#[derive(Drop)]
pub struct Store {
    pub world: WorldStorage,
}

#[generate_trait]
pub impl StoreImpl of StoreTrait {
    fn new(world: WorldStorage) -> Store {
        Store { world }
    }

    //  Dispatchers

    fn vrf(ref self: Store) -> IVrfProviderDispatcher {
        let config = self.config();
        IVrfProviderDispatcher { contract_address: config.vrf }
    }

    // Game

    fn game(ref self: Store, game_id: u64) -> Game {
        self.world.read_model(game_id)
    }

    fn set_game(ref self: Store, game: @Game) {
        self.world.write_model(game)
    }
}
