class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;
  speed = 0.50;
  constructor() {
    super().loadImage("./img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  animate() {
       setInterval(() => {
    this.moveLeft();
    }, 50);
  }
  
  moveLeft() {
    this.x -= this.speed;
    
  }
}
