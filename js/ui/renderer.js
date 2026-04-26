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

function drawStatChips(ctx, pet, layout) {
  const attr = pet?.attributes || {};
  const labels = [
    ['力量', attr.strength || 0],
    ['防御', attr.defense || 0],
    ['速度', attr.speed || 0],
    ['灵力', attr.spirit || 0],
    ['生命', attr.health || 0]
  ];

  const chipWidth = (layout.width - layout.padding * 2 - 8) / 2;
  const chipHeight = 28;

  ctx.font = '12px sans-serif';

  labels.forEach((entry, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = layout.padding + col * (chipWidth + 8);
    const y = layout.statsTop + row * (chipHeight + 8);

    drawRoundedRect(ctx, x, y, chipWidth, chipHeight, 14, COLORS.chip, null);
    ctx.fillStyle = COLORS.subtext;
    ctx.fillText(entry[0], x + 12, y + 18);
    ctx.fillStyle = COLORS.accent;
    ctx.fillText(String(entry[1]), x + chipWidth - 32, y + 18);
  });

  return layout.statsTop + Math.ceil(labels.length / 2) * (chipHeight + 8);
}

function drawChoiceButton(ctx, choice, x, y, width, isPressed) {
  const textPadding = 16;
  const isSystem = choice.type === 'system';
  const prefix = isSystem ? `${choice.systemLabel || ''} ` : '';
  const displayText = prefix + choice.text;

  ctx.font = '16px sans-serif';
  const textLines = wrapText(ctx, displayText, width - textPadding * 2);
  ctx.font = '12px sans-serif';
  const hintLines = choice.hint ? wrapText(ctx, choice.hint, width - textPadding * 2) : [];
  const height = 20 + textLines.length * 24 + hintLines.length * 18 + 14;

  const btnFill = isPressed
    ? (isSystem ? 'rgba(232,197,71,0.35)' : COLORS.buttonPressed)
    : (isSystem ? 'rgba(232,197,71,0.14)' : COLORS.button);
  const btnBorder = isSystem ? 'rgba(232,197,71,0.7)' : COLORS.buttonBorder;

  drawRoundedRect(ctx, x, y, width, height, 16, btnFill, btnBorder);

  ctx.font = '16px sans-serif';
  const textColor = isSystem ? '#f5e6a3' : COLORS.text;
  drawTextLines(ctx, textLines, x + textPadding, y + 24, 24, textColor);

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

function renderStatusPanel(ctx, app, layout) {
  const panelW = layout.width - layout.padding * 2;
  const panelH = layout.height - layout.padding * 2 - (layout.topInset || 0);
  const panelX = layout.padding;
  const panelY = layout.topInset || layout.padding;

  ctx.save();
  drawRoundedRect(ctx, panelX, panelY, panelW, panelH, 20, 'rgba(16,14,28,0.96)', COLORS.panelBorder);

  ctx.fillStyle = COLORS.accent;
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('状态面板', panelX + 20, panelY + 36);

  ctx.fillStyle = COLORS.subtext;
  ctx.font = '12px sans-serif';
  ctx.fillText('点击空白处关闭', panelX + panelW - 110, panelY + 36);

  let y = panelY + 60;
  const pet = app.state.pet;

  if (pet) {
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${pet.name}  Lv.${pet.level || 1}`, panelX + 20, y);
    y += 26;

    ctx.font = '13px sans-serif';
    ctx.fillStyle = COLORS.subtext;
    const stageLabels = ['初始形态', '一阶进化', '二阶进化'];
    ctx.fillText(`进化: ${stageLabels[pet.evolutionStage || 0] || '未知'}`, panelX + 20, y);
    y += 22;
    ctx.fillText(`体型: ${pet.size || 'small'}`, panelX + 20, y);
    y += 32;

    ctx.fillStyle = COLORS.accent;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('属性', panelX + 20, y);
    y += 22;

    ctx.font = '13px sans-serif';
    ctx.fillStyle = COLORS.subtext;
    const attrs = pet.attributes || {};
    const attrList = [
      ['力量', attrs.strength || 0],
      ['防御', attrs.defense || 0],
      ['速度', attrs.speed || 0],
      ['灵力', attrs.spirit || 0],
      ['生命', attrs.health || 0]
    ];
    attrList.forEach(([label, val]) => {
      ctx.fillStyle = COLORS.subtext;
      ctx.fillText(`${label}:`, panelX + 20, y);
      ctx.fillStyle = COLORS.accent;
      ctx.fillText(String(val), panelX + 80, y);
      y += 20;
    });

    y += 10;
    if (pet.talents && pet.talents.length > 0) {
      ctx.fillStyle = COLORS.accent;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('天赋', panelX + 20, y);
      y += 22;
      ctx.font = '12px sans-serif';
      ctx.fillStyle = COLORS.subtext;
      pet.talents.forEach((t) => {
        ctx.fillText(`· ${t}`, panelX + 24, y);
        y += 18;
      });
    }

    if (pet.skills && pet.skills.length > 0) {
      y += 6;
      ctx.fillStyle = COLORS.accent;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('技能', panelX + 20, y);
      y += 22;
      ctx.font = '12px sans-serif';
      ctx.fillStyle = COLORS.subtext;
      pet.skills.forEach((s) => {
        ctx.fillText(`· ${s}`, panelX + 24, y);
        y += 18;
      });
    }
  }

  ctx.restore();

  return {
    id: 'status_panel_bg',
    x: panelX,
    y: panelY,
    w: panelW,
    h: panelH
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

  const statsBottom = drawStatChips(ctx, app.state.pet, layout);

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

  const statusBtnW = 60;
  const statusBtnH = 28;
  const statusBtnX = layout.width - layout.padding - statusBtnW;
  const statusBtnY = layout.topInset + 32;
  drawRoundedRect(ctx, statusBtnX, statusBtnY, statusBtnW, statusBtnH, 14, COLORS.chip, COLORS.accentSoft);
  ctx.fillStyle = COLORS.accent;
  ctx.font = '12px sans-serif';
  ctx.fillText('状态', statusBtnX + 16, statusBtnY + 19);
  regions.push({ id: 'toggle_status', x: statusBtnX, y: statusBtnY, w: statusBtnW, h: statusBtnH });

  if (app.showStatusPanel) {
    const panelRegion = renderStatusPanel(ctx, app, layout);
    regions.push(panelRegion);
  }

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
