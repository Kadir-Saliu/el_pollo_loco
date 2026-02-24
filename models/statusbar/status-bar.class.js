class StatusBar extends DrawableObject {
  IMAGES = [];
  percentage = 0;

  /**
   * Creates a flexible status bar.
   * @param {string[]} images
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {number} percentage
   */
  constructor(images, x, y, width, height, percentage) {
    super();
    this.IMAGES = images;
    this.loadImages(this.IMAGES);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.setPercentage(percentage);
  }

  /**
   * Sets the percentage and updates the displayed image.
   * @param {number} percentage
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the correct image index based on percentage.
   * @returns {number}
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
