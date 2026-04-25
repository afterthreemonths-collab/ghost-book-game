# Story Iteration Log

## 2026-04-24

### 背景

项目进入“多工具、多 AI 可能协作”的阶段，需要把项目状态与协作规则正式固化到根目录与项目说明文档中。

### 本轮收获

- 明确根目录文档需要升级为长期有效的项目说明，而不是临时启动说明
- 新增 `AGENTS.md`，作为任何 AI 进入仓库后的首读协作指南
- 明确任何重要项目沟通或项目改动，都应同步项目文档
- 正式把“正反馈、爽点、分享欲、分享图、过程中的人物或事件形象图”纳入项目重点方向

### 后续默认动作

- 新 AI 进入项目时，优先读取 `AGENTS.md`、`README.md`、`docs/README.md`
- 每次出现影响项目理解的重要变更，都同步更新根目录说明、路线图或迭代日志
- 后续围绕剧本、交互、分享、配图的讨论，也要落到项目文档中

## 2026-04-25

### 背景

从 main 拉出 `feature/full-story-experience` 分支，目标：完成一个从头到尾体验不错的故事，并把创作过程抽象为可复用流程。

### 本轮完成

- **修复结局触发分布问题**：
  - `gifted_poison` suspicion 阈值从 65 降至 50
  - `discarded_pawn` princeFaction 条件从 `<=1` 修复为 `<=2`（原条件实际不可达）
  - `purged_after_scheme` suspicion 降至 45，priority 提升至 77
  - `cold_palace_decline` 去掉与 empress 路线互斥的 favor 条件，priority 提升至 61
  - `favored_noble_consort` favor 阈值从 78 降至 68，beauty 从 58 降至 52
  - **结果**：500次模拟中14个结局全部触发（之前4个结局从未触发）

- **补全回响矩阵落地**：
  - `offendedConsort` → morning_greeting 新增文本变体（贵妃态度更冷）
  - `observedRivals` → emperor_falls_ill 新增判断信息文本变体
  - `hadGardenEncounter` → rumor_spreads 新增谣言文本变体
  - `foundPoisonClue` → blackmail_consort 新增把柄感文本变体
  - `hasConsortLeverage` → blackmail_consort 新增筹码感文本变体

- **验证工具增强**：
  - verify-book.js 增加结局分布百分比、覆盖率、max/min ratio 检查

### 本轮发现

- 结局分布失衡的根因往往不是"条件太严"，而是：
  1. 条件与数值设计互斥（如 empress<=-2 与 favor<45 在 empress 路线中几乎不可同时满足）
  2. 低优先级结局被高优先级结局覆盖（如 cold_palace_decline 被 peaceful_survivor 覆盖）
  3. 条件实际上不可达（如 discarded_pawn 的 princeFaction<=1 实际最小为2）
- 500次随机模拟可能不足以发现低概率结局，需要配合条件可达性分析

### 后续默认动作

- 每次修改结局条件后，跑 verify-book.js 并检查 never-reached-endings 和 balance-check
- 结局条件调整时，同时检查优先级覆盖关系
- 新增回响时，优先在 echo-hub 节点（morning_greeting, rumor_spreads, emperor_falls_ill）添加

## 2026-04-22

### 背景

项目从单个 HTML 原型，进入全局规划阶段。

### 本轮收获

- 明确放弃纯树结构，采用剧情图模型
- 明确随机性只能在预制内容之间分配
- 明确重要选择需要在后文产生剧情回响
- 明确 story skill 需要拆成通用层和题材层
- 明确第一册需要额外维护 schema 草案、结局触发表、回响矩阵表
- 已建立 `js/data/` 数据层骨架，供后续正式录入剧情使用
- 已建立 `js/runtime/` 最小运行时，支持条件判断、文本变体、选项过滤、效果结算、权重跳转
- 第一册前半段已具备最小可跑通数据，可从入宫推进到中毒危机节点
- 已补齐宫斗本首册全链路，可从入宫走到多类结局
- 已建立微信小游戏 Canvas 入口与基础 UI，可直接在开发者工具中尝试运行
- 已建立 `scripts/verify-book.js` 做结构校验与随机模拟
- 已正式建立剧情写作模板、选项反馈模板与写作检查表
- 明确当前试玩阶段的两个主要优化方向是：文案连贯度和评分区分度
- 已按模板重写首册多处关键节点文案，并补齐大量选项后反馈
- 已新增 `maid_whisper` 情报插入节点，并扩展调查线的分支入口
- 已重新收紧评分公式，避免试玩中大面积落到 `S`

### 后续默认动作

- 每次故事修订后，总结通用规则
- 每次题材修订后，总结题材规则
- 每次准备扩写前，先读取对应规则文档
- 在写第一册具体节点前，先对照回响矩阵检查重要标记是否有后续落点
- 在把文档转成代码时，优先补齐 `choices / outcomes / endings.showIf`
- 每补完一段剧情后，都用固定随机种子跑一遍最小流程，确认没有不可达选择或空 outcome
- 每做出一个新题材首册，都优先沿用现有 runtime 和验证脚本，只替换故事数据
- 先按模板改关键节点文案，再根据试玩反馈继续反向修模板
- 评分系统单独调整，不与文案优化混在同一轮里
- 文案改动后，额外观察新增分支节点在模拟中的命中率，避免新分支写了但实际很少出现
