'use strict';

const COLORS = {
  bgTop: '#201a30',
  bgBottom: '#0f1320',
  panel: 'rgba(255,255,255,0.07)',
  panelSoft: 'rgba(255,255,255,0.04)',
  panelBorder: 'rgba(232,197,71,0.28)',
  text: '#f4efe6',
  subtext: '#b9b2a6',
  accent: '#e8c547',
  accentSoft: 'rgba(232,197,71,0.16)',
  danger: '#ff7b7b',
  chip: 'rgba(255,255,255,0.08)',
  button: 'rgba(232,197,71,0.10)',
  buttonPressed: 'rgba(232,197,71,0.22)',
  buttonBorder: 'rgba(232,197,71,0.35)',
  footer: 'rgba(255,255,255,0.6)'
};

function wrapText(ctx, text, maxWidth) {
  if (!text) return [''];

  const lines = [];
  let current = '';

  for (const char of text) {
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

function drawRoundedRect(ctx, x, y, w, h, radius, fillStyle, strokeStyle) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawTextLines(ctx, lines, x, y, lineHeight, color) {
  ctx.fillStyle = color;
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
}

function drawStatChips(ctx, stats, layout) {
  const labels = [
    ['宠爱', stats.favor],
    ['智谋', stats.wisdom],
    ['容貌', stats.beauty],
    ['体魄', stats.health],
    ['风声', stats.suspicion]
  ];

  const chipWidth = (layout.width - layout.padding * 2 - 8) / 2;
  const chipHeight = 28;

  ctx.font = '12px sans-serif';

  labels.forEach((entry, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = layout.padding + col * (chipWidth + 8);
    const y = layout.statsTop + row * (chipHeight + 8);
    const width = index === labels.length - 1 ? chipWidth : chipWidth;

    drawRoundedRect(ctx, x, y, width, chipHeight, 14, COLORS.chip, null);
    ctx.fillStyle = COLORS.subtext;
    ctx.fillText(entry[0], x + 12, y + 18);
    ctx.fillStyle = entry[0] === '风声' ? COLORS.danger : COLORS.accent;
    ctx.fillText(String(entry[1]), x + width - 26, y + 18);
  });

  return layout.statsTop + Math.ceil(labels.length / 2) * (chipHeight + 8);
}

function drawChoiceButton(ctx, choice, x, y, width, isPressed) {
  const textPadding = 16;
  ctx.font = '16px sans-serif';
  const textLines = wrapText(ctx, choice.text, width - textPadding * 2);
  ctx.font = '12px sans-serif';
  const hintLines = choice.hint ? wrapText(ctx, choice.hint, width - textPadding * 2) : [];
  const height = 20 + textLines.length * 24 + hintLines.length * 18 + 14;

  drawRoundedRect(
    ctx,
    x,
    y,
    width,
    height,
    16,
    isPressed ? COLORS.buttonPressed : COLORS.button,
    COLORS.buttonBorder
  );

  ctx.font = '16px sans-serif';
  drawTextLines(ctx, textLines, x + textPadding, y + 24, 24, COLORS.text);

  if (hintLines.length > 0) {
    ctx.font = '12px sans-serif';
    drawTextLines(ctx, hintLines, x + textPadding, y + 24 + textLines.length * 24, 18, COLORS.subtext);
  }

  return {
    h: height,
    id: choice.id,
    x,
    y,
    w: width
  };
}

function renderStoryScreen(ctx, app, metrics) {
  const regions = [];
  const layout = {
    width: metrics.width,
    height: metrics.height,
    padding: 20,
    topInset: (metrics.safeTop || 0) + 18,
    statsTop: (metrics.safeTop || 0) + 68
  };

  ctx.fillStyle = COLORS.subtext;
  ctx.font = '12px sans-serif';
  ctx.fillText(app.bookTitle, layout.padding, layout.topInset);

  ctx.fillStyle = COLORS.accent;
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(app.scene.title, layout.padding, layout.topInset + 28);

  ctx.textAlign = 'right';
  ctx.fillStyle = COLORS.footer;
  ctx.font = '12px sans-serif';
  ctx.fillText(`第 ${app.state.step + 1} 步`, layout.width - layout.padding, layout.topInset);
  ctx.textAlign = 'left';

  const statsBottom = drawStatChips(ctx, app.state.stats, layout);

  let currentTop = statsBottom + 8;

  const storyWidth = layout.width - layout.padding * 2;
  ctx.font = '16px sans-serif';
  const storyLines = wrapText(ctx, app.storyText, storyWidth - 28);
  const storyHeight = Math.max(120, storyLines.length * 26 + 42);

  drawRoundedRect(ctx, layout.padding, currentTop, storyWidth, storyHeight, 18, COLORS.panel, COLORS.panelBorder);
  ctx.fillStyle = COLORS.subtext;
  ctx.font = '12px sans-serif';
  ctx.fillText(app.chapterLabel, layout.padding + 16, currentTop + 22);
  ctx.font = '16px sans-serif';
  drawTextLines(ctx, storyLines, layout.padding + 16, currentTop + 48, 24, COLORS.text);
  currentTop += storyHeight + 14;

  app.choices.forEach((choice) => {
    const region = drawChoiceButton(
      ctx,
      choice,
      layout.padding,
      currentTop,
      storyWidth,
      app.pressedRegionId === choice.id
    );
    regions.push(region);
    currentTop += region.h + 12;
  });

  ctx.fillStyle = COLORS.footer;
  ctx.font = '12px sans-serif';
  ctx.fillText('点击选项推动剧情', layout.padding, metrics.height - 18 - (metrics.safeBottomInset || 0));

  return regions;
}

function renderEndingScreen(ctx, app, metrics) {
  const padding = 20;
  const width = metrics.width - padding * 2;
  const regions = [];
  const topInset = (metrics.safeTop || 0) + 18;

  ctx.fillStyle = COLORS.subtext;
  ctx.font = '12px sans-serif';
  ctx.fillText(app.bookTitle, padding, topInset);

  ctx.fillStyle = COLORS.accent;
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(app.ending.title, padding, topInset + 36);

  ctx.fillStyle = COLORS.footer;
  ctx.font = '12px sans-serif';
  ctx.fillText('结局评价', padding, topInset + 60);

  ctx.font = 'bold 64px sans-serif';
  ctx.fillStyle = COLORS.accent;
  ctx.fillText(app.score.grade, padding, topInset + 120);

  drawRoundedRect(ctx, padding, topInset + 146, width, 154, 18, COLORS.panel, COLORS.panelBorder);
  ctx.font = '15px sans-serif';
  const summaryLines = wrapText(ctx, app.ending.summary, width - 28);
  drawTextLines(ctx, summaryLines, padding + 14, topInset + 172, 22, COLORS.text);

  ctx.font = '12px sans-serif';
  ctx.fillStyle = COLORS.subtext;
  ctx.fillText(`综合得分 ${app.score.percentage}`, padding + 14, topInset + 266);
  ctx.fillText(`宠爱 ${app.state.stats.favor}`, padding + 130, topInset + 266);
  ctx.fillText(`智谋 ${app.state.stats.wisdom}`, padding + 210, topInset + 266);

  const buttonY = topInset + 322;
  const buttonH = 54;
  drawRoundedRect(
    ctx,
    padding,
    buttonY,
    width,
    buttonH,
    18,
    app.pressedRegionId === 'restart' ? COLORS.buttonPressed : COLORS.accent,
    null
  );
  ctx.fillStyle = '#1d1b24';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('再穿一次', padding + width / 2, buttonY + 33);
  ctx.textAlign = 'left';

  ctx.fillStyle = COLORS.footer;
  ctx.font = '12px sans-serif';
  ctx.fillText('点击按钮重新开始', padding, buttonY + buttonH + 28);

  regions.push({
    id: 'restart',
    x: padding,
    y: buttonY,
    w: width,
    h: buttonH
  });

  return regions;
}

function createRenderer(ctx, metrics) {
  return {
    render(app) {
      if (typeof ctx.createLinearGradient === 'function') {
        const gradient = ctx.createLinearGradient(0, 0, 0, metrics.height);
        gradient.addColorStop(0, COLORS.bgTop);
        gradient.addColorStop(1, COLORS.bgBottom);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = COLORS.bgTop;
      }
      ctx.fillRect(0, 0, metrics.width, metrics.height);

      return app.isFinished
        ? renderEndingScreen(ctx, app, metrics)
        : renderStoryScreen(ctx, app, metrics);
    }
  };
}

module.exports = {
  createRenderer
};
