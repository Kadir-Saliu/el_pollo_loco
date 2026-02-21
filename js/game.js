let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let level1;

function init() {
  try {
    const auto = localStorage.getItem("el_pollo_autoStart");
    if (auto === "1") {
      localStorage.removeItem("el_pollo_autoStart");
      startGame();
    }
  } catch (e) {
    // if localStorage not available, do nothing
  }
}

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

function hideStartUI() {
  document.getElementById("startScreen").classList.add("d_none");
  document.getElementById("controls").classList.add("d_none");
  document.getElementById("h1").classList.add("d_none");
}

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

function showControls() {
  let controls = document.getElementById("controls");
  controls.classList.remove("d_none");
}

function hideControls() {
  let controls = document.getElementById("controls");
  controls.classList.add("d_none");
}

function showMobileControls() {
  document.getElementById("canvas-controls").classList.remove("d_none");
}

function chickenAudio() {
  world.level.enemies.forEach((enemy) => {
    if (enemy instanceof Chicken) {
      enemy.playSpawnSound();
    }
  });
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function restartGame() {
  try {
    localStorage.setItem("el_pollo_autoStart", "1");
  } catch (e) {}
  location.reload();
}

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

function handleKey(code, isPressed) {
  if (code == 39) keyboard.RIGHT = isPressed;
  if (code == 37) keyboard.LEFT = isPressed;
  if (code == 40) keyboard.DOWN = isPressed;
  if (code == 38) keyboard.UP = isPressed;
  if (code == 32) keyboard.SPACE = isPressed;
  if (code == 68) keyboard.D = isPressed;
}

function initMobileControls(world) {
  setTouchControl(".canvas-arrow-left", "LEFT");
  setTouchControl(".canvas-arrow-right", "RIGHT");
  setTouchControl(".canvas-arrow-up", "SPACE");
  setTouchControl(".canvas-arrow-throw", "D");
}

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
