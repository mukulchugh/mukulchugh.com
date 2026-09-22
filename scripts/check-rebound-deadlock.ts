import assert from "node:assert/strict";
import { clamp, H, initial, move, step } from "../components/rebound/physics";

// Screenshot reconstruction: puck against the lower-right rail, beyond AI reach.
const game = initial();
game.puck = { vx: 0, vy: 0, x: 945, y: H - 46 };
game.opponent = { vx: 0, vy: 0, x: 900, y: H - 70 };
let outcome: ReturnType<typeof step> = null;
let elapsed = 0;
for (let i = 0; i < 240 * 5 && !outcome; i++) {
  const now = (i / 240) * 1000;
  move(
    game.opponent,
    clamp(game.puck.x + 42, 565, 900),
    clamp(game.puck.y + Math.sin(now / 850) * 22, 70, H - 70),
    290,
    1 / 240
  );
  outcome = step(game, 1 / 240);
  elapsed += 1 / 240;
}
assert.ok(
  outcome || game.puck.x < 850,
  "Corner puck must escape or end the rally within five seconds"
);
assert.equal(outcome, "dead-ball");
assert.ok(
  elapsed >= 3 && elapsed < 3.02,
  "Recovery must occur after three seconds"
);
// A moving puck must not trigger recovery; normal shots must enter goal mouths.
const shot = initial();
shot.puck = { vx: 400, vy: 0, x: 920, y: H / 2 };
shot.opponent.y = 70;
let scored: ReturnType<typeof step> = null;
for (let i = 0; i < 120 && !scored; i++) scored = step(shot, 1 / 240);
assert.equal(scored, "player");
console.log("Corner recovery passed", outcome);
