class World {
  character = new Character();
  level = level1;
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

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.setWorld();
    this.character.animate();
    this.draw();
    this.setWorld();
    this.run();
  }

 setWorld() {
  this.character.world = this;
  this.level.enemies.forEach(enemy => {
    if (enemy instanceof Endboss) {
      enemy.world = this;
      enemy.animate();
    }
  });
}

  run() {
    setInterval(() => {
      this.checkCollision();
      this.checkThrowObjects();
    }, 1000 / 60);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.character.bottle > 0) {
      const now = new Date().getTime();
      if (now - this.lastBottleThrow > this.cooldown) {
        this.throwBottle();
      }
    }
  }

  throwBottle() {
    this.lastBottleThrow = new Date().getTime();
    let bottle = new ThrowableObject(
      this.character.x + 50,
      this.character.y + 50
    );
    this.throwableObject.push(bottle);
    this.character.bottle = Math.max(0, this.character.bottle - 20);
    this.bottleStatusBar.setPercentage(this.character.bottle);
    this.checkCollision();
  }

  checkCollision() {
    this.checkCollisionEnemyWithCharacter();
    this.checkCollisionCharacterWithCoin();
    this.checkCollisionCharactkerWhithBottle();
    this.checkCollisionEnemyWithThrowableBottle();
  }

  checkCollisionEnemyWithCharacter() {
    this.level.enemies.forEach((enemy) => {
      if (!enemy.dead && this.character.isColliding(enemy)) {
        if (this.character.isAbove(enemy)) {
          enemy.die();
          this.character.jump();
          this.removeDeadChicken();
        } else {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
        }
      }
    });
  }

  checkCollisionCharacterWithCoin() {
    this.level.coin = this.level.coin.filter((coin) => {
      if (this.character.isColliding(coin)) {
        this.character.getCoin();
        this.coinStatusBar.setPercentage(this.character.coin);
        this.character.coinAudio.play();
        return false;
      }
      return true;
    });
  }

  checkCollisionCharactkerWhithBottle() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (this.character.isColliding(bottle)) {
        this.character.getBottle();
        this.bottleStatusBar.setPercentage(this.character.bottle);
        return false;
      }
      return true;
    });
  }

  checkCollisionEnemyWithThrowableBottle() {
    this.level.enemies.forEach((enemy) => {
      this.throwableObject.forEach((bottle) => {
        if (bottle.isColliding(enemy)) {
          if (enemy instanceof Endboss) {
            enemy.hitEndboss();
            this.endbossStautsBar.setPercentage(enemy.energy);
            bottle.playAnimation(bottle.BOTTLE_SPLASH);
             this.removeUsedBottle(bottle);
            console.log( bottle.playAnimation(bottle.BOTTLE_SPLASH));
          } else {
            enemy.die();
            this.removeDeadChicken(enemy);
            bottle.playAnimation(bottle.BOTTLE_SPLASH);
            this.removeUsedBottle(bottle);
          }
        }
      });
    });
  }

  removeUsedBottle(bottle) {
    this.throwableObject = this.throwableObject.filter(
      (currentBottle) => currentBottle !== bottle
    );
  }

  removeDeadChicken() {
    setTimeout(() => {
      this.level.enemies = this.level.enemies.filter((enemy) => !enemy.dead);
    }, 1000);
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.coinStatusBar);
    this.addToMap(this.bottleStatusBar);
    if (this.character.x > 1300) {
      this.hadFirstContactWithEndboss = true;
      this.addToMap(this.endbossStautsBar);
    }

    if (this.hadFirstContactWithEndboss === true && this.character.x < 1300) {
      this.addToMap(this.endbossStautsBar);
    }

    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectToMap(this.level.clouds);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.level.coin);
    this.addObjectToMap(this.level.bottles);
    this.addObjectToMap(this.throwableObject);

    this.ctx.translate(-this.camera_x, 0);

    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
