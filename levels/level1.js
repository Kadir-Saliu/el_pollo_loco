let usedChickenPositions = [];
let usedCloudPositions = [];

/**
 * Creates and returns the first level of the game.
 * Includes enemies, collectibles, clouds, and background objects.
 *
 * @returns {Level} The fully configured level instance.
 */
function createLevel1() {
  return new Level(
    [
      new Chicken(getChickenSpawnX()),
      new Chicken(getChickenSpawnX()),
      new Chicken(getChickenSpawnX()),
      new Chicken(getChickenSpawnX()),
      new Chicken(getChickenSpawnX()),
      new Chicken(getChickenSpawnX()),
      new Chicken(getChickenSpawnX()),
      new Chicken(getChickenSpawnX()),
      new Endboss(),
    ],
    [new Coin(), new Coin(), new Coin(), new Coin(), new Coin()],
    [new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()],
    [
      new Cloud(getCloudSpawnX()),
      new Cloud(getCloudSpawnX()),
      new Cloud(getCloudSpawnX()),
      new Cloud(getCloudSpawnX()),
    ],
    [
      new BackgroundObject(
        "./img/9_intro_outro_screens/start/startscreen_1.png",
      ),
      new BackgroundObject("img/5_background/layers/air.png", -720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -720),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        -720,
      ),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -720),
      new BackgroundObject("img/5_background/layers/air.png", 0),
      new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
      new BackgroundObject("img/5_background/layers/air.png", 720),
      new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 720),
      new BackgroundObject("img/5_background/layers/air.png", 720 * 2),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/1.png",
        720 * 2,
      ),
      new BackgroundObject("img/5_background/layers/air.png", 720 * 3),
      new BackgroundObject(
        "img/5_background/layers/3_third_layer/2.png",
        720 * 3,
      ),
      new BackgroundObject(
        "img/5_background/layers/2_second_layer/2.png",
        720 * 3,
      ),
      new BackgroundObject(
        "img/5_background/layers/1_first_layer/2.png",
        720 * 3,
      ),
    ],
  );
}

/**
 * Generates a random X-position within a given range.
 * Ensures a minimum distance from previously used positions.
 *
 * @param {number[]} usedPositions - Array of previously used X-positions.
 * @param {number} minX - Minimum allowed X value.
 * @param {number} maxX - Maximum allowed X value.
 * @param {number} minDistance - Minimum distance between generated positions.
 * @returns {number} A valid X-position within the given constraints.
 */
function generateSpawnX(usedPositions, minX, maxX, minDistance) {
  let xPosition;

  do {
    xPosition = Math.floor(minX + Math.random() * (maxX - minX));
  } while (
    usedPositions.some(
      (existing) => Math.abs(existing - xPosition) < minDistance,
    )
  );

  usedPositions.push(xPosition);
  return xPosition;
}

/**
 * Returns a valid spawn X-position for chickens.
 *
 * @returns {number} A valid X-position for a chicken.
 */
function getChickenSpawnX() {
  return generateSpawnX(usedChickenPositions, 350, 1550, 50);
}

/**
 * Returns a valid spawn X-position for clouds.
 *
 * @returns {number} A valid X-position for a cloud.
 */
function getCloudSpawnX() {
  return generateSpawnX(usedCloudPositions, 0, 1900, 200);
}
