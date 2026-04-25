# 穿书模拟器

## 当前状态

本项目已经不是单纯的“启动说明”阶段，而是进入了“可玩首册 + 持续迭代”阶段。

当前已有：

- 一个可在微信开发者工具中运行的宫斗本首册垂直切片
- 基于剧情图的数据结构、运行时和校验脚本
- 首轮剧情写作模板、回响设计和分支校验机制

当前仍在重点打磨：

- 剧本细节和剧情连贯度
- 交互细节与反馈节奏
- 分支体感和路线差异
- 评分区分度
- 正反馈、爽点、分享欲、分享图形式
- 过程中的人物或事件形象图

## 协作要求

以后所有关于项目的沟通、项目改动、方向调整，不应只停留在对话里。

任何 AI 或协作者在做出有意义的项目变更时，都应同步更新相关项目文档，让另一个工具或另一个 AI 在只读取基础目录的情况下，也能快速知道项目现状。

最低要求：

- 先读 [AGENTS.md](/Users/xwx/MyProjects/ghost-book-game/AGENTS.md)
- 再读 [docs/README.md](/Users/xwx/MyProjects/ghost-book-game/docs/README.md)
- 有重要变化时，同步更新：
  - [README.md](/Users/xwx/MyProjects/ghost-book-game/README.md)
  - [项目路线图](/Users/xwx/MyProjects/ghost-book-game/docs/plans/2026-04-22-project-roadmap.md)
  - [迭代日志](/Users/xwx/MyProjects/ghost-book-game/docs/skills/iteration-log.md)

## 建议阅读顺序

1. [AGENTS.md](/Users/xwx/MyProjects/ghost-book-game/AGENTS.md)
2. [docs/README.md](/Users/xwx/MyProjects/ghost-book-game/docs/README.md)
3. [项目路线图](/Users/xwx/MyProjects/ghost-book-game/docs/plans/2026-04-22-project-roadmap.md)
4. [迭代日志](/Users/xwx/MyProjects/ghost-book-game/docs/skills/iteration-log.md)
5. 根据任务继续读对应 spec / skill 文档

## 产品方向重点

后续迭代时，需要把下面这些点视为核心产品方向，而不是纯粹的后期润色：

- 正反馈设计
- 爽点设计
- 分享欲设计
- 分享图形式
- 过程中的人物或事件形象图

对应文档：

- [产品体验重点](/Users/xwx/MyProjects/ghost-book-game/docs/specs/2026-04-24-product-experience-focus.md)
- [剧情写作模板 v1](/Users/xwx/MyProjects/ghost-book-game/docs/specs/2026-04-22-story-writing-template-v1.md)
- [剧情写作检查表](/Users/xwx/MyProjects/ghost-book-game/docs/specs/2026-04-22-story-writing-checklist.md)

---

## 一、项目背景与转变

原项目「踏天」是一款竖版动作小游戏（Canvas 2D 微信小游戏），包含蓄力拔刀斩、瞬移、飞行、肉鸽技能系统、Boss 战等机制。开发过程中发现系统过于复杂，偏离“休闲简约”的初衷。

经过评估，决定将项目方向调整为文字交互式“穿书模拟器”，利用预制剧情 + 动态分支 + 评分的模式，提供轻量、可重复游玩的休闲体验。

## 二、游戏核心概念

### 2.1 玩法

- 玩家“穿书”进入不同类型的小说世界，如宫斗、修仙、诡异、魂兽等
- 每个世界由多个关键决策点构成，玩家通过点击选择推动剧情
- 每个选择会影响角色属性、关系、历史标记和后续可见选项
- 决策失败可能导致角色死亡或失势
- 生存到结局后，根据多维度表现给出综合评价
- 结果页未来应支持截图分享或生成分享图

### 2.2 内容设计原则

