export type Ball = { x: number; y: number; vx: number; vy: number };
export type Box = { left: number; top: number; right: number; bottom: number };
export const radius = 12;

// Small fixed substeps plus capped launch speed prevent tunneling in this prototype.
export function stepBall(
  ball: Ball,
  width: number,
  height: number,
  word: Box,
  dt: number
) {
  ball.vx *= Math.exp(-1.1 * dt);
  ball.vy *= Math.exp(-1.1 * dt);
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  const min = radius + 8;
  if (ball.x < min) {
    ball.x = min;
    ball.vx = Math.abs(ball.vx) * 0.72;
  }
  if (ball.x > width - min) {
    ball.x = width - min;
    ball.vx = -Math.abs(ball.vx) * 0.72;
  }
  if (ball.y < min) {
    ball.y = min;
    ball.vy = Math.abs(ball.vy) * 0.72;
  }
  if (ball.y > height - min) {
    ball.y = height - min;
    ball.vy = -Math.abs(ball.vy) * 0.72;
  }
  const nearestX = Math.max(word.left, Math.min(word.right, ball.x));
  const nearestY = Math.max(word.top, Math.min(word.bottom, ball.y));
  const dx = ball.x - nearestX;
  const dy = ball.y - nearestY;
  const distance = Math.hypot(dx, dy);
  if (distance >= radius) return null;
  let nx = dx / (distance || 1);
  let ny = dy / (distance || 1);
  if (distance === 0) {
    const edges = [
      ball.x - word.left,
      word.right - ball.x,
      ball.y - word.top,
      word.bottom - ball.y,
    ];
    const edge = edges.indexOf(Math.min(...edges));
    nx = edge === 0 ? -1 : edge === 1 ? 1 : 0;
    ny = edge === 2 ? -1 : edge === 3 ? 1 : 0;
    if (nx) ball.x = nx < 0 ? word.left - radius : word.right + radius;
    if (ny) ball.y = ny < 0 ? word.top - radius : word.bottom + radius;
  } else {
    ball.x += nx * (radius - distance + 0.1);
    ball.y += ny * (radius - distance + 0.1);
  }
  const incoming = ball.vx * nx + ball.vy * ny;
  if (incoming >= 0) return null;
  ball.vx -= 1.8 * incoming * nx;
  ball.vy -= 1.8 * incoming * ny;
  return { force: -incoming, nx, ny };
}
