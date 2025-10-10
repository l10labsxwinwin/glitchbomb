use crate::glitchbomb::models::{Game, GamePack, GamePackState, OrbEffect, GameState, Orb, OrbRarity};
use crate::glitchbomb::actions::{Action, ActionError};
use starknet::ContractAddress;

#[generate_trait]
pub impl GamePackImpl of GamePackTrait {
    const PRICE: u32 = 1;

    fn new(player_id: ContractAddress, gamepack_id: u32) -> GamePack {
        GamePack {
            player_id,
            gamepack_id,
            gamepack_state: GamePackState::Unopened,
            current_game_id: 0,
            accumulated_moonrocks: 0,
        }
    }
}

#[generate_trait]
pub impl GameImpl of GameTrait {

    fn new(player_id: ContractAddress, gamepack_id: u32, game_id: u32) -> Game {
        Game {
            player_id,
            gamepack_id,
            game_id,
            game_state: GameState::Level,
            level: 1,
            points: 0,
            milestone: 12,
            hp: 5,
            max_hp: 5,
            multiplier: 100,
            glitch_chips: 0,
            moonrocks_spent: 10,
            moonrocks_earned: 0,
            orbs_for_sale_ids: [99, 99, 99, 99, 99, 99],
            pullable_orb_effects: ArrayTrait::new(),
            pulled_orbs_effects: ArrayTrait::new(),
            bomb_immunity_turns: 0,
            bombs_pulled_in_level: 0,
        }
    }

    fn apply_action(ref self: Game, action: Action) -> Result<(), ActionError> {
        match (@self.game_state, action) {
            // New game state
            (GameState::New, Action::StartGame) => self.handle_start_game(),
            (GameState::New, _) => Err(ActionError::InvalidActionInNewGame),

            // Level state
            (GameState::Level, Action::PullOrb) => self.handle_pull_orb(),
            (GameState::Level, Action::CashOut) => self.handle_cash_out(),
            (GameState::Level, _) => Err(ActionError::InvalidActionInLevel),

            // Level complete state
            (GameState::LevelComplete, Action::EnterShop) => self.handle_enter_shop(),
            (GameState::LevelComplete, Action::CashOut) => self.handle_cash_out(),
            (GameState::LevelComplete, _) => Err(ActionError::InvalidActionInLevelComplete),

            // Five or die phase
            (GameState::FiveOrDiePhase, Action::ConfirmFiveOrDie(confirmed)) => self.handle_confirm_five_or_die(confirmed),
            (GameState::FiveOrDiePhase, _) => Err(ActionError::InvalidActionInFiveOrDiePhase),

            // Shop state
            (GameState::Shop, Action::BuyOrb(orb_id)) => self.handle_buy_orb(orb_id),
            (GameState::Shop, Action::GoToNextLevel) => self.handle_go_to_next_level(),
            (GameState::Shop, _) => Err(ActionError::InvalidActionInShop),

            // Game over state
            (GameState::GameOver, _) => Err(ActionError::GameOver),
        }
    }

    fn handle_start_game(ref self: Game) -> Result<(), ActionError> {
        Ok(())
    }

    fn handle_pull_orb(ref self: Game) -> Result<(), ActionError> {
        if self.pullable_orb_effects.len() == 0 {
            return Err(ActionError::NoOrbsRemaining);
        }

        // TODO: have to shuffle the pullable orbs here before pulling an orb

        let mut new_pullable = ArrayTrait::new();
        let pulled_effect = *self.pullable_orb_effects[self.pullable_orb_effects.len() - 1];

        let mut i = 0;
        while i < self.pullable_orb_effects.len() - 1 {
            new_pullable.append(*self.pullable_orb_effects[i]);
            i += 1;
        };

        self.pullable_orb_effects = new_pullable;
        self.pulled_orbs_effects.append(pulled_effect);
        self.apply_orb_effect(pulled_effect);

        if self.bomb_immunity_turns > 0 {
            self.bomb_immunity_turns -= 1;
        }

        if self.points >= self.milestone {
            self.game_state = GameState::LevelComplete;
        }

        if self.hp == 0 {
            self.game_state = GameState::GameOver;
        }

        Ok(())
    }

    fn handle_cash_out(ref self: Game) -> Result<(), ActionError> {
        Ok(())
    }

    fn handle_enter_shop(ref self: Game) -> Result<(), ActionError> {
        Ok(())
    }

    fn handle_buy_orb(ref self: Game, orb_id: u32) -> Result<(), ActionError> {
        Ok(())
    }

