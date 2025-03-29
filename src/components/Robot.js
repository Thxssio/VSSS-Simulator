export function drawRobot(ctx, x, y, theta, team, idColors, scale = 5) {
    const size = 7.5 * scale;
    const half = size / 2;
  
    const teamColors = {
      blue: '#007bff',
      yellow: '#ffd700',
    };
  
    if (!teamColors[team]) {
      throw new Error('Invalid team color. Use \"blue\" or \"yellow\".');
    }
  
    if (
      !Array.isArray(idColors) ||
      idColors.length !== 2 ||
      idColors.includes(teamColors[team])
    ) {
      throw new Error('idColors must be an array of 2 colors different from the team color.');
    }
  
    ctx.save();
    ctx.translate(x + half, y + half);
    ctx.rotate(theta);
    ctx.translate(-half, -half);
  
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(0, 0, size, size);
  
    ctx.fillStyle = teamColors[team];
    ctx.fillRect(0, 0, half, size);
  
    ctx.fillStyle = idColors[0];
    ctx.fillRect(half, 0, half, half);
  
    ctx.fillStyle = idColors[1];
    ctx.fillRect(half, half, half, half);
  
    ctx.restore();
  }
  