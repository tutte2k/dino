const canvas = document.getElementById("cvs");
canvas.width = 2500;
canvas.height = 1768;
const ctx = canvas.getContext("2d");
const assets = {
  player: document.getElementById("player"),
};
const player = {
  sprite: new SpriteSheet(assets.player, 170.571, 119, 13),
  x: 200,
  y: 200,
};

window.addEventListener("load", function () {
  addEventListeners();
  let lastTime = 0;

  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    
    player.sprite.draw(ctx, player.x, player.y);
    player.sprite.update(deltaTime);

    window.requestAnimationFrame(animate);
  }
  animate(0);
});

function addEventListeners() {
  window.addEventListener("keydown", (e) => {
    e.preventDefault();
    console.log("game.inputHandler.keyDown(e)");
    console.log("map.inputHandler.keyDown(e);");
  });
  window.addEventListener("keyup", (e) => {
    e.preventDefault();
    console.log("game.inputHandler.keyUp(e);");
    console.log("map.inputHandler.keyUp(e);");
  });
  window.addEventListener("resize", () => {
    console.log("game.onResize();");
  });
}