    fn handle_confirm_five_or_die(ref self: Game, confirmed: bool) -> Result<(), ActionError> {
        match @confirmed {
            true => {
                // Apply +1x (100) multiplier bonus for the duration of the five pulls
                self.multiplier += 100;

                // Pull and apply 5 orbs
                let mut orbs_pulled: u32 = 0;
                while orbs_pulled < 5 {
                    // Check if player is already dead - stop pulling if so
                    if self.hp == 0 {
                        break;
                    }

                    // Pull the orb from the front using pop_front
                    match self.pullable_orb_effects.pop_front() {
                        Option::Some(pulled_effect) => {
                            // If we pull another FiveOrDie orb, put it back and don't count it
                            match pulled_effect {
                                OrbEffect::FiveOrDie => {
                                    self.pullable_orb_effects.append(pulled_effect);
                                },
                                _ => {
                                    self.pulled_orbs_effects.append(pulled_effect);

                                    // Apply the orb effect
                                    self.apply_orb_effect(pulled_effect);

                                    // Decrement bomb immunity if active
                                    if self.bomb_immunity_turns > 0 {
                                        self.bomb_immunity_turns -= 1;
                                    }

                                    orbs_pulled += 1;
                                }
                            }
                        },
                        Option::None => {
                            // No more orbs to pull
                            break;
                        }
                    }
                }

                // Restore the multiplier to its original value
                self.multiplier -= 100;

                // Set game state based on final state after all pulls
                if self.hp == 0 {
                    self.game_state = GameState::GameOver;
                } else if self.points >= self.milestone {
                    self.game_state = GameState::LevelComplete;
                } else {
                    self.game_state = GameState::Level;
                }

                Ok(())
            },
            false => {
                self.game_state = GameState::Level;
                Ok(())
            }
        }
    }

    fn handle_go_to_next_level(ref self: Game) -> Result<(), ActionError> {
        Ok(())
    }

    fn apply_orb_effect(ref self: Game, effect: OrbEffect) {
        match effect {
            OrbEffect::Point(points) => self.handle_point_effect(points),
            OrbEffect::PointPerOrbRemaining(point_per_orb) => self.handle_point_per_orb_remaining_effect(point_per_orb),
            OrbEffect::PointPerBombPulled(point_per_bomb) => self.handle_point_per_bomb_pulled_effect(point_per_bomb),
            OrbEffect::GlitchChips(chips) => self.handle_glitch_chips_effect(chips),
            OrbEffect::Moonrocks(moonrocks) => self.handle_moonrocks_effect(moonrocks),
            OrbEffect::Health(health) => self.handle_health_effect(health),
            OrbEffect::Bomb(damage) => self.handle_bomb_effect(damage),
            OrbEffect::Multiplier(multiplier) => self.handle_multiplier_effect(multiplier),
            OrbEffect::BombImmunity(turns) => self.handle_bomb_immunity_effect(turns),
            OrbEffect::PointRewind => self.handle_point_rewind_effect(),
            OrbEffect::FiveOrDie => self.handle_five_or_die_effect(),
            OrbEffect::Empty => {},
        }
    }

    fn handle_point_effect(ref self: Game, points: u32) {
        let total_points = points * self.multiplier / 100;
        self.points += total_points;
    }

    fn handle_point_per_orb_remaining_effect(ref self: Game, point_per_orb: u32) {
        let num_orbs = self.pullable_orb_effects.len();
        let total_points = (num_orbs * point_per_orb * self.multiplier / 100);
        self.points += total_points;
    }

    fn handle_point_per_bomb_pulled_effect(ref self: Game, point_per_bomb: u32) {
        let total_points = self.bombs_pulled_in_level * point_per_bomb * self.multiplier / 100;
        self.points += total_points;
    }

    fn handle_glitch_chips_effect(ref self: Game, chips: u32) {
        self.glitch_chips += chips;
    }

    fn handle_moonrocks_effect(ref self: Game, moonrocks: u32) {
        self.moonrocks_earned += moonrocks;
    }

    fn handle_health_effect(ref self: Game, health: u32) {
        self.hp = if self.hp + health > self.max_hp {
            self.max_hp
        } else {
            self.hp + health
        };
    }

    fn handle_bomb_effect(ref self: Game, damage: u32) {
        if self.bomb_immunity_turns > 0 {
            // uncomment if we count pulled bombs even during immunity
            // self.bombs_pulled_in_level += 1;
            return;
        }

        if damage >= self.hp {
            self.hp = 0;
        } else {
            self.hp -= damage;
        }
        self.bombs_pulled_in_level += 1;
    }

    fn handle_multiplier_effect(ref self: Game, multiplier: u32) {
        self.multiplier += multiplier;
    }

    fn handle_bomb_immunity_effect(ref self: Game, turns: u32) {
        self.bomb_immunity_turns += turns + 1;
    }

    fn handle_point_rewind_effect(ref self: Game) {
        let mut lowest_point_orb: Option<OrbEffect> = Option::None;
        let mut lowest_point_value: u32 = 9999;

        // Find the lowest Point orb
        for effect in self.pulled_orbs_effects.span() {
            if let OrbEffect::Point(points) = *effect {
                if points < lowest_point_value {
                    lowest_point_value = points;
                    lowest_point_orb = Option::Some(*effect);
                }
            }
        }

        // If found, rebuild pulled_orbs_effects without it and add back to pullable
        if let Option::Some(orb_to_return) = lowest_point_orb {
            let mut new_pulled = ArrayTrait::new();
            let mut removed_one = false;

            for effect in self.pulled_orbs_effects.span() {
                if !removed_one && *effect == orb_to_return {
                    removed_one = true;
                } else {
                    new_pulled.append(*effect);
                }
            }

            self.pulled_orbs_effects = new_pulled;
            self.pullable_orb_effects.append(orb_to_return);
        }
    }

