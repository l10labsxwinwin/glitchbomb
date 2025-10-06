#[cfg(test)]
mod tests {
    use dojo_starter::glitchbomb_models::{Player, Gamepack, Game, GamepackState, GameState};
    use dojo_starter::systems::glitchbomb_actions::{
        initialize_player, create_gamepack, create_game, can_buy_gamepack, deduct_moonrocks,
        increment_gamepack_id, mark_game_played, increment_games_played, complete_gamepack,
        can_play_game, is_gamepack_complete, is_valid_game_id
    };
    use starknet::ContractAddress;

    // Test Chain 1: Initialize Player + Buy First Gamepack
    // This chain will be used in a "buy_gamepack" contract action
    #[test]
    fn test_chain_initialize_and_buy_first_gamepack() {
        let player_address: ContractAddress = 0x123.try_into().unwrap();
        let gamepack_cost: u128 = 100;

        // Step 1: Initialize player with moonrocks
        let mut player = initialize_player(player_address, 1000);
        assert(player.moonrocks == 1000, 'initial moonrocks wrong');
        assert(player.current_gamepack_id == 0, 'initial gamepack_id wrong');

        // Step 2: Check can buy first gamepack (should be true even with default gamepack)
        let default_gamepack = create_gamepack(player_address, 0);
        assert(can_buy_gamepack(player, default_gamepack), 'should allow first purchase');

        // Step 3: Deduct moonrocks for purchase
        player = deduct_moonrocks(player, gamepack_cost);
        assert(player.moonrocks == 900, 'moonrocks not deducted');

        // Step 4: Increment gamepack_id before creating gamepack
        player = increment_gamepack_id(player);
        assert(player.current_gamepack_id == 1, 'gamepack_id not incremented');

        // Step 5: Create the gamepack
        let gamepack = create_gamepack(player_address, player.current_gamepack_id);
        assert(gamepack.gamepack_id == 1, 'gamepack_id wrong');
        assert(gamepack.state == GamepackState::Active, 'gamepack not active');
        assert(gamepack.games_played == 0, 'games_played not zero');

        // Step 6: Create 10 game components (this would be a loop in the contract)
        let mut game_id: u8 = 0;
        loop {
            if game_id >= 10 {
                break;
            }

            let game = create_game(player_address, gamepack.gamepack_id, game_id);
            assert(game.gamepack_id == 1, 'game gamepack_id wrong');
            assert(game.game_id == game_id, 'game_id wrong');
            assert(game.state == GameState::Unplayed, 'game not unplayed');

            game_id += 1;
        };
    }

    // Test Chain 2: Play Games Until Completion
    // This chain will be used in a "play_game" contract action
    #[test]
    fn test_chain_play_games_to_completion() {
        let player_address: ContractAddress = 0x123.try_into().unwrap();

        // Setup: Create active gamepack with games
        let mut gamepack = create_gamepack(player_address, 1);

        // Play all 10 games
        let mut game_id: u8 = 0;
        loop {
            if game_id >= 10 {
                break;
            }

            // Step 1: Validate game_id
            assert(is_valid_game_id(game_id), 'invalid game_id');

            // Step 2: Create and check game can be played
            let mut game = create_game(player_address, gamepack.gamepack_id, game_id);
            assert(can_play_game(game, gamepack), 'cannot play game');

            // Step 3: Mark game as played
            game = mark_game_played(game);
            assert(game.state == GameState::Played, 'game not marked played');

            // Step 4: Increment games_played counter
            gamepack = increment_games_played(gamepack);
            assert(gamepack.games_played == game_id + 1, 'games_played wrong');

            // Step 5: Check if gamepack is complete
            if is_gamepack_complete(gamepack) {
                // Step 6: Complete the gamepack
                gamepack = complete_gamepack(gamepack);
                assert(gamepack.state == GamepackState::Completed, 'gamepack not completed');
            }

            game_id += 1;
        };

        // Verify final state
        assert(gamepack.games_played == 10, 'not all games played');
        assert(gamepack.state == GamepackState::Completed, 'gamepack not completed');
    }

    // Test Chain 3: Buy Subsequent Gamepack
    // This validates the state machine rule: can only buy if previous is completed
    #[test]
    fn test_chain_buy_second_gamepack_after_completion() {
        let player_address: ContractAddress = 0x123.try_into().unwrap();
        let gamepack_cost: u128 = 100;

        // Setup: Player with first gamepack completed
        let mut player = initialize_player(player_address, 1000);
        player = increment_gamepack_id(player); // Now has gamepack_id = 1

        let mut first_gamepack = create_gamepack(player_address, 1);
        first_gamepack.games_played = 10;
        first_gamepack = complete_gamepack(first_gamepack);

        // Step 1: Verify can buy next gamepack (current is Completed)
        assert(can_buy_gamepack(player, first_gamepack), 'should allow second purchase');

        // Step 2: Deduct moonrocks
        player = deduct_moonrocks(player, gamepack_cost);
        assert(player.moonrocks == 900, 'moonrocks not deducted');

        // Step 3: Increment gamepack_id
        player = increment_gamepack_id(player);
        assert(player.current_gamepack_id == 2, 'gamepack_id wrong');

        // Step 4: Create second gamepack
        let second_gamepack = create_gamepack(player_address, player.current_gamepack_id);
        assert(second_gamepack.gamepack_id == 2, 'second gamepack_id wrong');
        assert(second_gamepack.state == GamepackState::Active, 'second gamepack not active');
    }

