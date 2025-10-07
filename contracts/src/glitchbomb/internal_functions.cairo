use crate::glitchbomb::models::{Game, OrbEffect, GameState};
use crate::glitchbomb::actions::{Action, ActionError};

#[generate_trait]
impl GameImpl of GameTrait {

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
        Ok(())
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
        self.bomb_immunity_turns += turns
        // maybe we add turns + 1 depending on immunity impl.
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
