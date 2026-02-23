class World {
  character = new Character();
  level;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinStatusBar = new CoinStatusBar();
  bottleStatusBar = new BottleStatusBar();
  endbossStautsBar = new EndbossStatusBar();
  hadFirstContactWithEndboss = false;
  throwableObject = [];
  cooldown = 2000;
  lastBottleThrow = 0;

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.level = level;
    this.setWorld();
    this.character.animate();
    this.draw();
    this.run();
  }

  /**
   * Links the world to the character and initializes endboss behavior.
   */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        enemy.animate();
      }
    });
  }

  /**
   * Starts the main game loop for collision checks and throw logic.
   * Runs at 60 FPS.
   */
  run() {
    setInterval(() => {
      this.checkCollision();
      this.checkThrowObjects();
    }, 1000 / 60);
  }

  /**
   * Checks whether the player can throw a bottle and triggers the action.
   */
  checkThrowObjects() {
    if (!this.keyboard.D || this.character.bottle <= 0) return;

    if (Date.now() - this.lastBottleThrow > this.cooldown) {
      this.throwBottle();
    }
  }

  /**
   * Creates and launches a throwable bottle and updates the bottle status bar.
   */
  throwBottle() {
    this.lastBottleThrow = Date.now();
    const bottle = new ThrowableObject(
      this.character.x + 50,
      this.character.y + 50,
      this.character.otherDirection,
    );
    this.throwableObject.push(bottle);
    this.character.bottle = Math.max(0, this.character.bottle - 20);
    this.bottleStatusBar.setPercentage(this.character.bottle);
    this.checkCollision();
  }

  /**
   * Runs all collision checks for enemies, coins, bottles and thrown bottles.
   */
  checkCollision() {
    this.checkCollisionEnemyWithCharacter();
    this.checkCollisionCharacterWithCoin();
    this.checkCollisionCharacterWithBottle();
    this.checkCollisionEnemyWithThrowableBottle();
  }

  /**
   * Checks collisions between the character and all enemies.
   * Determines whether the character performs a stomp or takes damage.
   * Delegates stomp and damage handling to separate helper functions.
   */
  checkCollisionEnemyWithCharacter() {
    for (let enemy of this.level.enemies) {
      if (enemy.dead || !this.character.isColliding(enemy)) continue;
      if (this.character.isAbove(enemy)) {
        this.handleStomp(enemy);
        return;
      }
      this.handleDamage();
    }
  }

  /**
   * Handles stomp logic when the character lands on an enemy from above.
   * Kills all enemies currently colliding with the character (multi-stomp),
   * triggers a bounce jump, and removes defeated enemies from the level.
   *
   * @param {Object} enemy - The enemy that triggered the stomp event.
   */
  handleStomp(enemy) {
    for (let otherEnemy of this.level.enemies) {
      if (this.character.isColliding(otherEnemy)) {
        otherEnemy.die();
      }
    }

    this.character.jump();
    this.character.y = 160;
    this.removeDeadChicken();
  }

  /**
   * Applies damage to the character if they collide with an enemy
   * without performing a stomp. Updates the status bar accordingly.
   */
  handleDamage() {
    if (!this.character.isHurt()) {
      this.character.hit();
      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /**
   * Handles coin pickups and updates the coin status bar.
   */
  checkCollisionCharacterWithCoin() {
    this.level.coin = this.level.coin.filter((coin) => {
      if (this.character.isColliding(coin)) {
        this.character.getCoin();
        this.coinStatusBar.setPercentage(this.character.coin);
        playSound(this.character.coinAudio);
        return false;
      }
      return true;
    });
  }

  /**
   * Handles bottle pickups and updates the bottle status bar.
   */
  checkCollisionCharacterWithBottle() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
        this.character.getBottle();
        this.bottleStatusBar.setPercentage(this.character.bottle);
        return false;
      }
      return true;
    });
  }

  /**
   * Handles collisions between thrown bottles and enemies.
   * Includes splash animation, bottle removal, and enemy damage.
   */
  checkCollisionEnemyWithThrowableBottle() {
    this.level.enemies.forEach((enemy) => {
      this.throwableObject.forEach((bottle) => {
        if (!bottle.isColliding(enemy)) return;

        bottle.playAnimation(bottle.BOTTLE_SPLASH);
        this.removeUsedBottle(bottle);

        if (enemy instanceof Endboss) {
          enemy.hitEndboss();
          this.endbossStautsBar.setPercentage(enemy.energy);
        } else {
          enemy.die();
          this.removeDeadChicken();
        }
      });
    });
  }

  /**
   * Removes a used bottle from the throwable objects list.
   * @param {ThrowableObject} bottle - The bottle to remove.
   */
  removeUsedBottle(bottle) {
    this.throwableObject = this.throwableObject.filter(
      (currentBottle) => currentBottle !== bottle,
    );
  }

  /**
   * Removes dead chickens from the enemy list after a short delay.
   */
  removeDeadChicken() {
    setTimeout(() => {
      this.level.enemies = this.level.enemies.filter((enemy) => !enemy.dead);
    }, 1000);
  }

  /**
   * Clears the canvas and draws all world elements.
   * Uses requestAnimationFrame for smooth rendering.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackground();
    this.drawGameObjects();
    this.drawHUD();
    this.drawEndbossStatus();

    requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws background objects with camera offset.
   */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws HUD elements such as health, coins, and bottles.
   */
  drawHUD() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
  }

  /**
   * Draws the endboss status bar once the player reaches the boss area.
   */
  drawEndbossStatus() {
    if (this.character.x > 1300) {
      this.hadFirstContactWithEndboss = true;
    }
    if (this.hadFirstContactWithEndboss) {
      this.addToMap(this.endbossStautsBar);
    }
  }

  /**
   * Draws all game objects with camera offset.
   */
  drawGameObjects() {
    this.ctx.translate(this.camera_x, 0);

    [
      this.character,
      ...this.level.clouds,
      ...this.level.enemies,
      ...this.level.coin,
      ...this.level.bottles,
      ...this.throwableObject,
    ].forEach((obj) => this.addToMap(obj));

    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws a single object, flipping it if necessary.
   * @param {MovableObject} mo - The object to draw.
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /**
   * Draws an array of objects.
   * @param {MovableObject[]} objects - The objects to draw.
   */
  addObjectToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /**
   * Flips an object horizontally for mirrored rendering.
   * @param {MovableObject} mo - The object to flip.
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Restores the original orientation after flipping.
   * @param {MovableObject} mo - The object to restore.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
