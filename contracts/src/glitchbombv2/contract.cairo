#[starknet::interface]
pub trait PlayerActionsV2<T> {
    fn claim_free_usdc(ref self: T);
    fn buy_gamepack(ref self: T);
    fn start_game(ref self: T, gamepack_id: u32);
    fn cash_out(ref self: T, gamepack_id: u32);
    fn pull_orb(ref self: T, gamepack_id: u32);
    fn enter_shop(ref self: T, gamepack_id: u32);
    fn confirm_five_or_die(ref self: T, gamepack_id: u32, confirmed: bool);
    fn buy_orb(ref self: T, gamepack_id: u32, orb_id: u32);
    fn go_to_next_level(ref self: T, gamepack_id: u32);
}

#[dojo::contract]
pub mod gb_contract_v2 {
    use dojo::model::ModelStorage;
    use dojo::world::WorldStorage;
    use super::PlayerActionsV2;
    use starknet::get_caller_address;

    #[abi(embed_v0)]
    impl PlayerActionsV2Impl of PlayerActionsV2<ContractState> {
        fn claim_free_usdc(ref self: ContractState) {
        }

        fn buy_gamepack(ref self: ContractState) {
        }

        fn start_game(ref self: ContractState, gamepack_id: u32) {
        }

        fn cash_out(ref self: ContractState, gamepack_id: u32) {
        }

        fn pull_orb(ref self: ContractState, gamepack_id: u32) {
        }

        fn enter_shop(ref self: ContractState, gamepack_id: u32) {
        }

        fn confirm_five_or_die(ref self: ContractState, gamepack_id: u32, confirmed: bool) {
        }

        fn buy_orb(ref self: ContractState, gamepack_id: u32, orb_id: u32) {
        }

        fn go_to_next_level(ref self: ContractState, gamepack_id: u32) {
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        fn world_default(self: @ContractState) -> WorldStorage {
            self.world(@"glitchbomb")
        }
    }
}
