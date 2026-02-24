class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  coin = 0;
  bottle = 0;
  endScreen = document.getElementById("endScreen");

  offset = { top: 0, bottom: 0, left: 0, right: 0 };

  /** Returns the left collision boundary including offset. */
  left() {
    return this.x + this.offset.left;
  }

  /** Returns the right collision boundary including offset. */
  right() {
    return this.x + this.width - this.offset.right;
  }

  /** Returns the top collision boundary including offset. */
  top() {
    return this.y + this.offset.top;
  }

  /** Returns the bottom collision boundary including offset. */
  bottom() {
    return this.y + this.height - this.offset.bottom;
  }

  /**
   * Applies gravity to the object, updating vertical position and velocity.
   * Runs at 25 FPS.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  /**
   * Determines whether the object is above the ground.
   * Throwable objects always return true.
   */
  isAboveGround() {
    return this instanceof ThrowableObject || this.y < 160;
  }

  /**
   * Checks whether this object is above another object AND falling downward.
   */
  isAbove(mo) {
    return this.speedY < 0 && this.bottom() - 60 <= mo.top();
  }

  /**
   * Checks whether this object collides with another object using AABB detection.
   */
  isColliding(mo) {
    return (
      this.right() > mo.left() &&
      this.left() < mo.right() &&
      this.bottom() > mo.top() &&
      this.top() < mo.bottom()
    );
  }

  /**
   * Applies damage to the object. If energy reaches zero, the game ends.
   */
  hit() {
    this.energy -= 5;
    this.speedY = -5;

    if (this.energy < 0) {
      this.energy = 0;
      this.stopGame();
    } else {
      this.lastHit = Date.now();
    }
  }

  /**
   * Applies damage to the endboss. If energy reaches zero, the player wins.
   */
  hitEndboss() {
    this.energy -= 33;

    if (this.energy <= 0) {
      this.energy = 0;
      this.winGame();
    } else {
      this.lastHit = Date.now();
    }
  }

  /**
   * Checks whether the object is currently in a hurt state.
   * Hurt state lasts 1 second after being hit.
   */
  isHurt() {
    if (gameStopped) return false;
    return (Date.now() - this.lastHit) / 1000 < 1;
  }

  /** Checks whether the object is dead. */
  isDead() {
    return this.energy === 0;
  }

  /** Increases the coin counter. */
  getCoin() {
    return (this.coin += 20);
  }

  /** Increases the bottle counter. */
  getBottle() {
    return (this.bottle += 20);
  }

  /** Plays the next frame of the given animation sequence. */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /** Moves the object to the right. */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /** Moves the object to the left. */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  /** Makes the object jump by applying upward velocity. */
  jump() {
    if (gameStopped) return;
    this.speedY = 30;
    this.justLanded = false;
    playSound(this.jumpAudio);
  }

  /** Ends the game and shows the end screen. */
  stopGame() {
    this.showEndScreen(endScreen);
  }

  /** Triggers the win screen. */
  winGame() {
    this.showEndScreen(winScreen);
  }

  /** Displays the given end screen and hides the canvas. */
  showEndScreen(screen) {
    document.getElementById("canvasWrapper").classList.add("d_none");
    canvas.classList.add("d_none");
    document.getElementById("canvas-controls").classList.remove("active");
    screen.classList.remove("d_none");
    screen.classList.add("d_flex");
  }
}
