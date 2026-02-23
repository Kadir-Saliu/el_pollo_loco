let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let level1;

/**
 * Initializes the game on page load.
 * Restores the saved mute state and checks whether the game
 * should auto‑start based on a stored flag in localStorage.
 * If auto‑start is enabled, the flag is removed and the game begins.
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
  // Ensure orientation is evaluated on load so portrait shows only the rotate image
  checkOrientationBeforeStart();
}

/**
 * Plays a sound if the game is not muted.
 *
 * @param {HTMLAudioElement} audio - The sound to play.
 */
function playSound(audio) {
  if (!muted) {
    audio.currentTime = 0;
    audio.play();
  }
}

/**
 * Toggles the global mute state for all game sounds.
 * Saves the new state in localStorage, updates the mute button UI,
 * and unmutes-triggered sounds (e.g., chicken spawn audio) when sound is enabled.
 */
function toggleMute() {
  muted = !muted;
  localStorage.setItem("muted", muted);

  updateMuteButton();
  allSounds.forEach((audio) => (audio.muted = muted));

  if (!muted) {
    chickenAudio();
  }
}

/**
 * Restores the mute state from localStorage on page load.
 * Applies the saved mute setting to all game sounds and updates the UI.
 */
function initMuteState() {
  muted = localStorage.getItem("muted") === "true";

  updateMuteButton();
  allSounds.forEach((audio) => (audio.muted = muted));
}

/**
 * Updates the mute button icon to visually reflect the current mute state.
 * Does not modify audio behavior — purely a UI update.
 */
function updateMuteButton() {
  let btn = document.getElementById("unmuteButton");

  if (muted) {
    btn.innerHTML = '<img src="./img/assets/mute.png" alt="Mute">';
  } else {
    btn.innerHTML = '<img src="./img/assets/unmute.png" alt="Unmute">';
  }
}

/**
 * Starts the game by initializing the game state, loading the level,
 * creating the world, and setting up controls.
 *
 * @function startGame
 */
function startGame() {
  gameStarted = true;
  checkOrientationBeforeStart();
  if (gameStarted) {
    hideStartUI();
    showCanvas();
    level1 = createLevel1();
    world = new World(canvas, keyboard, level1);
    initMobileControls(world);
    chickenAudio();
  }
}

/**
 * Displays the game canvas and associated UI elements.
 *
 * @function showCanvas
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
 * Hides the start screen, controls panel, and main heading.
 *
 * @function hideStartUI
 */
function hideStartUI() {
  document.getElementById("startScreen").classList.add("d_none");
  document.getElementById("controls").classList.add("d_none");
  document.getElementById("h1").classList.add("d_none");
}

/**
 * Checks the device orientation and updates the UI and game state accordingly.
 * Delegates portrait and landscape handling to helper functions and ensures
 * orientation listeners are only added once.
 */
function checkOrientationBeforeStart() {
  const interfaceElements = getInterfaceElements();
  const isPortrait = window.innerHeight > window.innerWidth;

  if (isPortrait) {
    handlePortraitMode(interfaceElements);
  } else {
    handleLandscapeMode(interfaceElements);
  }

  addOrientationListenersOnce();
}

/**
 * Collects and returns all UI elements required for orientation handling.
 *
 * @returns {Object} An object containing references to relevant DOM elements.
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
 * Applies UI changes for portrait mode and pauses the game.
 *
 * @param {Object} interfaceElements - The interface elements returned by getInterfaceElements().
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
 * Applies UI changes for landscape mode and resumes the game if applicable.
 *
 * @param {Object} interfaceElements - The interface elements returned by getInterfaceElements().
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
 * Ensures orientation listeners are only registered once to prevent
 * duplicate event handlers from accumulating.
 */
function addOrientationListenersOnce() {
  if (addOrientationListenersOnce._added) return;

  window.addEventListener("resize", checkOrientationBeforeStart);
  window.addEventListener("orientationchange", checkOrientationBeforeStart);

  addOrientationListenersOnce._added = true;
}

/**
 * Displays the controls panel.
 *
 * @function showControls
 */
function showControls() {
  let controls = document.getElementById("controls");
  controls.classList.remove("d_none");
}

function showImpressum() {
  let impressum = document.getElementById("impressum");
  impressum.classList.remove("d_none");
}

/**
 * Hides the impressum panel.
 *
 * @function hideImpressum
 */
function hideImpressum() {
  let impressum = document.getElementById("impressum");
  impressum.classList.add("d_none");
}

/**
 * Hides the controls panel.
 *
 * @function hideControls
 */
function hideControls() {
  let controls = document.getElementById("controls");
  controls.classList.add("d_none");
}

/**
 * Displays the mobile control buttons.
 *
 * @function showMobileControls
 */
function showMobileControls() {
  document.getElementById("canvas-controls").classList.remove("d_none");
}

/**
 * Plays the spawn sound for all chicken enemies in the current level.
 * The function exits immediately if the global mute state is active.
 * Only enemies of type `Chicken` trigger their individual spawn sound.
 *
 * @function chickenAudio
 */
function chickenAudio() {
  if (!world || !world.level || !world.level.enemies) return;
  if (muted) return;

  world.level.enemies.forEach((enemy) => {
    if (enemy instanceof Chicken) {
      enemy.playSpawnSound();
    }
  });
}

/**
 * Toggles fullscreen mode for the game canvas.
 *
 * @function toggleFullScreen
 */
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

/**
 * Restarts the game by setting the auto-start flag and reloading the page.
 *
 * @function restartGame
 */
function restartGame() {
  try {
    localStorage.setItem("el_pollo_autoStart", "1");
  } catch (e) {}
  location.reload();
}

/**
 * Returns to the main menu by clearing the auto-start flag and reloading the page.
 *
 * @function backToMainMenu
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
 * Updates the keyboard state for a given key.
 *
 * @param {number} code - Key code of the pressed or released key.
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
 *
 * @function initMobileControls
 * @param {World} world - The game world instance.
 */
function initMobileControls(world) {
  setTouchControl(".canvas-arrow-left", "LEFT");
  setTouchControl(".canvas-arrow-right", "RIGHT");
  setTouchControl(".canvas-arrow-up", "SPACE");
  setTouchControl(".canvas-arrow-throw", "D");
}

/**
 * Sets up a touch control button with pointer events.
 *
 * @function setTouchControl
 * @param {string} selector - The CSS selector of the control button.
 * @param {string} key - The keyboard key to map to this control.
 */
function setTouchControl(selector, key) {
  const btn = document.querySelector(selector);
  btn.addEventListener("pointerdown", () => {
    keyboard[key] = true;
  });
  btn.addEventListener("pointerup", () => {
    keyboard[key] = false;
  });
  btn.addEventListener("pointerleave", () => {
    keyboard[key] = false;
  });
}
