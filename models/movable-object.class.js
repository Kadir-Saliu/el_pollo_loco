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

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Returns the left collision boundary including offset.
   * @returns {number}
   */
  left() {
    return this.x + this.offset.left;
  }

  /**
   * Returns the right collision boundary including offset.
   * @returns {number}
   */
  right() {
    return this.x + this.width - this.offset.right;
  }

  /**
   * Returns the top collision boundary including offset.
   * @returns {number}
   */
  top() {
    return this.y + this.offset.top;
  }

  /**
   * Returns the bottom collision boundary including offset.
   * @returns {number}
   */
  bottom() {
    return this.y + this.height - this.offset.bottom;
  }

  /**
   * Applies gravity to the object, updating vertical position and velocity.
   * Runs at 25 FPS. Objects fall until they reach the ground or move upward.
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
   * Bottles have no ground and always fall.
   *
   * @returns {boolean} True if the object is above ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    }
    return this.y < 160;
  }

  /**
   * Checks whether this object is above another object AND falling downward.
   * Used for stomp logic (e.g., killing chickens).
   *
   * @param {MovableObject} mo - The object to compare against.
   * @returns {boolean} True if this object is stomping the other object.
   */
  isAbove(mo) {
    const stompMargin = 20;
    return this.speedY < 0 && this.bottom() - stompMargin <= mo.top();
  }

  /**
   * Checks whether this object collides with another object using
   * axis-aligned bounding box (AABB) collision detection.
   *
   * @param {MovableObject} mo - The other object.
   * @returns {boolean} True if the objects overlap.
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
   * Also triggers a short hurt state and forces the object to fall downward.
   */
  hit() {
    this.energy -= 5;
    this.speedY = -5;

    if (this.energy < 0) {
      this.energy = 0;
      this.stopGame();
    } else {
      this.lastHit = new Date().getTime();
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
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks whether the object is currently in a hurt state.
   * Hurt state lasts 1 second after being hit.
   *
   * @returns {boolean} True if the object is hurt.
   */
  isHurt() {
    let timepassed = (new Date().getTime() - this.lastHit) / 1000;
    return timepassed < 1;
  }

  /**
   * Checks whether the object is dead.
   * @returns {boolean} True if energy is zero.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Increases the coin counter.
   * @returns {number} Updated coin value.
   */
  getCoin() {
    return (this.coin += 20);
  }

  /**
   * Increases the bottle counter.
   * @returns {number} Updated bottle value.
   */
  getBottle() {
    return (this.bottle += 20);
  }

  /**
   * Plays the next frame of the given animation sequence.
   *
   * @param {string[]} images - Array of image paths.
   */
  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  /**
   * Makes the object jump by applying upward velocity.
   */
  jump() {
    this.speedY = 30;
    this.world.character.jumpAudio.play();
  }

  /**
   * Ends the game and shows the end screen.
   */
  stopGame() {
    this.showEndScreen(endScreen);
  }

  /**
   * Triggers the win screen.
   */
  winGame() {
    this.showEndScreen(winScreen);
  }

  /**
   * Displays the given end screen and hides the canvas.
   *
   * @param {HTMLElement} screen - The screen to show.
   */
  showEndScreen(screen) {
    document.getElementById("canvasWrapper").classList.add("d_none");
    canvas.classList.add("d_none");
    document.getElementById("canvas-controls").classList.remove("active");
    screen.classList.remove("d_none");
    screen.classList.add("d_flex");
  }
}
