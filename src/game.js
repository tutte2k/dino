import Background from "./background.js";

export default class Game {
  constructor() {
    this.player = {
      sprite: new SpriteSheet(assets.player, 170.571, 119, 10),
      x: canvas.width * 0.1,
      y: canvas.height * 0.75,
      reward: () => console.log("reward"),
      penalize: () => console.log("penalize"),
    };

    this.totalScore = 0;
    this.width = canvas.width;
    this.height = canvas.height;

    this.widthPercentage = canvas.getBoundingClientRect().width / this.width;
    this.heightPercentage = canvas.getBoundingClientRect().height / this.height;
    this.wordContainer = document.getElementById("words");

    this.dinoTimer = 0;
    this.dinoInterval = 5000;
    this.dinos = [];
    this.focus = null;
    this.speed = 1;

    this.background = new Background(this);
  }
  onResize() {
    this.widthPercentage = canvas.getBoundingClientRect().width / this.width;
    this.heightPercentage = canvas.getBoundingClientRect().height / this.height;
  }
  update(deltaTime) {
    this.background.update();
    this.player.sprite.update(deltaTime);

    this.dinos.forEach((dino) => {
      dino.update(deltaTime);
      if (dino.markedForDeletion === true) {
        dino.die();
        this.focus = null;
      }
    });

    this.dinos = this.dinos.filter((dino) => !dino.markedForDeletion);

    // const holdingTheDoor = this.enemies.length < 3;
    // holdingTheDoor ? (this.dinoInterval -= 15) : (this.dinoInterval += 5);

    const noEnemies = this.dinos.length === 0;
    const spawnTimerElapsed = this.dinoTimer > this.dinoInterval;
    if (noEnemies || spawnTimerElapsed) {
      this.adddino();
      this.dinoTimer = 0;
    } else {
      this.dinoTimer += deltaTime;
    }
  }
  draw(ctx) {
    this.background.draw(ctx);
    this.player.sprite.draw(ctx, player.x, player.y);
    this.dinos.forEach((dino) => dino.draw(ctx));
  }

  findFocus(key, game) {
    const dino = this.dinos.find((dino) => {
      return dino.text.startsWith(key);
    });
    if (dino) {
      dino.focused = true;
      return dino;
    } else {
      if (!okKeys.includes(key)) {
        // game.userInterface.displayMissedKey(key);
        game.player.penalize();
      }
      return null;
    }
  }
  adddino() {
    const alphabet =
      "a b c d e f g h i j k l m n o p q r s t u v x y z å ä ö".split(" ");

    this.dinos.push(
      new Dino(alphabet[Math.floor(Math.random() * alphabet.length)], game)
    );
  }
}
