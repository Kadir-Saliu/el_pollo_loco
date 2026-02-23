class Coin extends MovableObject {
  IMAGES_COINS = ["./img/8_coin/coin_1.png", "./img/8_coin/coin_2.png"];

  constructor() {
    super().loadImage("./img/8_coin/coin_1.png");
    this.loadImages(this.IMAGES_COINS);
    this.height = 60;
    this.width = 60;
    this.x = 400 + Math.floor(Math.random() * 9) * 80;
    this.y = 200 + Math.random() * 100;
    this.animate();
  }

  /**
   * Starts the coin animation by cycling through coin images at a fixed interval.
   */
  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_COINS);
    }, 300);
  }
}
