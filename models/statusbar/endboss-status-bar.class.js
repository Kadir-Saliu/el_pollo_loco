class EndbossStatusBar extends DrawableObject {
  IMAGES = [
    "./img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    "./img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "./img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "./img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "./img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "./img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 450;
    this.y = 10;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

/**
 * Sets the current percentage and updates the displayed image.
 *
 * @param {number} percentage - The new percentage value.
 */
setPercentage(percentage) {
  this.percentage = percentage;
  let path = this.IMAGES[this.resolveImageIndex()];
  this.img = this.imageCache[path];
}

/**
 * Returns the image index based on the current percentage (0–100).
 *
 * @returns {number} The image index from 0 to 5.
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
