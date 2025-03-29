export function drawBall(ctx, x, y, scale = 5) {
    const radius = 2 * scale; // 4cm de diâmetro = 2cm de raio
  
    // Sombra externa
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFA500'; // laranja
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 4;
    ctx.fill();
  
    // Borda
    ctx.shadowBlur = 0; // remove sombra
    ctx.strokeStyle = '#aa5500'; // borda mais escura
    ctx.lineWidth = 1;
    ctx.stroke();
  
    // Efeito visual tipo "golf"
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * 2 * Math.PI;
      const dotX = x + Math.cos(angle) * (radius * 0.6);
      const dotY = y + Math.sin(angle) * (radius * 0.6);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 0.5 * scale, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  