- 不引用具体小说版权，不写小说名称、角色名、名场面
- 类型化设计，只借鉴通用设定和公有领域概念
- 主要剧情和可达结果必须是开发阶段预制好的
- 运行时只做条件判断、状态变化、权重随机和节点跳转

### 2.3 核心循环

```text
开始 → 选择类型 → 阅读剧情 → 做选择 → 属性/关系/历史变化 → 下一场景
                                                     ↓
                                              死亡/失败 → 评分 → 分享
                                                     ↓
                                               结局成功 → 评分 → 分享
```

## 三、技术方案

### 3.1 平台

- 微信小游戏
- Canvas 2D 渲染
- 原生 JavaScript + CommonJS

### 3.2 当前项目结构

```text
ghost-book-game/
  AGENTS.md
  README.md
  game.js
  game.json
  project.config.json
  js/
    data/
    runtime/
    ui/
    input.js
    loop.js
  docs/
    specs/
    plans/
    skills/
  scripts/
    verify-book.js
  prototype/
    ghost-book-prototype.html
```

### 3.3 当前关键技术点

- 剧情图驱动的场景系统
- 条件文本、条件选项、权重随机
- 微信小游戏 Canvas 文字与按钮渲染
- 结构校验和随机模拟

## 四、当前重点文档

- [文档索引](/Users/xwx/MyProjects/ghost-book-game/docs/README.md)
- [项目路线图](/Users/xwx/MyProjects/ghost-book-game/docs/plans/2026-04-22-project-roadmap.md)
- [迭代日志](/Users/xwx/MyProjects/ghost-book-game/docs/skills/iteration-log.md)
- [Story System v1](/Users/xwx/MyProjects/ghost-book-game/docs/specs/2026-04-22-story-system-v1.md)
- [宫斗本第一册蓝图](/Users/xwx/MyProjects/ghost-book-game/docs/specs/2026-04-22-palace-book-01-blueprint.md)
- [当前试玩说明](/Users/xwx/MyProjects/ghost-book-game/docs/PLAYTEST.md)

## 五、待处理问题

### 5.1 内容设计

- [ ] 继续打磨宫斗本首册的节点细节、人物张力和结局余味
- [ ] 增加更可感知的分支差异和路线回响
- [ ] 设计第二个题材的模板

### 5.2 交互与视觉

- [ ] 打磨整体视觉风格
- [ ] 细化 UI 布局和交互反馈
- [ ] 确定过程中的人物或事件形象图策略
- [ ] 确定分享图的视觉形式与信息结构

### 5.3 产品体验

- [ ] 正反馈如何在剧情与交互里持续体现
- [ ] 爽点如何在不同路线中分布
- [ ] 分享欲如何通过结局文案、标签和稀有度体现
- [ ] 分享图如何承载路线身份、分数和金句

### 5.4 技术实现

- [ ] 持续优化小游戏运行体验
- [ ] 持续增强剧情校验和模拟工具
- [ ] 实现分享结果页与分享图导出

### 5.5 合规与运营

- [ ] 确认“穿书模拟器”在微信小游戏平台的类目和审核要求
- [ ] 名称、简介、图标设计
- [ ] 用户隐私协议

## 六、版权注意事项

- 禁止使用具体小说书名、角色名、名场面
- 禁止使用与特定作品高度雷同的情节
- 可以使用类型概念，如宫斗、修仙、诡异、魂兽
- 可以使用通用设定，如修炼等级、宫廷晋升、宗门体系等公有领域概念
- 所有剧情、角色、场景必须原创

## 七、参考与灵感

- 互动小说 / 视觉小说类游戏
- 人生重开模拟器类网页游戏
- 橙光游戏、易次元等平台作品

## 八、备注

- 原项目「踏天」代码保留在 `/Users/xwx/MyProjects/mini_game_cool/`
- AppID 复用自原项目，上传新版本将覆盖线上旧版本
- 本文件现在是项目核心说明文档，不再视为临时启动说明
