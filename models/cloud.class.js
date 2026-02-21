class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;
  speed = 0.5;
  constructor() {
    super().loadImage("./img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 500;
    this.animate();
  }

  /**
   * Starts the left‑movement loop for the chicken.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 50);
  }

  /**
   * Moves the chicken to the left based on its speed.
   */
  moveLeft() {
    this.x -= this.speed;
  }
}
