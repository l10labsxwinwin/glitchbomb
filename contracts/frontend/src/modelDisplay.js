/**
 * Model Display Module
 *
 * Parses and displays all Dojo model data
 */

import { NAMESPACE, MODELS } from './dojoConfig.js';

// Enum display mappings
const PLAYER_STATE = {
  0: 'Broke',
  1: 'Stacked',
};

const GAMEPACK_STATE = {
  0: 'Empty',
  1: 'Unopened',
  2: 'InProgress',
  3: 'EndedEarly',
  4: 'Completed',
};

const GAME_STATE = {
  0: 'Empty',
  1: 'New',
  2: 'Level',
  3: 'LevelComplete',
  4: 'FiveOrDiePhase',
  5: 'Shop',
  6: 'GameOver',
};

const ORB_EFFECT = {
  0: 'Empty',
  1: 'PointRewind',
  2: 'FiveOrDie',
  3: 'Point',
  4: 'PointPerOrbRemaining',
  5: 'PointPerBombPulled',
  6: 'GlitchChips',
  7: 'Moonrocks',
  8: 'Health',
  9: 'Bomb',
  10: 'Multiplier',
  11: 'BombImmunity',
};

/**
 * Format enum display
 */
function formatEnum(enumMap, value) {
  return enumMap[value] || `Unknown(${value})`;
}

/**
 * Format address for display
 */
function formatAddress(address) {
  if (!address) return 'N/A';
  const addr = address.toString();
  if (addr.length > 12) {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }
  return addr;
}

/**
 * Format array display
 */
function formatArray(arr, itemFormatter = null) {
  if (!arr || arr.length === 0) return '[]';
  if (itemFormatter) {
    return `[${arr.map(itemFormatter).join(', ')}]`;
  }
  return `[${arr.join(', ')}]`;
}

/**
 * Format orb effect
 */
function formatOrbEffect(effect) {
  if (typeof effect === 'object') {
    const keys = Object.keys(effect);
    if (keys.length > 0) {
      const key = keys[0];
      const value = effect[key];
      return `${key}(${value})`;
    }
  }
  return formatEnum(ORB_EFFECT, effect);
}

/**
 * Display Player model
 */
