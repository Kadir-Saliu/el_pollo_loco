class Chicken extends MovableObject {
  y = 360;
  x = 400;
  height = 60;
  width = 80;
  dead = false;

  IMAGES_WALKING = [
    "./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "./img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEATH = ["./img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  chickenAudio = new Audio("audio/chicken-noise-228106.mp3");

  constructor() {
    super();
    this.offset = {
      top: 15,
      bottom: 5,
      left: 10,
      right: 10,
    };
    this.loadImage("./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEATH);
    this.x = 400 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
    allSounds.push(this.chickenAudio);
  }

  /**
   * Starts movement and animation loops for the chicken.
   */
  animate() {
    setInterval(() => this.moveChicken(), 1000 / 60);
    setInterval(() => {
      if (this.dead) {
        this.playAnimation(this.IMAGES_DEATH);
        return;
      }
      this.playAnimation(this.IMAGES_WALKING);
    }, 100);
  }

  /**
   * Moves the chicken left unless it is dead.
   */
  moveChicken() {
    if (!this.dead) {
      this.x -= this.speed;
    }
  }

  /**
   * Marks the chicken as dead, plays the death animation,
   * and schedules its removal from the world.
   */
  die() {
    this.dead = true;
    this.speed = 0;

    this.playAnimation(this.IMAGES_DEATH);

    setTimeout(() => {
      this.y += 20;
    }, 100);

    setTimeout(() => {
      this.markForRemoval = true;
    }, 500);
  }

  /**
   * Repeatedly plays the chicken sound unless the chicken is dead.
   */
  playSpawnSound() {
    this.spawnSoundInterval = setInterval(() => {
      if (this.dead) {
        this.stopChickenSound();
        return;
      }
      if (this.chickenAudio.paused) {
        this.chickenAudio.play();
      }
    }, 1000);
  }

  /**
   * Stops the chicken sound and clears the sound interval.
   */
  stopChickenSound() {
    this.chickenAudio.pause();
    this.chickenAudio.currentTime = 0;
    clearInterval(this.spawnSoundInterval);
  }
}
