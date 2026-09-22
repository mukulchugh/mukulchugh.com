import { clamp, H, type initial, W } from "./physics";

// Reuse the opponent from the other end for the automated preview.
export function updateDemoPlayer(
  game: ReturnType<typeof initial>,
  brain: ReturnType<typeof opponentState>,
  dt: number
) {
  const mirror = (body: typeof game.player) => ({
    ...body,
    vx: -body.vx,
    x: W - body.x,
  });
  const mirrored = {
    ...game,
    opponent: mirror(game.player),
    player: mirror(game.opponent),
    puck: mirror(game.puck),
  };
  updateOpponent(mirrored, brain, dt);
  Object.assign(game.player, mirror(mirrored.opponent));
}

export function opponentState(seed = 12_345) {
  return {
    bank: false,
    committing: 0,
    error: 0,
    mode: "recover",
    opening: 0,
    openingIn: 5,
    reaction: 0.2,
    seed,
    strikes: 0,
    style: seed % 3,
    styleTime: 2,
    x: 820,
    y: H / 2,
  };
}
function random(brain: ReturnType<typeof opponentState>) {
  brain.seed = (Math.imul(brain.seed, 1_664_525) + 1_013_904_223) >>> 0;
  return brain.seed / 4_294_967_296;
}
// Fold a projected trajectory over the top/bottom rails, including multiple banks.
export function reflectedY(y: number) {
  const span = H - 92;
  const phase = (((y - 46) % (2 * span)) + 2 * span) % (2 * span);
  return 46 + (phase <= span ? phase : 2 * span - phase);
}
export function updateOpponent(
  game: ReturnType<typeof initial>,
  brain: ReturnType<typeof opponentState>,
  dt: number
) {
  const p = game.puck,
    ai = game.opponent;
  brain.styleTime -= dt;
  brain.openingIn -= dt;
  brain.opening = Math.max(0, brain.opening - dt);
  if (brain.styleTime <= 0) {
    brain.style = Math.floor(random(brain) * 3);
    brain.styleTime = 5 + random(brain) * 4;
    brain.bank = random(brain) < 0.35;
  }
  if (brain.openingIn <= 0) {
    brain.opening = 0.6 + random(brain) * 0.5;
    brain.openingIn = 7 + random(brain) * 6;
  }
  brain.reaction -= dt;
  brain.committing = Math.max(0, brain.committing - dt);
  if (brain.reaction <= 0 && brain.committing === 0) {
    brain.reaction =
      0.18 + random(brain) * 0.12 + (brain.style === 2 ? 0.04 : 0);
    // Seeded choices make play varied while keeping simulations reproducible.
    brain.error = (random(brain) - 0.5) * (brain.style === 1 ? 72 : 48);
    const incoming = p.vx > 55;
    const attackable =
      p.x > 500 &&
      p.x < 890 &&
      Math.hypot(p.vx, p.vy) < (brain.style === 1 ? 550 : 460);
    if (brain.opening > 0) {
      brain.mode = "recover";
      brain.x = 800;
      brain.y = H / 2;
    } else if (incoming && !attackable) {
      brain.mode = "defend";
      brain.x = brain.style === 1 ? 745 : brain.style === 2 ? 880 : 840;
      const travel = clamp((brain.x - p.x) / p.vx, 0, 1.4);
      brain.y = reflectedY(p.y + p.vy * travel) + brain.error;
    } else if (attackable) {
      brain.mode = "attack";
      // Aim at the open side of the player's goal, with occasional bank attempts.
      const goalY = H / 2 + (game.player.y < H / 2 ? 38 : -38);
      const aimY = brain.bank
        ? goalY < H / 2
          ? 92 - goalY
          : 2 * (H - 46) - goalY
        : goalY;
      const lead = Math.min(0.18, Math.hypot(ai.x - p.x, ai.y - p.y) / 900);
      const contactX = clamp(p.x + p.vx * lead, 500, 890);
      const contactY = reflectedY(p.y + p.vy * lead);
      const dx = 36 - contactX,
        dy = aimY - contactY;
      const length = Math.hypot(dx, dy);
      const nx = dx / length,
        ny = dy / length;
      brain.x = clamp(contactX - nx * 64, 540, 910);
      brain.y = clamp(contactY - ny * 64, 70, H - 70);
      // Allow a running strike; requiring a settled wind-up makes the AI trail
      // a moving puck indefinitely between reaction ticks.
      if (Math.hypot(ai.x - brain.x, ai.y - brain.y) < 45) {
        brain.x = contactX + nx * 90;
        brain.y = contactY + ny * 90;
        brain.committing = 0.18;
        brain.strikes++;
        brain.bank = random(brain) < 0.35;
      }
    } else {
      brain.mode = "recover";
      brain.x = 820;
      brain.y = H / 2 + clamp((p.y - H / 2) * 0.3, -45, 45);
    }
    brain.x = clamp(brain.x, 540, 910);
    brain.y = clamp(brain.y, 70, H - 70);
  }
  const dx = brain.x - ai.x,
    dy = brain.y - ai.y;
  const distance = Math.hypot(dx, dy);
  const pace =
    brain.opening > 0
      ? 245
      : brain.style === 1
        ? 490
        : brain.style === 2
          ? 365
          : 430;
  const speed = Math.min(brain.committing > 0 ? 610 : pace, distance * 8);
  const vx = distance ? (dx / distance) * speed : 0;
  const vy = distance ? (dy / distance) * speed : 0;
  const change = Math.hypot(vx - ai.vx, vy - ai.vy);
  const fraction = Math.min(1, (2600 * dt) / (change || 1));
  ai.vx += (vx - ai.vx) * fraction;
  ai.vy += (vy - ai.vy) * fraction;
  ai.x = clamp(ai.x + ai.vx * dt, 540, 910);
  ai.y = clamp(ai.y + ai.vy * dt, 70, H - 70);
}
