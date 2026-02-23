class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  /**
   * Loads a single image and assigns it as the object's current image.
   * @param {string} path - File path of the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object's current image on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
   */
  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      console.warn("Error loading image", error);
      console.log("Could not load image", this.img.src);
    }
  }

  /**
   * Draws a debug frame around the object.
   * Intended for subclasses that implement hitbox visualization.
   * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
   */
  drawFrame(ctx) {}

  /**
   * Loads multiple images into the object's image cache.
   * @param {string[]} arr - Array of image file paths to load.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}