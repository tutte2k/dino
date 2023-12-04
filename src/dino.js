import { assets } from "../main.js";
import SpriteSheet from "./spritesheet.js";
export default class Dino {
  constructor(word, game) {
    this.game = game;
    this.word = word;
    this.text = word;
    this.completedText = "";
    this.x = this.game.width;
    this.width = 287;
    this.height = 190;
    this.y = this.game.height * 0.7;
    this.element = document.createElement("div");

    this.sprite = new SpriteSheet(
      assets.dinos.protoceratosaurus,
      this.width,
      this.height,
      20
    );
    this.showElement(word, this.element);
    this.speed = 1;
  }
  showElement(word, element) {
    this.element.classList.add("word");
    this.element.innerHTML = word.toUpperCase();
    this.element.style.position = "absolute";
    this.game.wordContainer.appendChild(element);
  }
  draw(ctx) {
    this.element.style.top =
      this.y * this.game.heightPercentage +
      (this.height * this.game.heightPercentage) / 2 +
      "px";

    this.element.style.left =
      (this.width * this.game.widthPercentage) / 2 +
      (this.x - this.width * 0.5) * this.game.widthPercentage +
      "px";
    this.sprite.draw(ctx, this.x, this.y);
  }
  update(deltaTime) {
    this.x -= this.game.speed + this.speed;
    if (this.x < this.game.width * 0.1) {
      this.markedForDeletion = true;
      this.remove();
    }
    this.sprite.update(deltaTime);
  }
  consume(key) {
    const length = this.completedText.length + 1;
    const isNextChar =
      this.text.substring(0, length) === this.completedText + key;
    if (isNextChar) {
      this.completedText += key;
      this.x += this.game.player.impact;
    }
    this.markedForDeletion = !(this.completedText !== this.text);
    return isNextChar;
  }
  die() {
    console.log("dead");
    this.markedForDeletion = true;
    this.remove();
  }
  remove() {
    console.log("remove");
    this.element.hidden = true;
    this.element.remove();
  }
}
