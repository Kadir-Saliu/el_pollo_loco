class DrawableObject {
  img;
  imageChache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    try {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    } catch (error) {
      console.warn("Error loading image", error);
      console.log("Could not load image", this.img.src);
    }
  }

  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Coin
    ) {
      ctx.beginPath();
      ctx.lindeWidth = "5";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      ctx.stroke();
    }
  }

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageChache[path] = img;
    });
  }
}
