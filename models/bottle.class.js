class Bottle extends MovableObject {
  IMAGES_BOTTLES = ["../img/6_salsa_bottle/1_salsa_bottle_on_ground.png", "../img/6_salsa_bottle/2_salsa_bottle_on_ground.png"];

  constructor() {
    super().loadImage("../img/6_salsa_bottle/1_salsa_bottle_on_ground.png");
    this.loadImages(this.IMAGES_BOTTLES);
    this.height = 60;
    this.width = 60 ;
    this.x = 400 + Math.floor(Math.random() * 10) * 80;
    this.y = 370;
    
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_BOTTLES);
    }, 300);
  }
}
