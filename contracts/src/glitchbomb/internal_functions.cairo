use crate::glitchbomb::models::{Game, OrbEffect};

#[generate_trait]
impl GameImpl of GameTrait {

    fn apply_orb_effect(ref self: Game, effect: OrbEffect) {
        match effect {
            OrbEffect::Point(x) => self.handle_point_effect(x),
            OrbEffect::PointPerOrbRemaining(x) => self.handle_point_per_orb_remaining_effect(x),
            _ => {},
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
}
