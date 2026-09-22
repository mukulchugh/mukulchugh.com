export const W = 1000;
export const H = 500;
// Same 121-unit scoring aperture as the original board, only re-centered.
export const GOAL_TOP = H / 2 - 60.5;
export const GOAL_BOTTOM = H / 2 + 60.5;
export type Body = { x: number; y: number; vx: number; vy: number };
export const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));
export function initial() {
  return {
    opponent: { vx: 0, vy: 0, x: 820, y: H / 2 },
    player: { vx: 0, vy: 0, x: 240, y: H / 2 },
    puck: { vx: -210, vy: 65, x: 500, y: H / 2 },
    stuckAnchor: { x: 500, y: H / 2 },
    stuckTime: 0,
  };
}
export function move(
  body: Body,
  x: number,
  y: number,
  speed: number,
  dt: number
) {
  const dx = x - body.x,
    dy = y - body.y;
  const ratio = Math.min(1, (speed * dt) / (Math.hypot(dx, dy) || 1));
  body.vx = (dx * ratio) / dt;
  body.vy = (dy * ratio) / dt;
  body.x += body.vx * dt;
  body.y += body.vy * dt;
}
export function step(
  game: ReturnType<typeof initial>,
  dt: number,
  elapsed = dt
): "player" | "opponent" | "dead-ball" | null {
  const p = game.puck;
  p.x += p.vx * dt;
  p.y += p.vy * dt;
  p.vx *= Math.exp(-0.08 * dt);
  p.vy *= Math.exp(-0.08 * dt);
  for (const mallet of [game.player, game.opponent]) {
    const dx = p.x - mallet.x,
      dy = p.y - mallet.y,
      distance = Math.hypot(dx, dy);
    if (distance < 51) {
      const nx = distance ? dx / distance : 1,
        ny = distance ? dy / distance : 0;
      p.x = mallet.x + nx * 51;
      p.y = mallet.y + ny * 51;
      const approach = (p.vx - mallet.vx) * nx + (p.vy - mallet.vy) * ny;
      if (approach < 0) {
        p.vx -= 1.88 * approach * nx;
        p.vy -= 1.88 * approach * ny;
      }
    }
  }
  if (p.y < 46) {
    p.y = 46;
    p.vy = Math.abs(p.vy) * 0.96;
  }
  if (p.y > H - 46) {
    p.y = H - 46;
    p.vy = -Math.abs(p.vy) * 0.96;
  }
  const goal = p.y > GOAL_TOP && p.y < GOAL_BOTTOM;
  if (goal && p.x < 36) return "opponent";
  if (goal && p.x > 964) return "player";
  if (!goal && p.x < 55) {
    p.x = 55;
    p.vx = Math.abs(p.vx) * 0.96;
  }
  if (!goal && p.x > 945) {
    p.x = 945;
    p.vx = -Math.abs(p.vx) * 0.96;
  }
  const speed = Math.hypot(p.vx, p.vy);
  if (speed > 900) {
    p.vx *= 900 / speed;
    p.vy *= 900 / speed;
  }
  // Position, not velocity: rail collisions can jitter while making no progress.
  if (Math.hypot(p.x - game.stuckAnchor.x, p.y - game.stuckAnchor.y) > 8) {
    game.stuckAnchor = { x: p.x, y: p.y };
    game.stuckTime = 0;
  } else game.stuckTime += elapsed;
  if (game.stuckTime >= 3) return "dead-ball";
  return null;
}
