class ThrowableObject extends MovableObject {
  BOTTLE_SPLASH = [
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "./img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  BOTTLE_ROTATION = [
    "./img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "./img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  constructor(x, y, otherDirection) {
    super().loadImage("./img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.BOTTLE_ROTATION);
    this.loadImages(this.BOTTLE_SPLASH);
    this.x = x;
    this.y = y;
    this.otherDirection = otherDirection;
    this.height = 60;
    this.width = 50;
    this.otherDirection = this.otherDirection;
    this.throw();
  }

  /**
   * Throws the bottle by applying upward force, enabling gravity,
   * and playing the rotation animation while moving forward.
   */
  throw() {
    this.speedY = 30;
    this.applyGravity();

    setInterval(() => {
      this.playAnimation(this.BOTTLE_ROTATION);

      if (this.otherDirection) {
        this.x -= 10;
      } else {
        this.x += 10;
      }
    }, 25);
  }
}
