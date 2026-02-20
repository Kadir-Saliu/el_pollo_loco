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

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 150;
    }
  }

  isAbove(mo) {
    console.log(this.y + this.height < mo.y);
    return this.y + this.height < mo.y + 80;
  }

  isColliding(mo) {
    return (
      this.x + this.width > mo.x &&
      this.y + this.height > mo.y &&
      this.x < mo.x + mo.width &&
      this.y < mo.y + mo.height
    );
  }

  hit() {
    this.energy -= 5;
    if (this.energy <0) {
      this.energy = 0;
      this.stopGame();
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  hitEndboss(){
    this.energy -= 33;
    if (this.energy <= 0) {
      this.energy = 0;
      this.winGame();
    } else {
      this.lastHit = new Date().getTime();
    }
  
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  isDead() {
    return this.energy == 0;
  }

  getCoin() {
    return (this.coin += 20);
  }

  getBottle() {
    return (this.bottle += 20);
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }

  jump() {
    this.speedY = 30;
    this.world.character.jumpAudio.play();
  }

  stopGame() {
    document.getElementById('canvasWrapper').classList.add('d_none');
    canvas.classList.add("d_none");
    document.getElementById("canvas-controls").classList.remove("active");
    endScreen.classList.remove("d_none");
  }

  winGame() {
    document.getElementById('canvasWrapper').classList.add('d_none');
    canvas.classList.add("d_none");
    document.getElementById("canvas-controls").classList.remove("active");
    winScreen.classList.remove("d_none");
    document.getElementById('win-img').classList.remove('d_none');
  }
}
