class BottleStatusBar extends DrawableObject {
  IMAGES = [
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "./img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  percentage = 0;

  /**
   * Creates a new bottle status bar and initializes its position,
   * size, images, and starting percentage.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 30;
    this.y = 90;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Updates the displayed percentage and loads the corresponding image.
   * @param {number} percentage - The new percentage value (0–100).
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current percentage.
   * @returns {number} The resolved image index (0–5).
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }
}
