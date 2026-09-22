import assert from "node:assert/strict";
import { opponentState, updateOpponent } from "../components/rebound/opponent";
import { H, initial, step } from "../components/rebound/physics";

function finish(game: ReturnType<typeof initial>, ai = false) {
  const brain = opponentState();
  for (let i = 0; i < 240 * 8; i++) {
    if (ai) updateOpponent(game, brain, 1 / 240);
    const event = step(game, 1 / 240);
    if (event) return event;
  }
  return null;
}

for (const direction of [-1, 1]) {
  for (const y of [H / 2 - 48, H / 2, H / 2 + 48]) {
    const game = initial();
    game.player.y = 70;
    game.opponent.y = 70;
    game.puck = {
      vx: direction * 500,
      vy: 0,
      x: direction === 1 ? 850 : 150,
      y,
    };
    assert.equal(
      finish(game),
      direction === 1 ? "player" : "opponent",
      `Goal mouth at y=${y}, direction=${direction}`
    );
  }
  const own = initial();
  const mallet = direction === -1 ? own.player : own.opponent;
  mallet.x = direction === -1 ? 160 : 840;
  mallet.vx = direction * 400;
  own.puck = { vx: 0, vy: 0, x: mallet.x + direction * 45, y: H / 2 };
  step(own, 1 / 240);
  mallet.vx = 0;
  assert.equal(
    Math.sign(own.puck.vx),
    direction,
    "Paddle must be able to strike toward its own net"
  );
  assert.equal(
    finish(own),
    direction === -1 ? "opponent" : "player",
    "Own goal credits the other side"
  );
  const wall = initial();
  wall.puck = {
    vx: direction * 500,
    vy: 0,
    x: direction === 1 ? 944 : 56,
    y: 100,
  };
  assert.equal(step(wall, 1 / 120), null);
  assert.equal(
    Math.sign(wall.puck.vx),
    -direction,
    "Solid rail outside opening must rebound"
  );
}
const match = initial();
match.puck = { vx: 900, vy: 0, x: 470, y: 80 };
assert.equal(
  finish(match, true),
  "player",
  "A rail shot can score against the active opponent"
);
console.log(
  "Both goal mouths, both own goals, solid rails and active-AI scoring passed."
);
