export default class SpriteSheet {
  constructor(image, width, height, fps) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.fps = fps;
    this.timer = 0;
    this.interval = 1000 / fps;

    this.columns = Math.floor(image.width / width);
    this.rows = Math.floor(image.height / height);
    this.hasMultipleRows = this.rows > 1;

    this.frameX = 0;
    this.frameY = 0;
  }

  update(deltaTime) {
    const isTimerElapsed = this.timer > this.interval;
    const isAtEndOfCol = this.frameX === this.columns - 1;
    const isAtEndOfRow = this.frameY === this.rows - 1;
    if (isTimerElapsed) {
      this.frameX = isAtEndOfCol ? 0 : this.frameX + 1;
      if (this.hasMultipleRows && isAtEndOfCol && !isAtEndOfRow) {
        this.frameY++;
      } else if (this.hasMultipleRows && isAtEndOfCol && isAtEndOfRow) {
        this.frameX = 0;
        this.frameY = 0;
      }
      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }
  }

  draw(context, x, y) {
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      x,
      y,
      this.width,
      this.height
    );
  }
}