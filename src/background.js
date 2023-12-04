import { assets } from "../main.js";
export default class Background {
  constructor(game) {
    const { sky, sun, buildings, trees, ground } = assets.background;
    const { farthest, far, near, nearest } = buildings;
    this.layers = [
      [sky, 0],
      [sun, 0],
      [farthest, 0.1],
      [far, 0.2],
      [near, 0.3],
      [nearest, 0.4],
      [trees, 1],
      [ground, 1],
    ].map(([image, scrollingSpeed]) => new Layer(game, image, scrollingSpeed));
  }
  update() {
    this.layers.forEach((layer) => layer.update());
  }
  draw(ctx) {
    this.layers.forEach((layer) => layer.draw(ctx));
  }
}
class Layer {
  constructor(game, image, speedModifier) {
    this.game = game;
    this.image = image;
    this.speedModifier = speedModifier;
    this.width = 2048;
    this.height = 1546;
    this.x = 0;
    this.y = 0;
  }
  update() {
    if (this.x <= -this.width) {
      this.x = 0;
    }
    this.x -= this.game.speed * this.speedModifier;
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y);
    ctx.drawImage(this.image, this.x + this.width - 1, this.y);
  }
}
