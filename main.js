import Game from "./src/game.js";


export const canvas = document.getElementById("cvs");
canvas.width = 2048;
canvas.height = 1546;

export const assets = {
  player: document.getElementById("player"),
  dinos: { protoceratosaurus: document.getElementById("protoceratosaurus") },
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
export const ui = {
  wordContainer: document.getElementById("words"),
  scroller: document.getElementById("scroller")
}
export const controls = [
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
      } else if (controls.includes(e.key)) {
        game.player.penalize();
      }
    } else {
      game.focus = game.findFocus(e.key, game);
      if (game.focus) {
        const hit = game.focus.consume(e.key);
        if (hit) {
          game.player.reward();
        } else if (!controls.includes(e.key)) {
          game.player.penalize();
        }
      }
    }
  });
  window.addEventListener("keyup", (e) => {
    e.preventDefault();
  });
  window.addEventListener("resize", () => {
    game.onResize();
  });
}


const ctx = canvas.getContext("2d");
const game = new Game(canvas);

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


