'use strict';

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let current = '';

  for (const char of String(text || '')) {
    const next = current + char;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = char;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function renderErrorScreen(ctx, metrics, title, detail) {
  ctx.save();
  ctx.fillStyle = '#10131d';
  ctx.fillRect(0, 0, metrics.width, metrics.height);

  ctx.fillStyle = '#ff8f8f';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText(title || '运行异常', 20, 50);

  ctx.fillStyle = '#f3efe8';
  ctx.font = '14px sans-serif';
  const lines = wrapText(ctx, detail || '未知错误', metrics.width - 40);
  lines.slice(0, 20).forEach((line, index) => {
    ctx.fillText(line, 20, 90 + index * 22);
  });

  ctx.fillStyle = '#b8b3aa';
  ctx.font = '12px sans-serif';
  ctx.fillText('请把这段报错截图或复制给我。', 20, metrics.height - 24);
  ctx.restore();
}

module.exports = {
  renderErrorScreen
};
