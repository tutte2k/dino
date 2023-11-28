const canvas = document.getElementById("cvs");
canvas.width = 1700;
canvas.height = 1546;
const ctx = canvas.getContext("2d");
const assets = {
  player: document.getElementById("player"),
  background: {
    sky: document.getElementById("layer1"),
    sun: document.getElementById("layer8"),
    buildings: {
      farthest: document.getElementById("layer7"),
      far: document.getElementById("layer6"),
      near: document.getElementById("layer5"),
      nearest: document.getElementById("layer4"),
    },
    trees: document.getElementById("layer3"),
    ground: document.getElementById("layer2"),
  },
};

const okKeys = [
  "ArrowLeft",
  "ArrowDown",
  "ArrowUp",
  "ArrowRight",
  "Shift",
  "Tab",
  " ",
  "Alt",
  "Control",
  "AltGraph",
  "Meta",
  "Dead",
];
function addEventListeners() {
  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (game.focus) {
      const hit = game.focus.consume(e.key);
      if (hit) {
        game.player.reward();
      } else if (okKeys.includes(e.key)) {
        game.player.penalize();
      }
    } else {
      game.focus = game.findFocus(e.key, game);
      if (game.focus) {
        const hit = game.focus.consume(e.key);
        if (hit) {
          game.player.reward();
        } else if (!okKeys.includes(e.key)) {
          game.player.penalize();
        }
      }
    }
    // console.log("game.inputHandler.keyDown(e)");
    // console.log("map.inputHandler.keyDown(e);");
  });
  window.addEventListener("keyup", (e) => {
    e.preventDefault();
    // console.log("game.inputHandler.keyUp(e);");
    // console.log("map.inputHandler.keyUp(e);");
  });
  window.addEventListener("resize", () => {
    game.onResize();
    // console.log("game.onResize();");
  });
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
class Background {
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

class Game {
  constructor(player) {
    this.player = player;
    this.totalScore = 0;
    this.width = canvas.width;
    this.height = canvas.height;

    this.widthPercentage = canvas.getBoundingClientRect().width / this.width;
    this.heightPercentage = canvas.getBoundingClientRect().height / this.height;
    this.wordContainer = document.getElementById("words");

    this.enemyTimer = 0;
    this.enemyInterval = 5000;
    this.enemies = [];
    this.focus = null;
    this.speed = 1;

    this.background = new Background(this);
  }
  onResize() {
    this.widthPercentage =
      Global.Canvas.getBoundingClientRect().width / this.width;
    this.heightPercentage =
      Global.Canvas.getBoundingClientRect().height / this.height;
  }
  update(deltaTime) {
    this.background.update();
    this.player.sprite.update(deltaTime);

    this.enemies.forEach((enemy) => {
      enemy.update(deltaTime);
      if (enemy.markedForDeletion === true) {
        enemy.die();
        this.focus = null;
      }
    });

    this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);

    // const holdingTheDoor = this.enemies.length < 3;
    // holdingTheDoor ? (this.enemyInterval -= 15) : (this.enemyInterval += 5);

    const noEnemies = this.enemies.length === 0;
    const spawnTimerElapsed = this.enemyTimer > this.enemyInterval;
    if (noEnemies || spawnTimerElapsed) {
      this.addEnemy();
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
  }
  draw(ctx) {
    this.background.draw(ctx);
    this.player.sprite.draw(ctx, player.x, player.y);
    this.enemies.forEach((enemy) => enemy.draw(ctx));
  }

  findFocus(key, game) {
    const enemy = this.enemies.find((enemy) => {
      return enemy.text.startsWith(key);
    });
    if (enemy) {
      enemy.focused = true;
      return enemy;
    } else {
      if (!okKeys.includes(key)) {
        // game.userInterface.displayMissedKey(key);
        game.player.penalize();
      }
      return null;
    }
  }
  addEnemy() {
    const alphabet =
      "a b c d e f g h i j k l m n o p q r s t u v x y z å ä ö".split(" ");

    this.enemies.push(
      new Trash(alphabet[Math.floor(Math.random() * alphabet.length)], game)
    );
  }
}

class Trash {
  constructor(word, game) {
    this.game = game;
    this.word = word;
    this.text = word;
    this.completedText = "";
    this.x = this.game.width;
    this.height = 50;
    this.width = 50;
    this.y = canvas.height * 0.8;
    this.element = document.createElement("div");
    this.showElement(word, this.element);
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
  }
  update(deltaTime) {
    this.x -= this.game.speed;
    if (this.x < canvas.width * 0.1) {
      this.markedForDeletion = true;
      this.remove();
    }
    // this.sprite.update(deltaTime);
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
    this.markedForDeletion = true;
    this.remove();
  }
  remove() {
    this.element.hidden = true;
    this.element.remove();
  }
}

const player = {
  sprite: new SpriteSheet(assets.player, 170.571, 119, 10),
  x: canvas.width * 0.1,
  y: canvas.height * 0.8,
  reward: () => console.log("reward"),
  penalize: () => console.log("penalize"),
};

const game = new Game(player);

window.addEventListener("load", function () {
  addEventListeners();
  let lastTime = 0;

  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.draw(ctx);
    game.update(deltaTime);

    window.requestAnimationFrame(animate);
  }
  animate(0);
});