    // Test: Cannot buy gamepack when current is Active
    #[test]
    fn test_cannot_buy_when_active() {
        let player_address: ContractAddress = 0x123.try_into().unwrap();

        let mut player = initialize_player(player_address, 1000);
        player = increment_gamepack_id(player);

        let active_gamepack = create_gamepack(player_address, 1);

        // Should NOT be able to buy when current gamepack is Active
        assert(!can_buy_gamepack(player, active_gamepack), 'should not allow purchase');
    }

    // Test: Cannot play invalid game_id
    #[test]
    fn test_invalid_game_id() {
        assert(is_valid_game_id(0), 'game_id 0 should be valid');
        assert(is_valid_game_id(9), 'game_id 9 should be valid');
        assert(!is_valid_game_id(10), 'game_id 10 should be invalid');
        assert(!is_valid_game_id(255), 'game_id 255 should be invalid');
    }

    // Test: Cannot play already played game
    #[test]
    fn test_cannot_play_played_game() {
        let player_address: ContractAddress = 0x123.try_into().unwrap();

        let gamepack = create_gamepack(player_address, 1);
        let mut game = create_game(player_address, 1, 0);

        // First play: should work
        assert(can_play_game(game, gamepack), 'should be playable');

        // Mark as played
        game = mark_game_played(game);

        // Second play: should fail
        assert(!can_play_game(game, gamepack), 'should not be playable');
    }

    // Test: Gamepack completes exactly on 10th game
    #[test]
    fn test_gamepack_completes_on_tenth_game() {
        let player_address: ContractAddress = 0x123.try_into().unwrap();

        let mut gamepack = create_gamepack(player_address, 1);

        // Play 9 games - should NOT complete
        let mut i: u8 = 0;
        loop {
            if i >= 9 {
                break;
            }
            gamepack = increment_games_played(gamepack);
            i += 1;
        };

        assert(gamepack.games_played == 9, 'should have 9 played');
        assert(!is_gamepack_complete(gamepack), 'should not be complete at 9');

        // Play 10th game - should complete
        gamepack = increment_games_played(gamepack);
        assert(gamepack.games_played == 10, 'should have 10 played');
        assert(is_gamepack_complete(gamepack), 'should be complete at 10');
    }

    // Test: Cannot play game when gamepack is Completed
    #[test]
    fn test_cannot_play_when_gamepack_completed() {
        let player_address: ContractAddress = 0x123.try_into().unwrap();

        let mut gamepack = create_gamepack(player_address, 1);
        gamepack = complete_gamepack(gamepack);

        let game = create_game(player_address, 1, 0);

        // Should NOT be able to play when gamepack is Completed
        assert(!can_play_game(game, gamepack), 'should not play completed pack');
    }

    // Test: Full end-to-end flow
    // Player buys gamepack, plays all games, buys another
    #[test]
    fn test_full_end_to_end_flow() {
        let player_address: ContractAddress = 0x123.try_into().unwrap();
        let gamepack_cost: u128 = 100;

        // === Buy First Gamepack ===
        let mut player = initialize_player(player_address, 1000);
        player = deduct_moonrocks(player, gamepack_cost);
        player = increment_gamepack_id(player);
        let mut gamepack1 = create_gamepack(player_address, player.current_gamepack_id);

        // === Play All 10 Games ===
        let mut game_id: u8 = 0;
        loop {
            if game_id >= 10 {
                break;
            }
            let mut game = create_game(player_address, gamepack1.gamepack_id, game_id);
            game = mark_game_played(game);
            gamepack1 = increment_games_played(gamepack1);
            if is_gamepack_complete(gamepack1) {
                gamepack1 = complete_gamepack(gamepack1);
            }
            game_id += 1;
        };

        assert(gamepack1.state == GamepackState::Completed, 'gamepack1 not done');

        // === Buy Second Gamepack ===
        assert(can_buy_gamepack(player, gamepack1), 'cannot buy gamepack2');
        player = deduct_moonrocks(player, gamepack_cost);
        player = increment_gamepack_id(player);
        let gamepack2 = create_gamepack(player_address, player.current_gamepack_id);

        // === Verify Final State ===
        assert(player.moonrocks == 800, 'final moonrocks wrong');
        assert(player.current_gamepack_id == 2, 'final gamepack_id wrong');
        assert(gamepack2.state == GamepackState::Active, 'gamepack2 not active');
        assert(gamepack2.gamepack_id == 2, 'gamepack2 id wrong');
    }
}
