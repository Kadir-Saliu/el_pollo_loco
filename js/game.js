let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let gameStarted = false;

function init() {}

function startGame() {
  gameStarted = true;

  if (gameStarted) {
    let startScreen = document.getElementById("startScreen");
    startScreen.classList.add("d_none");
    let controls = document.getElementById("controls");
    controls.classList.add("d_none");

    let headerTitle = document.getElementById("h1");
    headerTitle.classList.add("d_none");

    canvas = document.getElementById("canvas");
    canvas.classList.remove("d_none");
    const canvasFsBtn = document.getElementById("canvasFullscreenBtn");
    if (canvasFsBtn) canvasFsBtn.classList.remove("d_none");
    world = new World(canvas, keyboard);
    level1 = new Level();

    // playSpawnSound für alle Hühner aufrufen
    chickenAudio();
  }
}

function showControls() {
  let controls = document.getElementById("controls");
  controls.classList.remove("d_none");
}

function hideControls() {
  let controls = document.getElementById("controls");
  controls.classList.add("d_none");
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
