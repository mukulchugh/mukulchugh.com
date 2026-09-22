import assert from "node:assert/strict";
import {
  opponentState,
  reflectedY,
  updateOpponent,
} from "../components/rebound/opponent";
import {
  clamp,
  GOAL_BOTTOM,
  GOAL_TOP,
  H,
  initial,
  move,
  step,
} from "../components/rebound/physics";

assert.equal(
  GOAL_BOTTOM - GOAL_TOP,
  121,
  "Taller field must not enlarge goals"
);
assert.equal(reflectedY(H - 46 + 20), H - 66);
assert.equal(reflectedY(26), 66);
// A passive player must not leave the AI waiting for a perfect incoming shot.
for (const seed of [1, 2, 3]) {
  for (const puck of [
    { vx: 0, vy: 0, x: 520, y: 250 },
    { vx: 0, vy: 0, x: 550, y: 180 },
    { vx: -100, vy: 60, x: 720, y: 250 },
  ]) {
    const game = initial(),
      brain = opponentState(seed);
    game.puck = { ...puck };
    let launched = false;
    for (let i = 0; i < 720; i++) {
      updateOpponent(game, brain, 1 / 240);
      const event = step(game, 1 / 240);
      if (game.puck.vx < -180) launched = true;
      if (event) break;
    }
    assert.ok(
      launched,
      `AI must initiate a shot: seed=${seed}, puck=${JSON.stringify(puck)}`
    );
  }
}
const metrics: Array<{
  opponent: string;
  shots: number;
  conceded: number;
  returned: number;
  unresolved: number;
}> = [];
for (const modern of [false, true]) {
  const counts = {
    conceded: 0,
    opponent: modern ? "predictive" : "original",
    returned: 0,
    shots: 0,
    unresolved: 0,
  };
  for (const y of [80, 150, H / 2, H - 150, H - 80])
    for (const angle of [-0.6, -0.3, 0, 0.3, 0.6])
      for (const velocity of [400, 650, 900])
        for (const phase of [0, 1500]) {
          const game = initial();
          const brain = opponentState(12_345 + phase + y);
          game.puck = {
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            x: 470,
            y,
          };
          let result = "unresolved";
          for (let i = 0; i < 240 * 5; i++) {
            if (modern) {
              const before = { ...game.opponent };
              updateOpponent(game, brain, 1 / 240);
              assert.ok(
                Math.hypot(
                  game.opponent.vx - before.vx,
                  game.opponent.vy - before.vy
                ) <=
                  2600 / 240 + 0.001
              );
              assert.ok(
                Math.hypot(game.opponent.vx, game.opponent.vy) <= 610.001
              );
            } else {
              const chase = game.puck.x > 510;
              move(
                game.opponent,
                chase ? clamp(game.puck.x + 42, 565, 900) : 805,
                clamp(
                  chase
                    ? game.puck.y +
                        Math.sin((phase + (i / 240) * 1000) / 850) * 22
                    : H / 2,
                  70,
                  H - 70
                ),
                290,
                1 / 240
              );
            }
            const event = step(game, 1 / 240);
            if (event === "player") {
              result = "conceded";
              break;
            }
            if (game.puck.x < 465 && game.puck.vx < 0) {
              result = "returned";
              break;
            }
            if (event) break;
          }
          counts.shots++;
          if (result === "conceded") counts.conceded++;
          else if (result === "returned") counts.returned++;
          else counts.unresolved++;
        }
  metrics.push(counts);
}
console.log(metrics);
assert.ok(
  metrics[1].conceded < metrics[0].conceded,
  "Prediction must improve this fixed shot suite"
);
assert.ok(
  metrics[1].conceded > 0,
  "Opponent must retain scoring opportunities"
);
// Slow-puck attack and recovering guard position are exercised independently.
const attack = initial();
const brain = opponentState();
attack.puck = { vx: 0, vy: 0, x: 730, y: H / 2 };
let struck = false;
for (let i = 0; i < 240 * 5; i++) {
  updateOpponent(attack, brain, 1 / 240);
  const event = step(attack, 1 / 240);
  if (attack.puck.vx < -100) struck = true;
  if (event) break;
}
assert.ok(struck, "Opponent must deliberately strike a reachable slow puck");
console.log(
  "Unchanged goal size, reflected prediction, speed/acceleration limits and intentional attack passed."
);
for (const seed of [1, 2, 3])
  for (const vy of [-60, 0, 60]) {
    const game = initial(),
      brain = opponentState(seed);
    game.puck = { vx: 85, vy, x: 700, y: H / 2 };
    let hit = false;
    for (let i = 0; i < 1200; i++) {
      updateOpponent(game, brain, 1 / 240);
      const event = step(game, 1 / 240);
      if (game.puck.vx < -150) hit = true;
      if (event) break;
    }
    assert.ok(
      hit && brain.strikes > 0,
      "Slow incoming pucks must provoke a deliberate attack"
    );
  }
const varying = initial(),
  personality = opponentState(17);
varying.puck.x = 300;
const styles = new Set<number>();
let opportunities = 0;
for (let i = 0; i < 240 * 45; i++) {
  updateOpponent(varying, personality, 1 / 240);
  styles.add(personality.style);
  if (personality.opening > 0) opportunities++;
}
assert.equal(styles.size, 3, "A long match must vary playing styles");
assert.ok(opportunities > 240, "Opponent must offer recovery windows");
console.log(
  "Nine attacking opportunities, style changes and recovery windows passed."
);
