import { useEffect, useRef } from 'react';
import { drawRobot } from './Robot';
import { drawBall } from './Ball';

export default function Field() {
  const canvasRef = useRef(null);
  const scale = 5;

  const robotsRef = useRef([
    { x: 30, y: 30, theta: 0, vl: 0, vr: 0, team: 'blue', idColors: ['red', 'green'] },
    { x: 100, y: 80, theta: 0, vl: 0, vr: 0, team: 'yellow', idColors: ['purple', 'cyan'] },
  ]);
  const ballRef = useRef({ x: 75, y: 65, vx: 0, vy: 0 });
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    function update(dt) {
      const L = 5.5; // distância entre rodas (cm)
      robotsRef.current.forEach((r) => {
        const v = (r.vl + r.vr) / 2;
        const w = (r.vr - r.vl) / L;
        r.theta += w * dt;
        r.x += v * Math.cos(r.theta) * dt;
        r.y += v * Math.sin(r.theta) * dt;
      });

      const ball = ballRef.current;
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      const friction = 0.98;
      ball.vx *= friction;
      ball.vy *= friction;

      if (ball.x < 2) { ball.x = 2; ball.vx *= -0.5; }
      if (ball.x > 148) { ball.x = 148; ball.vx *= -0.5; }
      if (ball.y < 2) { ball.y = 2; ball.vy *= -0.5; }
      if (ball.y > 128) { ball.y = 128; ball.vy *= -0.5; }
    }

    function loop() {
      const now = performance.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      update(dt);
      drawDynamics(ctx);
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }, []);

  const drawDynamics = (ctx) => {
    drawStaticField(ctx);

    robotsRef.current.forEach((robot) => {
      drawRobot(ctx, robot.x * scale, robot.y * scale, robot.theta, robot.team, robot.idColors, scale);
    });

    drawBall(ctx, ballRef.current.x * scale, ballRef.current.y * scale, scale);
  };

  const drawStaticField = (ctx) => {
    const fieldWidth = 150 * scale;
    const fieldHeight = 130 * scale;

    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(0, 0, fieldWidth, fieldHeight);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;

    ctx.strokeRect(0, 0, fieldWidth, fieldHeight);
    ctx.beginPath();
    ctx.moveTo(fieldWidth / 2, 0);
    ctx.lineTo(fieldWidth / 2, fieldHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(fieldWidth / 2, fieldHeight / 2, 20 * scale, 0, 2 * Math.PI);
    ctx.stroke();

    drawCornerTriangles(ctx, fieldWidth, fieldHeight);
    drawPenaltyArcs(ctx, fieldWidth, fieldHeight);

    const plusPositions = [
      { x: 25, y: 25 }, { x: 25, y: 65 }, { x: 25, y: 105 },
      { x: 125, y: 25 }, { x: 125, y: 65 }, { x: 125, y: 105 },
    ];

    plusPositions.forEach(pos => {
      drawPlus(ctx, pos.x * scale, pos.y * scale);
    });

    ctx.strokeRect(0, (fieldHeight - 40 * scale) / 2, 10 * scale, 40 * scale);
    ctx.strokeRect(fieldWidth - 10 * scale, (fieldHeight - 40 * scale) / 2, 10 * scale, 40 * scale);
  };

  return <canvas ref={canvasRef} width={750} height={650} />;
}

function drawPlus(ctx, x, y) {
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + 5, y);
  ctx.moveTo(x, y - 5);
  ctx.lineTo(x, y + 5);
  ctx.stroke();
}

function drawCornerTriangles(ctx, fieldWidth, fieldHeight) {
  const scale = 5;
  ctx.fillStyle = '#ffffff';
  const cornerSize = 7 * scale;

  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(cornerSize, 0); ctx.lineTo(0, cornerSize); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(fieldWidth, 0); ctx.lineTo(fieldWidth - cornerSize, 0); ctx.lineTo(fieldWidth, cornerSize); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, fieldHeight); ctx.lineTo(cornerSize, fieldHeight); ctx.lineTo(0, fieldHeight - cornerSize); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(fieldWidth, fieldHeight); ctx.lineTo(fieldWidth - cornerSize, fieldHeight); ctx.lineTo(fieldWidth, fieldHeight - cornerSize); ctx.closePath(); ctx.fill();
}

function drawPenaltyArcs(ctx, fieldWidth, fieldHeight) {
  const scale = 5;
  const arcRadius = 10 * scale;
  const goalAreaOffset = 3 * scale;
  const centerY = fieldHeight / 2;

  ctx.beginPath();
  ctx.arc(goalAreaOffset, centerY, arcRadius, -Math.PI / 4, Math.PI / 4);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(fieldWidth - goalAreaOffset, centerY, arcRadius, Math.PI + Math.PI / 4, Math.PI - Math.PI / 4, true);
  ctx.stroke();
}
