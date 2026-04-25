# 穿书模拟器 Story System v1

## 目标

本项目的核心不是单个故事页面，而是一套可长期复用的「预制剧情分支系统」。

这套系统需要同时满足以下要求：

- 保留当前 HTML 原型的轻量交互节奏
- 支持明显的分支感，而不是线性剧情
- 支持概率事件，但所有可达内容都必须是开发阶段预制好的
- 支持前文选择对后续剧情、选项、描述的持续影响
- 支持不同题材复用同一套结构
- 能在微信小游戏环境中稳定运行

## 结论

不采用纯树状结构，采用：

`剧情图（directed graph） + 玩家状态（state） + 条件文本/条件选项 + 权重随机结果`

原因：

- 纯树结构会在中后期内容量爆炸
- 剧情图允许分支后重新汇合，能控制制作成本
- 状态系统可以让同一个节点对不同玩家产生不同内容表现
- 概率只作用于预制节点之间的跳转，不会引入不可控生成

## 核心设计原则

### 1. 剧情内容必须预制

运行时只做：

- 条件判断
- 权重随机
- 状态变更
- 节点跳转

运行时不生成自由文本剧情。

### 2. 选择影响要分两层

每个选择都应该至少落在以下两种影响中的一种，最好两者都有：

- 数值影响：如 `favor`、`wisdom`
- 叙事影响：如触发标记、改变人物关系、改变后续文本或可选项

### 3. 分支不等于节点无限增长

优先做“局部分支 + 中程回响 + 汇合再分化”，而不是每个选择都永久分叉到底。

推荐节奏：

- 关键节点处分出多条路线
- 中间通过状态与标记制造差异体验
- 在大章节末尾回收到共享节点
- 再从共享节点分出下一轮路线

### 4. 随机性是增强器，不是主体

随机结果应该增加戏剧性和重玩价值，但不能让玩家感觉“完全不可控”。

推荐：

- 关键主线选择由玩家主导
- 事件触发、他人撞见、谣言发酵、密信是否送达等用概率处理
- 概率可以被玩家已有状态修正

## 数据模型

## Book

```js
const book = {
  id: 'palace-book-01',
  version: 'v1',
  meta: {
    title: '宫斗本',
    theme: 'palace',
    intro: '从秀女到后宫生存者的命运抉择'
  },
  config: {
    startSceneId: 'intro_selection',
    maxSteps: 14
  },
  stateModel: { ... },
  scenes: { ... },
  endings: { ... }
};
```

## Player State

运行时状态分为五类。

### 1. 基础属性 stats

适合做即时反馈和硬条件判断。

```js
stats: {
  health: 100,
  favor: 50,
  wisdom: 50,
  beauty: 50,
  reputation: 0,
  suspicion: 0
}
```

### 2. 关系 relations

适合记录关键角色关系变化。

```js
relations: {
  emperor: 0,
  empress: 0,
  nobleConsort: 0,
  eunuchChief: 0
}
```

### 3. 标记 flags

适合记录重要一次性历史事实。

```js
flags: {
  bribedEunuch: true,
  offendedConsort: false,
  knowsPoisonClue: true
}
```

### 4. 路线计数 routeTags

适合记录长期倾向，而不是单点结果。

```js
routeTags: {
  cautious: 2,
  ambitious: 1,
  manipulative: 3,
  loyalist: 0
}
```

### 5. 历史摘要 history

只记录必要信息，不保留冗余全文。

```js
history: {
  visitedScenes: ['intro_selection', 'first_greeting'],
  pickedChoices: ['observe_rivals', 'bribe_eunuch']
}
```

## Scene

每个节点是一个场景对象。

```js
const scene = {
  id: 'first_greeting',
  chapter: 'chapter_2',
  title: '晨昏定省',
  mode: 'choice',
  textVariants: [ ... ],
  enterEvents: [ ... ],
  choices: [ ... ],
  fallbackText: '清晨请安，殿内气氛沉重。'
};
```

字段说明：

- `id`：唯一节点 ID
- `chapter`：用于内容分组和调试
- `mode`：节点类型，如 `choice`、`event`、`ending`、`death`
- `textVariants`：同节点下的条件描述变体
- `enterEvents`：进入节点时先结算的随机事件
- `choices`：当前玩家可见的选择列表
- `fallbackText`：没有命中文本变体时的默认文本

## 文本变体 Text Variants

用于实现“同一个节点，不同玩家看到的描述不同”。

```js
textVariants: [
  {
    if: ['flag:bribedEunuch=true'],
    priority: 100,
    text: '你刚入殿，便注意到昨日收过你银子的太监刻意避开了你的视线。'
  },
  {
    if: ['relation:nobleConsort<=-2'],
    priority: 90,
    text: '贵妃一眼扫来，眼底寒意几乎不加掩饰。'
  }
]
```

