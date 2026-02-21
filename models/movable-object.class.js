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

  /**
   * Applies gravity to the object, updating vertical position and speed.
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
   * Checks whether the object is above the ground level.
   *
   * @returns {boolean} True if above ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 150;
    }
  }

  /**
   * Checks if this object is positioned above another object.
   *
   * @param {object} mo - The other object.
   * @returns {boolean} True if above.
   */
  isAbove(mo) {
    console.log(this.y + this.height < mo.y);
    return this.y + this.height < mo.y + 80;
  }

  /**
   * Checks for collision with another object.
   *
   * @param {object} mo - The other object.
   * @returns {boolean} True if colliding.
   */
  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  /**
   * Applies damage to the player and ends the game if energy reaches zero.
   */
  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
      this.stopGame();
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Applies damage to the endboss and triggers win logic if defeated.
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
   * Checks if the object is currently in a hurt state.
   *
   * @returns {boolean} True if hurt.
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Checks if the object is dead.
   *
   * @returns {boolean} True if energy is zero.
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Increases the coin counter.
   *
   * @returns {number} Updated coin value.
   */
  getCoin() {
    return (this.coin += 20);
  }

  /**
   * Increases the bottle counter.
   *
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
