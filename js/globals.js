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
console.log(allIntervals);


window.setInterval = function(fn, time) {
  const id = originalSetInterval(fn, time);
  allIntervals.push(id);
  return id;
};

window.setTimeout = function(fn, time) {
  const id = originalSetTimeout(fn, time);
  allTimeouts.push(id);
  return id;
};

function clearAllIntervals() {
  allIntervals.forEach(id => clearInterval(id));
  allIntervals = [];
}

function clearAllTimeouts() {
  allTimeouts.forEach(id => clearTimeout(id));
  allTimeouts = [];
}
