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
    this.draw();
    this.run();
  }

  /** Links the world to the character and initializes endboss behavior. */
  setWorld() {
    this.character.world = this;
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        enemy.world = this;
        enemy.animate();
      }
    });
  }

  /** Starts the main game loop for collision checks and throw logic. */
  run() {
    setInterval(() => {
      if (gameStopped) return;
      this.checkCollision();
      this.checkThrowObjects();
    }, 1000 / 60);
  }

  /** Checks whether the player can throw a bottle. */
  checkThrowObjects() {
    if (!this.keyboard.D || this.character.bottle <= 0) return;
    if (Date.now() - this.lastBottleThrow > this.cooldown) this.throwBottle();
  }

  /** Creates and launches a throwable bottle. */
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

  /** Runs all collision checks. */
  checkCollision() {
    this.checkCollisionEnemyWithCharacter();
    this.checkCollisionCharacterWithCoin();
    this.checkCollisionCharacterWithBottle();
    this.checkCollisionEnemyWithThrowableBottle();
  }

  /** Checks collisions between the character and enemies. */
  checkCollisionEnemyWithCharacter() {
    for (let enemy of this.level.enemies) {
      if (enemy.dead || !this.character.isColliding(enemy)) continue;

      if (this.character.isAbove(enemy)) {
        this.handleStomp(enemy);
        return;
      }

      if (!this.character.isHurt()) {
        this.character.hitCharacter(enemy instanceof Endboss ? 20 : 5);
      }

      this.statusBar.setPercentage(this.character.energy);
    }
  }

  /** Handles stomp logic. */
  handleStomp(enemy) {
    for (let otherEnemy of this.level.enemies) {
      if (this.character.isColliding(otherEnemy)) otherEnemy.die();
    }
    this.character.jump();
    this.character.y = 160;
    this.removeDeadChicken();
  }

  /** Handles coin pickups. */
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

  /** Handles bottle pickups. */
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

  /** Handles collisions between thrown bottles and enemies. */
  checkCollisionEnemyWithThrowableBottle() {
    if (gameStopped) return;
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

  /** Removes a used bottle. */
  removeUsedBottle(bottle) {
    this.throwableObject = this.throwableObject.filter(
      (currentBottle) => currentBottle !== bottle,
    );
  }

  /** Removes dead chickens after a delay. */
  removeDeadChicken() {
    setTimeout(() => {
      this.level.enemies = this.level.enemies.filter((enemy) => !enemy.dead);
    }, 1000);
  }

  /** Clears the canvas and draws all world elements. */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
    this.drawGameObjects();
    this.drawHUD();
    this.drawEndbossStatus();
    requestAnimationFrame(() => this.draw());
  }

  /** Draws background objects. */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /** Draws HUD elements. */
  drawHUD() {
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
  }

  /** Draws the endboss status bar. */
  drawEndbossStatus() {
    if (this.character.x > 1300) this.hadFirstContactWithEndboss = true;
    if (this.hadFirstContactWithEndboss) this.addToMap(this.endbossStautsBar);
  }

  /** Draws all game objects. */
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

  /** Draws a single object. */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
  }

  /** Draws an array of objects. */
  addObjectToMap(objects) {
    objects.forEach((o) => this.addToMap(o));
  }

  /** Flips an object horizontally. */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /** Restores original orientation. */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