规则：

- 同一时刻只取优先级最高的匹配项
- 必须提供默认文本
- 文本变体只改变表现，不直接改变结果

## Choice

```js
const choice = {
  id: 'keep_silent',
  text: '低头不语，先看别人怎么说',
  hint: '稳妥',
  showIf: ['stat:wisdom>=30'],
  disableIf: [],
  effects: {
    stats: { wisdom: 2 },
    relations: { empress: 1 },
    flagsOn: ['kept_silent_at_greeting'],
    routeTags: { cautious: 1 }
  },
  outcomes: [
    {
      weight: 70,
      to: 'rumor_spreads'
    },
    {
      weight: 30,
      to: 'empress_notices_you'
    }
  ]
};
```

规则：

- `showIf` 决定该选项是否出现
- `disableIf` 只做保留展示时使用，小游戏初期可不做
- `effects` 先结算，再进入结果分配
- `outcomes` 至少有一个结果

## Outcome

用于承载概率分支。

```js
{
  weight: 40,
  to: 'caught_by_consort',
  if: ['flag:offendedConsort=true'],
  textAfterChoice: '你刚转身，身后忽然传来环佩轻响。'
}
```

规则：

- 先过滤 `if` 条件，再按 `weight` 做抽取
- 允许所有结果都通向同一后继节点，但附带不同过场文本
- 推荐每个选择的直接结果分支不超过 3 个，避免局部过载

## Enter Event

进入节点时自动触发的事件。

适合：

- 被人撞见
- 密信送达失败
- 身体旧伤发作
- 谣言突然扩散

```js
enterEvents: [
  {
    id: 'maid_reports_you',
    weight: 20,
    if: ['flag:visited_garden_last_night=true'],
    effects: {
      stats: { suspicion: 10 },
      flagsOn: ['reported_by_maid']
    },
    nextOverride: 'questioned_by_empress'
  }
]
```

规则：

- `enterEvents` 在节点文本展示前结算
- 一般只触发 0 或 1 个
- 只负责“插入戏剧变化”，不应频繁夺走玩家选择权

## Ending

结局不是单独写死在一个大函数里，而应数据化。

```js
const ending = {
  id: 'ending_regent',
  title: '垂帘听政',
  showIf: [
    'route:manipulative>=2',
    'stat:wisdom>=75',
    'relation:princeFaction>=2'
  ],
  summary: '年幼皇子继位，你以太后之名掌握朝局。',
  scoreModifiers: {
    bonus: 35
  },
  tags: ['power', 'high_risk', 'high_value']
};
```

结局推荐分层：

- 大类：生存、上位、权谋、逃离、死亡
- 子类：每类下 2 到 4 个具体版本

## 条件表达式规范

初期不要做复杂脚本，使用轻量 DSL 即可。

推荐格式：

- `stat:wisdom>=60`
- `relation:emperor<=-2`
- `flag:bribedEunuch=true`
- `route:cautious>=2`
- `history:pickedChoice=bribe_eunuch`

初期只支持 `>=`、`<=`、`=` 三类比较，够用且便于校验。

## 推荐内容规模

第一本建议控制在：

- 单次游玩决策点：10 到 14
- 独立场景节点：25 到 40
- 关键历史标记：8 到 12
- 核心关系角色：4 到 6
- 结局数量：10 到 16

## 性能判断

只要运行时只处理当前节点，不全图遍历，性能不是主要风险。

微信小游戏环境中的主要开销会在：

- Canvas 文本排版
- 图片资源加载
- 输入命中检测

剧情数据读取本身不是瓶颈。

真正需要提前控制的是内容复杂度。

## 需要配套的校验器

后续建议补一套离线校验工具，用于在写故事时发现问题。

最低优先级的校验项：

- 节点 ID 唯一性检查
- 跳转目标存在性检查
- 不可达节点检查
- 永远不可见选项检查
- 结局可达性检查
- 概率权重空集检查
- 条件表达式语法检查

第二阶段可以加：

- 1000 次模拟跑图的路径分布统计
- 重要选择后续回响覆盖率检查
- 数值增长失控检查

## v1 范围边界

Story System v1 暂不支持：

- 运行时 AI 剧情生成
- 多段长文本自由拼装
- 复杂背包系统
- 网格式地图探索
- 战斗系统
- 时间线回溯玩法

先把“强分支、强回响、轻交互”的核心体验做稳定。

## 推荐落地顺序

1. 先固化 `Book / Scene / Choice / Outcome / Ending` schema
2. 再用宫斗本首册做第一轮真实验证
3. 验证通过后，再抽象到其他题材

