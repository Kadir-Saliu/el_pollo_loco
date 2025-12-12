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

  constructor() {
    super();
    this.loadImage("./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEATH);
    this.x = 400 + Math.random() * 500;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }
  animate() {
    setInterval(() => {
      this.x -= this.speed;
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
    }, 100);
  }

  die() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_DEATH);
    }, 1);
    this.speed = 0;
    this.dead = true;
  }

  
}
