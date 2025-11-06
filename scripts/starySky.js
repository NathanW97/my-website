const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
resizeCanvas();

const stars = Array.from({ length: 200 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5,
  alpha: Math.random(),
  delta: Math.random() * 0.02
}));

function drawStars() {
for (const star of stars) {
    star.alpha += star.delta;
    if (star.alpha <= 0 || star.alpha >= 1) star.delta = -star.delta;

    // isolate the star alpha so it doesn't affect subsequent drawing
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, star.alpha));
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Shooting star trail
const trail = [];
const maxTrailLength = 20;

let mouse = { x: -100, y: -100 }; // start offscreen

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    trail.push({ x: mouse.x, y: mouse.y });
    if (trail.length > maxTrailLength) trail.shift();
});

function drawTrail() {
  if (trail.length < 2) return;

  ctx.globalCompositeOperation = "lighter"; // for glow blending
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Start the path
  ctx.beginPath();
  ctx.moveTo(trail[0].x, trail[0].y);

  // Use quadratic curves between points for smoothness
  for (let i = 1; i < trail.length - 2; i++) {
    const xc = (trail[i].x + trail[i + 1].x) / 2;
    const yc = (trail[i].y + trail[i + 1].y) / 2;
    ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
  }

  // Last segment
  const secondLast = trail[trail.length - 2];
  const last = trail[trail.length - 1];
  ctx.quadraticCurveTo(secondLast.x, secondLast.y, last.x, last.y);

  // Gradient for the trail (from tail to head)
  const tail = trail[0];
  const head = trail[trail.length - 1];
  const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
  gradient.addColorStop(0, "rgba(173,216,230,0)"); // faint tail
  gradient.addColorStop(1, "rgba(255,255,255,0.9)"); // bright head

  ctx.strokeStyle = gradient;
  ctx.stroke();

  // Reset blending
  ctx.globalCompositeOperation = "source-over";

  // Draw the glowing "head" of the shooting star
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.shadowColor = "white";
  ctx.shadowBlur = 20;
  ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}


function draw() {
    ctx.alpha = 1;
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // fade out old frames for smooth trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawStars();
    drawTrail();
    requestAnimationFrame(draw);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

window.addEventListener('resize', resizeCanvas);

draw();