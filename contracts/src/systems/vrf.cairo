pub fn NAME() -> ByteArray {
    "VRF"
}

#[dojo::contract]
mod VRF {
    use starknet::ContractAddress;
    use crate::interfaces::vrf::Source;
    use crate::types::random::RandomTrait;

    #[storage]
    pub struct Storage {}

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {}

    #[generate_trait]
    #[abi(per_item)]
    impl ExternalImpl of ExternalTrait {
        #[external(v0)]
        fn request_random(ref self: ContractState, caller: ContractAddress, source: Source) {}

        #[external(v0)]
        fn consume_random(ref self: ContractState, source: Source) -> felt252 {
            let mut random = RandomTrait::new();
            random.felt()
        }

        #[external(v0)]
        fn assert_consumed(ref self: ContractState, source: Source) {}
    }
}