function displayPlayer(player) {
  const container = document.getElementById('player-display');
  if (!player) {
    container.innerHTML = '<p class="no-data">No player data</p>';
    return;
  }

  container.innerHTML = `
    <div class="model-section">
      <h3>Player</h3>
      <div class="model-data">
        <div class="data-row">
          <span class="data-label">Player ID:</span>
          <span class="data-value">${formatAddress(player.player_id)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">State:</span>
          <span class="data-value">${formatEnum(PLAYER_STATE, player.state)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">USDC:</span>
          <span class="data-value">${player.data?.usdc || 0}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Gamepacks Bought:</span>
          <span class="data-value">${player.data?.gamepacks_bought || 0}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Display GamePack model
 */
function displayGamePack(gamePack) {
  const container = document.getElementById('gamepack-display');
  if (!gamePack) {
    container.innerHTML = '<p class="no-data">No gamepack data</p>';
    return;
  }

  container.innerHTML = `
    <div class="model-section">
      <h3>GamePack</h3>
      <div class="model-data">
        <div class="data-row">
          <span class="data-label">Player ID:</span>
          <span class="data-value">${formatAddress(gamePack.player_id)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">GamePack ID:</span>
          <span class="data-value">${gamePack.gamepack_id}</span>
        </div>
        <div class="data-row">
          <span class="data-label">State:</span>
          <span class="data-value">${formatEnum(GAMEPACK_STATE, gamePack.state)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Current Game ID:</span>
          <span class="data-value">${gamePack.data?.current_game_id || 0}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Accumulated Moonrocks:</span>
          <span class="data-value">${gamePack.data?.accumulated_moonrocks || 0}</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Display Game model
 */
function displayGame(game) {
  const container = document.getElementById('game-display');
  if (!game) {
    container.innerHTML = '<p class="no-data">No game data</p>';
    return;
  }

  const data = game.data || {};

  container.innerHTML = `
    <div class="model-section">
      <h3>Game</h3>
      <div class="model-data">
        <div class="data-row">
          <span class="data-label">Player ID:</span>
          <span class="data-value">${formatAddress(game.player_id)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">GamePack ID:</span>
          <span class="data-value">${game.gamepack_id}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Game ID:</span>
          <span class="data-value">${game.game_id}</span>
        </div>
        <div class="data-row">
          <span class="data-label">State:</span>
          <span class="data-value">${formatEnum(GAME_STATE, game.state)}</span>
        </div>
        <div class="data-section">
          <h4>Game Stats</h4>
          <div class="data-row">
            <span class="data-label">Level:</span>
            <span class="data-value">${data.level || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Pull Number:</span>
            <span class="data-value">${data.pull_number || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Points:</span>
            <span class="data-value">${data.points || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Milestone:</span>
            <span class="data-value">${data.milestone || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">HP:</span>
            <span class="data-value">${data.hp || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Multiplier:</span>
            <span class="data-value">${data.multiplier || 1}</span>
          </div>
          <div class="data-row">
            <span class="data-label">GlitchChips:</span>
            <span class="data-value">${data.glitch_chips || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Moonrocks Spent:</span>
            <span class="data-value">${data.moonrocks_spent || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Moonrocks Earned:</span>
            <span class="data-value">${data.moonrocks_earned || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Temp Moonrocks:</span>
            <span class="data-value">${data.temp_moonrocks || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Bomb Immunity Turns:</span>
            <span class="data-value">${data.bomb_immunity_turns || 0}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Bombs Pulled in Level:</span>
            <span class="data-value">${data.bombs_pulled_in_level || 0}</span>
          </div>
        </div>
        <div class="data-section">
          <h4>Orbs</h4>
          <div class="data-row">
            <span class="data-label">Pullable Orbs:</span>
            <span class="data-value array-value">${
              data.pullable_orbs ? formatArray(data.pullable_orbs, formatOrbEffect) : '[]'
            }</span>
          </div>
          <div class="data-row">
            <span class="data-label">Consumed Orbs:</span>
            <span class="data-value array-value">${
              data.consumed_orbs ? formatArray(data.consumed_orbs, formatOrbEffect) : '[]'
            }</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Display OrbsInGame model
 */
function displayOrbsInGame(orbsInGame) {
  const container = document.getElementById('orbs-display');
  if (!orbsInGame) {
    container.innerHTML = '<p class="no-data">No orbs data</p>';
    return;
  }

  const formatOrb = (orb) => {
    return `{effect: ${formatOrbEffect(orb.effect)}, count: ${orb.count}, base: ${orb.base_price}, current: ${orb.current_price}}`;
  };

  const formatOrbArray = (orbs) => {
    if (!orbs || orbs.length === 0) return '<div class="orb-list">None</div>';
    return `<div class="orb-list">${orbs.map(orb => `<div class="orb-item">${formatOrb(orb)}</div>`).join('')}</div>`;
  };

  container.innerHTML = `
    <div class="model-section">
      <h3>OrbsInGame</h3>
      <div class="model-data">
        <div class="data-row">
          <span class="data-label">Player ID:</span>
          <span class="data-value">${formatAddress(orbsInGame.player_id)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">GamePack ID:</span>
          <span class="data-value">${orbsInGame.gamepack_id}</span>
        </div>
        <div class="data-row">
          <span class="data-label">Game ID:</span>
          <span class="data-value">${orbsInGame.game_id}</span>
        </div>
        <div class="data-section">
          <h4>Non-Buyable Orbs</h4>
          ${formatOrbArray(orbsInGame.non_buyable)}
        </div>
        <div class="data-section">
          <h4>Common Orbs</h4>
          ${formatOrbArray(orbsInGame.common)}
        </div>
        <div class="data-section">
          <h4>Rare Orbs</h4>
          ${formatOrbArray(orbsInGame.rare)}
        </div>
        <div class="data-section">
          <h4>Cosmic Orbs</h4>
          ${formatOrbArray(orbsInGame.cosmic)}
        </div>
      </div>
    </div>
  `;
}

/**
 * Update all models from entities data
 */
export function updateFromEntitiesData(entities) {
  entities.forEach((entity) => {
    updateFromEntityData(entity);
  });
}

/**
 * Update models from a single entity
 */
export function updateFromEntityData(entity) {
  if (!entity.models || !entity.models[NAMESPACE]) {
    return;
  }

  const models = entity.models[NAMESPACE];

  // Update each model if present
  if (models[MODELS.PLAYER]) {
    displayPlayer(models[MODELS.PLAYER]);
  }

  if (models[MODELS.GAME_PACK]) {
    displayGamePack(models[MODELS.GAME_PACK]);
  }

  if (models[MODELS.GAME]) {
    displayGame(models[MODELS.GAME]);
  }

  if (models[MODELS.ORBS_IN_GAME]) {
    displayOrbsInGame(models[MODELS.ORBS_IN_GAME]);
  }
}

/**
 * Clear all displays
 */
export function clearDisplays() {
  displayPlayer(null);
  displayGamePack(null);
  displayGame(null);
  displayOrbsInGame(null);
}
