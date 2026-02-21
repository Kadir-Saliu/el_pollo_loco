let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let level1;

/**
 * Initializes the game by checking whether auto‑start is enabled.
 * If the stored flag is set, it removes it and starts the game.
 */
function init() {
  try {
    const auto = localStorage.getItem("el_pollo_autoStart");
    if (auto === "1") {
      localStorage.removeItem("el_pollo_autoStart");
      startGame();
    }
  } catch (e) {}
}

/**
 * Toggles the mute state of all game sounds.
 * Updates the mute button UI to show the current state.
 *
 * @function toggleMute
 */
function toggleMute() {
  muted = !muted;
  let btn = document.getElementById("unmuteButton");
  if (muted) {
    btn.innerHTML = '<img src="./img/assets/mute.png" alt="Mute">';
    allSounds.forEach((audio) => (audio.muted = true));
  } else {
    btn.innerHTML = '<img src="./img/assets/unmute.png" alt="Unmute">';
    allSounds.forEach((audio) => (audio.muted = false));
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
 * Checks the device orientation and pauses the game if in portrait mode.
 * Listens for orientation changes and resize events.
 *
 * @function checkOrientationBeforeStart
 */
function checkOrientationBeforeStart() {
  const warning = document.getElementById("rotate");
  if (window.innerHeight > window.innerWidth) {
    warning.classList.remove("d_none");
    if (world) world.stopGame = true;
  } else {
    warning.classList.add("d_none");
    if (world) world.stopGame = false;
  }
  window.addEventListener("resize", checkOrientationBeforeStart);
  window.addEventListener("orientationchange", checkOrientationBeforeStart);
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
 * Plays the spawn sound for all chicken enemies in the level.
 *
 * @function chickenAudio
 */
function chickenAudio() {
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

/**
 * Handles keyboard input events for game controls.
 *
 * @function handleKey
 * @param {number} code - The key code of the pressed or released key.
 * @param {boolean} isPressed - True if the key was pressed, false if released.
 */
function handleKey(code, isPressed) {}

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
