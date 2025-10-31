use starknet::ContractAddress;

#[derive(Drop, Serde)]
#[dojo::model]
pub struct Config {
    #[key]
    pub id: felt252,
    pub collection: ContractAddress,
    pub token: ContractAddress,
    pub vrf: ContractAddress,
}

#[generate_trait]
pub impl ConfigImpl of ConfigTrait {
    #[inline]
    fn new(
        id: felt252, collection: ContractAddress, token: ContractAddress, vrf: ContractAddress,
    ) -> Config {
        Config { id: id, collection: collection, token: token, vrf: vrf }
    }
}