    fn handle_five_or_die_effect(ref self: Game) {
        self.game_state = GameState::FiveOrDiePhase;
    }
}


#[generate_trait]
pub impl AllOrbImpl of AllOrbTrait {
    fn new(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        effect: OrbEffect,
        rarity: OrbRarity,
        count: u32,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Orb {
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            effect,
            rarity,
            count,
            is_buyable,
            base_price,
            current_price: base_price,
        }
    }

    fn bomb(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        damage: u32,
        count: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::Bomb(damage),
            OrbRarity::Common,
            count,
            false,
            0,
        )
    }

    fn point(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        points: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::Point(points),
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn point_per_orb_remaining(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        points_per_orb: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::PointPerOrbRemaining(points_per_orb),
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn point_per_bomb_pulled(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        points_per_bomb: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::PointPerBombPulled(points_per_bomb),
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn glitch_chips(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        chips: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::GlitchChips(chips),
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn moonrocks(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        amount: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::Moonrocks(amount),
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn health(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        hp: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::Health(hp),
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn multiplier(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        mult: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::Multiplier(mult),
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn point_rewind(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::PointRewind,
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn five_or_die(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::FiveOrDie,
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn bomb_immunity(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
        orb_id: u32,
        count: u32,
        rarity: OrbRarity,
        is_buyable: bool,
        base_price: u32,
    ) -> Orb {
        Self::new(
            player_id,
            gamepack_id,
            game_id,
            orb_id,
            OrbEffect::BombImmunity(3),
            rarity,
            count,
            is_buyable,
            base_price,
        )
    }

    fn is_common(self: @Orb) -> bool {
        match self.rarity {
            OrbRarity::Common => true,
            _ => false,
        }
    }

    fn is_rare(self: @Orb) -> bool {
        match self.rarity {
            OrbRarity::Rare => true,
            _ => false,
        }
    }

    fn is_cosmic(self: @Orb) -> bool {
        match self.rarity {
            OrbRarity::Cosmic => true,
            _ => false,
        }
    }

    fn all_orbs(
        player_id: ContractAddress,
        gamepack_id: u32,
        game_id: u32,
    ) -> [Orb; 21] {
        [
            // non-buyables (orb_id 0-3)
            Self::bomb(player_id, gamepack_id, game_id, 0, 1, 2),
            Self::bomb(player_id, gamepack_id, game_id, 1, 2, 1),
            Self::bomb(player_id, gamepack_id, game_id, 2, 3, 1),
            Self::point_per_orb_remaining(player_id, gamepack_id, game_id, 3, 1, 1, OrbRarity::Common, false, 0),
            // common buyables (orb_id 4-12)
            Self::point(player_id, gamepack_id, game_id, 4, 5, 3, OrbRarity::Common, true, 5),
            Self::glitch_chips(player_id, gamepack_id, game_id, 5, 15, 0, OrbRarity::Common, true, 5),
            Self::five_or_die(player_id, gamepack_id, game_id, 6, 0, OrbRarity::Common, true, 5),
            Self::point_per_bomb_pulled(player_id, gamepack_id, game_id, 7, 4, 1, OrbRarity::Common, true, 6),
            Self::point(player_id, gamepack_id, game_id, 8, 7, 0, OrbRarity::Common, true, 8),
            Self::moonrocks(player_id, gamepack_id, game_id, 9, 15, 0, OrbRarity::Common, true, 8),
            Self::point_rewind(player_id, gamepack_id, game_id, 10, 0, OrbRarity::Common, true, 8),
            Self::multiplier(player_id, gamepack_id, game_id, 11, 50, 0, OrbRarity::Common, true, 9),
            Self::health(player_id, gamepack_id, game_id, 12, 1, 1, OrbRarity::Common, true, 9),
            // rare buyables (orb_id 13-17)
            Self::point(player_id, gamepack_id, game_id, 13, 8, 0, OrbRarity::Rare, true, 11),
            Self::point(player_id, gamepack_id, game_id, 14, 9, 0, OrbRarity::Rare, true, 13),
            Self::multiplier(player_id, gamepack_id, game_id, 15, 100, 1, OrbRarity::Rare, true, 14),
            Self::point_per_orb_remaining(player_id, gamepack_id, game_id, 16, 2, 0, OrbRarity::Rare, true, 15),
            Self::multiplier(player_id, gamepack_id, game_id, 17, 150, 0, OrbRarity::Rare, true, 16),
            // cosmic buyables (orb_id 18-20)
            Self::health(player_id, gamepack_id, game_id, 18, 3, 0, OrbRarity::Cosmic, true, 21),
            Self::moonrocks(player_id, gamepack_id, game_id, 19, 40, 0, OrbRarity::Cosmic, true, 23),
            Self::bomb_immunity(player_id, gamepack_id, game_id, 20, 0, OrbRarity::Cosmic, true, 24),
        ]
    }
}
