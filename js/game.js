let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let level1;

/**
 * Initializes the game on page load.
 */
function init() {
  try {
    const auto = localStorage.getItem("el_pollo_autoStart");
    if (auto === "1") {
      localStorage.removeItem("el_pollo_autoStart");
      startGame();
    }
  } catch (e) {}
  initMuteState();
  checkOrientationBeforeStart();
}

/**
 * Initializes and starts a new game session.
 * Resets UI screens, shows the canvas, creates the level,
 * initializes the world and mobile controls, triggers chicken audio
 * and starts the rendering loop.
 */
function initGame() {
  gameStopped = false;
  document.getElementById("winScreen").classList.add("d_none");
  document.getElementById("endScreen").classList.add("d_none");
  hideStartUI();
  showCanvas();
  level1 = createLevel1();
  world = new World(canvas, keyboard, level1);
  initMobileControls(world);
  chickenAudio();
  world.draw();
}

/**
 * Plays a sound if the game is not muted.
 * @param {HTMLAudioElement} audio - The audio element to play.
 */
function playSound(audio) {
  if (!muted) {
    audio.currentTime = 0;
    audio.play();
  }
}

/**
 * Stops all registered sounds.
 */
function stopAllSounds() {
  allSounds.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

/**
 * Stops all chicken sounds.
 */
function stopAllChickenSounds() {
  allChickenSounds.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

/**
 * Toggles the global mute state.
 */
function toggleMute() {
  muted = !muted;
  localStorage.setItem("muted", muted);
  updateMuteButton();
  allSounds.forEach((audio) => (audio.muted = muted));
  if (!muted) chickenAudio();
}

/**
 * Restores the mute state from localStorage.
 */
function initMuteState() {
  muted = localStorage.getItem("muted") === "true";
  updateMuteButton();
  allSounds.forEach((audio) => (audio.muted = muted));
}

/**
 * Updates the mute button icon.
 */
function updateMuteButton() {
  let btn = document.getElementById("unmuteButton");
  btn.innerHTML = muted
    ? '<img src="./img/assets/mute.png" alt="Mute">'
    : '<img src="./img/assets/unmute.png" alt="Unmute">';
}

/**
 * Starts the game.
 */
function startGame() {
  gameStarted = true;
  hideStartUI();
  showCanvas();
  level1 = createLevel1();
  world = new World(canvas, keyboard, level1);
  initMobileControls(world);
  chickenAudio();
  world.draw();
}

/**
 * Displays the game canvas.
 */
function showCanvas() {
  let canvasWrapper = document.getElementById("canvasWrapper");
  canvasWrapper.classList.remove("d_none");
  canvas = document.getElementById("canvas");
  canvas.classList.remove("d_none");
  const canvasFsBtn = document.getElementById("canvasFullscreenBtn");
  document.getElementById("canvas-controls").classList.add("active");
  if (canvasFsBtn) canvasFsBtn.classList.remove("d_none");
  showMobileControls();
}

/**
 * Hides the start UI.
 */
function hideStartUI() {
  document.getElementById("startScreen").classList.add("d_none");
  document.getElementById("controls").classList.add("d_none");
  document.getElementById("h1").classList.add("d_none");
}

/**
 * Evaluates the current device orientation and updates UI visibility.
 * Registers orientation listeners if not already added.
 */
function checkOrientationBeforeStart() {
  const interfaceElements = getInterfaceElements();
  const isPortrait = window.innerHeight > window.innerWidth;
  if (isPortrait) handlePortraitMode(interfaceElements);
  else handleLandscapeMode(interfaceElements);
  addOrientationListenersOnce();
}

/**
 * Returns all UI elements required for orientation handling.
 * @returns {{
 *   warning: HTMLElement,
 *   canvasWrapper: HTMLElement,
 *   startScreen: HTMLElement,
 *   controls: HTMLElement,
 *   h1: HTMLElement,
 *   canvasControls: HTMLElement,
 *   unmuteBtn: HTMLElement
 * }}
 */
function getInterfaceElements() {
  return {
    warning: document.getElementById("rotate"),
    canvasWrapper: document.getElementById("canvasWrapper"),
    startScreen: document.getElementById("startScreen"),
    controls: document.getElementById("controls"),
    h1: document.getElementById("h1"),
    canvasControls: document.getElementById("canvas-controls"),
    unmuteBtn: document.getElementById("unmuteButton"),
  };
}

/**
 * Applies UI changes for portrait mode.
 * @param {{
 *   warning: HTMLElement,
 *   canvasWrapper: HTMLElement,
 *   startScreen: HTMLElement,
 *   controls: HTMLElement,
 *   h1: HTMLElement,
 *   canvasControls: HTMLElement,
 *   unmuteBtn: HTMLElement
 * }} interfaceElements
 */
function handlePortraitMode(interfaceElements) {
  interfaceElements.warning?.classList.remove("d_none");
  interfaceElements.canvasWrapper?.classList.add("d_none");
  interfaceElements.startScreen?.classList.add("d_none");
  interfaceElements.controls?.classList.add("d_none");
  interfaceElements.h1?.classList.add("d_none");
  interfaceElements.canvasControls?.classList.add("d_none");
  interfaceElements.unmuteBtn?.classList.add("d_none");
  if (world) world.stopGame = true;
}

/**
 * Applies UI changes for landscape mode.
 * @param {{
 *   warning: HTMLElement,
 *   canvasWrapper: HTMLElement,
 *   startScreen: HTMLElement,
 *   controls: HTMLElement,
 *   h1: HTMLElement,
 *   canvasControls: HTMLElement,
 *   unmuteBtn: HTMLElement
 * }} interfaceElements
 */
function handleLandscapeMode(interfaceElements) {
  interfaceElements.warning?.classList.add("d_none");
  interfaceElements.unmuteBtn?.classList.remove("d_none");
  if (gameStarted) {
    interfaceElements.canvasWrapper?.classList.remove("d_none");
    interfaceElements.canvasControls?.classList.remove("d_none");
    interfaceElements.startScreen?.classList.add("d_none");
  } else {
    interfaceElements.startScreen?.classList.remove("d_none");
    interfaceElements.canvasWrapper?.classList.add("d_none");
  }
  if (world) world.stopGame = false;
}

/**
 * Adds orientation listeners once.
 */
function addOrientationListenersOnce() {
  if (addOrientationListenersOnce._added) return;
  window.addEventListener("resize", checkOrientationBeforeStart);
  window.addEventListener("orientationchange", checkOrientationBeforeStart);
  addOrientationListenersOnce._added = true;
}

/**
 * Shows the controls panel.
 */
function showControls() {
  document.getElementById("controls").classList.remove("d_none");
}

/**
 * Shows the impressum.
 */
function showImpressum() {
  document.getElementById("impressum").classList.remove("d_none");
}

/**
 * Hides the impressum.
 */
function hideImpressum() {
  document.getElementById("impressum").classList.add("d_none");
}

/**
 * Hides the controls panel.
 */
function hideControls() {
  document.getElementById("controls").classList.add("d_none");
}

/**
 * Shows mobile controls.
 */
function showMobileControls() {
  document.getElementById("canvas-controls").classList.remove("d_none");
}

/**
 * Triggers the spawn sound for all chicken enemies in the current level.
 * Does nothing if muted or no world/level is active.
 */
function chickenAudio() {
  if (!world || !world.level || !world.level.enemies) return;
  if (muted) return;
  world.level.enemies.forEach((enemy) => {
    if (enemy instanceof Chicken) enemy.playSpawnSound();
  });
}

/**
 * Toggles fullscreen mode for the document body.
 */
function toggleFullScreen() {
  if (!document.fullscreenElement) document.body.requestFullscreen();
  else document.exitFullscreen();
}

/**
 * Restarts the game by setting the auto-start flag and reloading the page.
 */
function restartGame() {
  clearAllIntervals();
  clearAllTimeouts();
  initGame();
}

/**
 * Returns to the main menu by clearing the auto-start flag and reloading the page.
 */
function backToMainMenu() {
  try {
    localStorage.removeItem("el_pollo_autoStart");
  } catch (e) {}
  location.reload();
}

window.addEventListener("keydown", (event) => {
  handleKey(event.keyCode, true);
});

window.addEventListener("keyup", (event) => {
  handleKey(event.keyCode, false);
});

/**
 * Updates the keyboard state for a specific key code.
 * @param {number} code - The key code of the pressed or released key.
 * @param {boolean} isPressed - Whether the key is currently pressed.
 */
function handleKey(code, isPressed) {
  if (code == 39) keyboard.RIGHT = isPressed;
  if (code == 37) keyboard.LEFT = isPressed;
  if (code == 40) keyboard.DOWN = isPressed;
  if (code == 38) keyboard.UP = isPressed;
  if (code == 32) keyboard.SPACE = isPressed;
  if (code == 68) keyboard.D = isPressed;
}

/**
 * Initializes touch controls for mobile devices.
 * @param {World} world - The active game world instance.
 */
function initMobileControls(world) {
  setTouchControl(".canvas-arrow-left", "LEFT");
  setTouchControl(".canvas-arrow-right", "RIGHT");
  setTouchControl(".canvas-arrow-up", "SPACE");
  setTouchControl(".canvas-arrow-throw", "D");
}

/**
 * Registers touch input for a specific on-screen control button.
 * Pointer events update the corresponding keyboard state so mobile input
 * behaves like physical keyboard input.
 *
 * @param {string} selector - CSS selector of the touch control button.
 * @param {string} key - Keyboard property to toggle (e.g. "LEFT", "RIGHT", "SPACE", "D").
 */
function setTouchControl(selector, key) {
  const btn = document.querySelector(selector);
  btn.addEventListener("pointerdown", () => (keyboard[key] = true));
  btn.addEventListener("pointerup", () => (keyboard[key] = false));
  btn.addEventListener("pointerleave", () => (keyboard[key] = false));
}
