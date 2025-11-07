#[starknet::interface]
pub trait ICollection<TContractState> {
    fn mint(ref self: TContractState, to: starknet::ContractAddress, token_id: u256);
    fn burn(ref self: TContractState, token_id: u256);
}

pub fn NAME() -> ByteArray {
    "Collection"
}

pub const MINTER_ROLE: felt252 = selector!("MINTER_ROLE");

#[dojo::contract]
pub mod Collection {
    use alexandria_encoding::base64::Base64ByteArrayEncoder;
    use dojo::world::{WorldStorage, WorldStorageTrait};
    use openzeppelin::access::accesscontrol::{AccessControlComponent, DEFAULT_ADMIN_ROLE};
    use openzeppelin::access::ownable::OwnableComponent;
    use openzeppelin::introspection::src5::SRC5Component;
    use openzeppelin::token::erc721::interface::IERC721Metadata;
    use openzeppelin::token::erc721::{ERC721Component, ERC721HooksEmptyImpl};
    use starknet::ContractAddress;
    use crate::constants::NAMESPACE;
    use crate::glitchbombv2::contract::NAME as GAME_NAME;
    use crate::types::image::Image;
    use super::{ICollection, MINTER_ROLE};

    // Errors

    pub mod ERRORS {
        pub const COLLECTION_NOT_OWNER: felt252 = 'Collection: caller not owner';
    }

    // Components

    component!(path: AccessControlComponent, storage: accesscontrol, event: AccessControlEvent);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);
    component!(path: ERC721Component, storage: erc721, event: ERC721Event);
    component!(path: SRC5Component, storage: src5, event: SRC5Event);

    // AccessControl
    #[abi(embed_v0)]
    impl AccessControlImpl =
        AccessControlComponent::AccessControlImpl<ContractState>;
    impl AccessControlInternalImpl = AccessControlComponent::InternalImpl<ContractState>;

    // Ownable
    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    // ERC721
    #[abi(embed_v0)]
    impl ERC721Impl = ERC721Component::ERC721Impl<ContractState>;
    impl ERC721InternalImpl = ERC721Component::InternalImpl<ContractState>;

    #[storage]
    pub struct Storage {
        #[substorage(v0)]
        pub accesscontrol: AccessControlComponent::Storage,
        #[substorage(v0)]
        pub ownable: OwnableComponent::Storage,
        #[substorage(v0)]
        pub erc721: ERC721Component::Storage,
        #[substorage(v0)]
        pub src5: SRC5Component::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AccessControlEvent: AccessControlComponent::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event,
        #[flat]
        ERC721Event: ERC721Component::Event,
        #[flat]
        SRC5Event: SRC5Component::Event,
    }

    /// Assigns `owner` as the contract owner.
    /// Sets the token `name` and `symbol`.
    /// Mints the `token_ids` tokens to `recipient` and sets
    /// the base URI.
    fn dojo_init(ref self: ContractState) {
        // [Setup] World
        let world: WorldStorage = self.world(@NAMESPACE());
        // [Effect] Initialize components
        let deployer_account = starknet::get_tx_info().unbox().account_contract_address;
        self.accesscontrol.initializer();
        self.ownable.initializer(deployer_account);
        self.erc721.initializer("Glitch Bomb", "GLITCH-BOMB", "");
        // [Effect] Grant roles
        let game_address = world.dns_address(@GAME_NAME()).expect('Game contract not found!');
        self.accesscontrol._grant_role(DEFAULT_ADMIN_ROLE, deployer_account);
        self.accesscontrol._grant_role(MINTER_ROLE, game_address);
    }

    #[abi(embed_v0)]
    impl ERC721MetadataImpl of IERC721Metadata<ContractState> {
        fn name(self: @ContractState) -> ByteArray {
            self.erc721.name()
        }

        fn symbol(self: @ContractState) -> ByteArray {
            self.erc721.symbol()
        }

        fn token_uri(self: @ContractState, token_id: u256) -> ByteArray {
            // [Check] Token exists
            let owner = self.erc721.owner_of(token_id);
            if (owner.into() == 0) {
                return "";
            }
            // [Return] Token URI
            let name: ByteArray = format!("Glitch Bomb #{}", token_id);
            let description: ByteArray = "Glitch Bomb";
            let image: ByteArray = Base64ByteArrayEncoder::encode(Image::get());
            "data:application/json;base64,"
                + Base64ByteArrayEncoder::encode(
                    format!(
                        "{{\"name\": \"{}\", \"description\": \"{}\", \"image\": \"data:image/svg+xml;base64,{}\"}}",
                        name,
                        description,
                        image,
                    ),
                )
        }
    }

    #[abi(embed_v0)]
    impl CollectionImpl of ICollection<ContractState> {
        fn mint(ref self: ContractState, to: ContractAddress, token_id: u256) {
            // [Check] Only minter can mint
            self.accesscontrol.assert_only_role(MINTER_ROLE);
            // [Effect] Mint token
            self.erc721.mint(to, token_id)
        }

        fn burn(ref self: ContractState, token_id: u256) {
            // [Check] Only token owner can burn
            let owner = self.erc721.owner_of(token_id);
            assert(owner == starknet::get_caller_address(), ERRORS::COLLECTION_NOT_OWNER);
            // [Effect] Burn token
            self.erc721.burn(token_id)
        }
    }
}
