# 宫斗本第一册 Schema 草案

## 目标

本文件把第一册从节点蓝图进一步收束成“可直接落入代码”的字段约定。

它回答三个问题：

- 第一册的数据对象长什么样
- 每类节点各自最少需要哪些字段
- 首册阶段哪些能力先做，哪些先不做

## 首册数据文件建议

建议第一册至少拆成两个层次：

```text
js/
  data/
    schema.js
    books/
      palace-book-01-outline.js
```

后续如果首册内容量上来，再拆成：

```text
js/
  data/
    books/
      palace-book-01/
        meta.js
        state-model.js
        scenes-ch1.js
        scenes-ch2.js
        endings.js
        index.js
```

首册早期先不拆太细，避免文件过多拖慢迭代。

## Book 级字段

```js
const palaceBook01 = {
  id: 'palace-book-01',
  version: 'v1',
  meta: {
    title: '宫斗本',
    shortTitle: '宫斗',
    theme: 'palace',
    intro: '从秀女到后宫生存者的命运抉择'
  },
  config: {
    startSceneId: 'intro_selection',
    maxSteps: 14,
    endingSceneIds: ['mother_of_realm', 'river_town_retreat']
  },
  stateModel: { ... },
  scenes: { ... },
  endings: { ... }
};
```

## State Model 级字段

```js
stateModel: {
  stats: {
    health: 100,
    favor: 50,
    wisdom: 50,
    beauty: 50,
    suspicion: 0
  },
  relations: {
    emperor: 0,
    empress: 0,
    nobleConsort: 0,
    eunuchChief: 0,
    maidAlly: 0,
    princeFaction: 0
  },
  flags: {
    observedRivals: false,
    madeShowyDebut: false,
    bribedEunuch: false,
    hadGardenEncounter: false,
    offendedConsort: false,
    foundPoisonClue: false,
    protectedMaid: false,
    choseFactionEmpress: false,
    choseFactionPrince: false,
    preparedEscapeRoute: false,
    hasConsortLeverage: false
  },
  routeTags: {
    cautious: 0,
    ambitious: 0,
    manipulative: 0,
    loyalist: 0,
    survivalist: 0
  }
}
```

规则：

- `stats` 用于硬门槛与即时反馈
- `relations` 用于关键人物态度和派系支持
- `flags` 用于记录历史事实
- `routeTags` 用于记录长期风格偏向

## Scene 通用字段

所有节点统一采用下面这套字段，不强求每个字段都出现。

```js
const scene = {
  id: 'intro_selection',
  kind: 'scene',
  mode: 'choice',
  chapter: 'chapter_1',
  order: 1,
  title: '初入深宫',
  fallbackText: '你站在宫门前，四周目光各异。',
  textVariants: [],
  enterEvents: [],
  choices: [],
  onEnterEffects: null,
  tags: ['entry', 'tone_setter']
};
```

字段解释：

- `kind`：保留给未来区分 `scene` / `ending`
- `mode`：`choice`、`event`、`death`、`ending`
- `chapter`：用于内容组织和调试
- `order`：章节内排序提示，不用于逻辑跳转
- `fallbackText`：默认文本
- `textVariants`：条件文本替换
- `enterEvents`：入场先触发的事件
- `choices`：可选项
- `onEnterEffects`：进入节点即生效的固定状态变化
- `tags`：给调试、筛选、校验使用

## 文本变体字段

```js
{
  id: 'text_seen_after_garden',
  priority: 100,
  if: ['flag:hadGardenEncounter=true'],
  text: '你刚踏入殿中，便察觉好几道目光落在自己身上。'
}
```

规则：

- 每个节点建议不超过 4 个文本变体
- 优先用来表现回响，不要承载太多逻辑
- 命中最高优先级后即停止匹配

## Enter Event 字段

```js
{
  id: 'maid_secret_warning',
  weight: 30,
  if: ['flag:bribedEunuch=true'],
  effects: {
    flagsOn: ['warnedBeforeGreeting']
  },
  text: '一个小太监趁人不备低声提醒你，今日贵妃心情极差。',
  nextOverride: null
}
```

规则：

- 首册阶段每个节点最多 1 个生效事件
- `nextOverride` 只在强插入事件时使用
- 如果事件只是补文本和标记，不应强制跳走

## Choice 字段

```js
{
  id: 'observe_rivals',
  text: '暗中观察秀女与嬷嬷',
  hint: '先掌握局势',
  showIf: [],
  disableIf: [],
  effects: {
    stats: { wisdom: 6 },
    relations: {},
    flagsOn: ['observedRivals'],
    flagsOff: [],
    routeTags: { cautious: 1 }
  },
  outcomes: [
    { weight: 100, to: 'selection_day' }
  ]
}
```

规则：

- 首册阶段不做复杂的 `disableReason`
- 没有隐藏需求时直接通过 `showIf` 控制是否展示
- `effects` 里没有变更的字段可以省略

## Outcome 字段

```js
{
  id: 'fall_into_punishment',
  weight: 45,
  if: [],
  to: 'punished_in_hall',
  textAfterChoice: '你的话音刚落，殿内气氛骤然变了。'
}
```

首册规则：

- 一个选择最多 3 个 outcome
- 若带 `if`，先过滤后再权重抽取
- 若过滤后为空，视为配置错误

## Death 节点字段

```js
const deathScene = {
  id: 'gifted_poison_death',
  kind: 'scene',
  mode: 'death',
  chapter: 'chapter_5',
  title: '赐死',
  fallbackText: '毒酒摆在案前时，你知道自己已经没有退路。',
  deathSummary: '你在后宫权斗中失势，被安静地抹去。',
  resultTag: 'death',
  restartable: true
};
```

规则：

- 死亡节点不再提供常规 choices
- 由运行时统一跳去结果/重开逻辑

## Ending 字段

```js
const ending = {
  id: 'mother_of_realm',
  title: '母仪天下',
  category: 'rise',
  summary: '你凭借谨慎与时机，在风波后坐上凤位。',
  showIf: [
    'flag:choseFactionEmpress=true',
    'relation:empress>=2',
    'stat:wisdom>=65'
  ],
  priority: 90,
  scoreModifiers: {
    bonus: 30
  },
  tags: ['rise', 'orthodox', 'high-value']
};
```

规则：

- 结局根据优先级自上而下匹配
- 首册先不做多结局并列评分比较
- 第一个命中的结局即采用

## 首册阶段不做的字段

为了控制复杂度，以下能力先不进入 v1 数据结构：

- 选项冷却
- 多轮背包道具
- 长链 scripted sequence
- 多人好感度复杂联动公式
- 动态插槽文本拼装

## 命名规范

### 节点 ID

- 使用英文 snake_case
- 名字体现功能，不体现文案语气

例子：

- `intro_selection`
- `morning_greeting`
- `forced_public_investigation`

### Flag

- 使用过去式或完成态

例子：

- `bribedEunuch`
- `hadGardenEncounter`
- `preparedEscapeRoute`

### Route Tag

- 使用抽象风格词，不绑定具体剧情动作

例子：

- `cautious`
- `ambitious`
- `manipulative`

## 实现顺序建议

下一步把 schema 变成代码时，建议顺序如下：

1. 固定 `stateModel`
2. 固定 `scene` 和 `choice` 结构
3. 先录入第一章和第二章节点
4. 再录入结局
5. 最后接入解释器和原型页

