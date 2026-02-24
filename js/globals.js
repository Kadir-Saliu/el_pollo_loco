let allSounds = [];
let allChickenSounds = [];
let muted = false;
let gameStarted = false;
let gameStopped = false;
const originalSetInterval = window.setInterval;
const originalSetTimeout = window.setTimeout;

let allIntervals = [];
let allTimeouts = [];

let animationFrameId;

/**
 * Overrides the native setInterval to track all interval IDs
 * so they can be cleared later when restarting or stopping the game.
 *
 * @param {Function} fn - The callback function to execute.
 * @param {number} time - Delay in milliseconds.
 * @returns {number} The interval ID.
 */
window.setInterval = function (fn, time) {
  const id = originalSetInterval(fn, time);
  allIntervals.push(id);
  return id;
};

/**
 * Overrides the native setTimeout to track all timeout IDs
 * so they can be cleared later when restarting or stopping the game.
 *
 * @param {Function} fn - The callback function to execute once.
 * @param {number} time - Delay in milliseconds.
 * @returns {number} The timeout ID.
 */
window.setTimeout = function (fn, time) {
  const id = originalSetTimeout(fn, time);
  allTimeouts.push(id);
  return id;
};

/**
 * Clears all tracked intervals and resets the interval list.
 */
function clearAllIntervals() {
  allIntervals.forEach((id) => clearInterval(id));
  allIntervals = [];
}

/**
 * Clears all tracked timeouts and resets the timeout list.
 */
function clearAllTimeouts() {
  allTimeouts.forEach((id) => clearTimeout(id));
  allTimeouts = [];
}
