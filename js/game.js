let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let level1;




function init() {
  try {
    const auto = localStorage.getItem('el_pollo_autoStart');
    if (auto === '1') {
      localStorage.removeItem('el_pollo_autoStart');
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
    allSounds.forEach(audio => audio.muted = true);
  } else {
    btn.innerHTML = '<img src="./img/assets/unmute.png" alt="Unmute">';
    allSounds.forEach(audio => audio.muted = false);
  }
}


function startGame() {
  gameStarted = true;

  checkOrientationBeforeStart();

  if (gameStarted) {
    let startScreen = document.getElementById("startScreen");
    startScreen.classList.add("d_none");
    
    let controls = document.getElementById("controls");
    controls.classList.add("d_none");

    let headerTitle = document.getElementById("h1");
    headerTitle.classList.add("d_none");

    let canvasWrapper = document.getElementById("canvasWrapper");
    canvasWrapper.classList.remove("d_none");

    canvas = document.getElementById("canvas");
    canvas.classList.remove("d_none");
    const canvasFsBtn = document.getElementById("canvasFullscreenBtn");
    document.getElementById("canvas-controls").classList.add("active");

    if (canvasFsBtn) canvasFsBtn.classList.remove("d_none");

    showMobileControls();
    level1 = createLevel1();
    world = new World(canvas, keyboard,level1);
    

    initMobileControls(world);

    chickenAudio();
  }
}

function checkOrientationBeforeStart() {
  const warning = document.getElementById("rotate");

  if (window.innerHeight > window.innerWidth) {
    warning.classList.remove("d_none");

    // Spiel pausieren, bis gedreht wird
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
    localStorage.setItem('el_pollo_autoStart', '1');
  } catch (e) {
  }
  location.reload();
}

function backToMainMenu() {
  try {
    localStorage.removeItem('el_pollo_autoStart');
  } catch (e) {}
  location.reload();
}

window.addEventListener("keydown", (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (event.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (event.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (event.keyCode == 38) {
    keyboard.UP = true;
  }

  if (event.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (event.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (event.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (event.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (event.keyCode == 38) {
    keyboard.UP = false;
  }

  if (event.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (event.keyCode == 68) {
    keyboard.D = false;
  }
});

function initMobileControls(world) {
  const leftBtn = document.querySelector(".canvas-arrow-left");
  const rightBtn = document.querySelector(".canvas-arrow-right");
  const jumpBtn = document.querySelector(".canvas-arrow-up");
  const throwBtn = document.querySelector(".canvas-arrow-throw");

  leftBtn.addEventListener("pointerdown", () => (keyboard.LEFT = true));
  leftBtn.addEventListener("pointerup", () => (keyboard.LEFT = false));
  leftBtn.addEventListener("pointerleave", () => (keyboard.LEFT = false));

  rightBtn.addEventListener("pointerdown", () => (keyboard.RIGHT = true));
  rightBtn.addEventListener("pointerup", () => (keyboard.RIGHT = false));
  rightBtn.addEventListener("pointerleave", () => (keyboard.RIGHT = false));

  jumpBtn.addEventListener("pointerdown", () => (keyboard.SPACE = true));
  jumpBtn.addEventListener("pointerup", () => (keyboard.SPACE = false));

  throwBtn.addEventListener("pointerdown", () => (keyboard.D = true));
  throwBtn.addEventListener("pointerup", () => (keyboard.D = false));
}
