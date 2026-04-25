# Story Production Playbook

## 目标

本文件总结“从脑暴到可玩首册”的一套项目内默认流程。

适用场景：

- 新题材第一本
- 旧题材扩写新分册
- 需要快速做出可试玩垂直切片

## 默认流程

### 1. 先收束系统

先确定：

- 节点 schema
- 条件表达式
- 状态模型
- 结局解析方式

没有这一步，不开始大规模写故事。

### 2. 再做题材蓝图

先产出：

- 路线矩阵
- 节点图
- 回响矩阵
- 结局池
- 正文写作模板
- 选项反馈模板

### 3. 再写可跑通内容

不要一开始就追求最全内容，优先做：

- 一条完整通路
- 2 到 3 条明显不同的中盘分歧
- 至少 3 个已命中的结局

### 4. 同步做运行时

内容和运行时要一起推进：

- 条件判断
- 文本变体
- 选项过滤
- 状态结算
- 结局解析

### 5. 每次补完都校验

默认执行：

- 结构校验
- 随机模拟
- 手工检查关键回响点
- 用文案清单检查节点连贯度

## 可玩首册的最低交付标准

- 从开始到结局能完整跑通
- 没有缺失跳转和空选项节点
- 至少有 3 类路线体验
- 至少有 5 个实际可达结局
- 玩家能明确感知前史对后文的影响

## 当前项目里已形成的可复用做法

- 用 `scripts/verify-book.js` 做结构校验和随机模拟
- 用 route-specific ending candidates 保证每条终局路线都有落点
- 用短文本节点控制单屏交互体验
- 用 `flag + relation + routeTag` 混合驱动回响
- 用“承接层 + 临场层 + 压力层 + 选项后反馈”提升短节点连贯度

## 创作工具链

当前项目内可用的工具：

- `node scripts/verify-book.js` — 结构校验 + 随机模拟 + 结局分布分析
- `node scripts/check-echo-matrix.js` — 回响矩阵自动检查

工具使用顺序：
1. 写内容 → 2. 跑 verify-book.js → 3. 跑 check-echo-matrix.js → 4. 人工检查关键节点 → 5. 继续迭代

## 结局调平 checklist

每次修改结局条件后必须检查：

- [ ] 跑 verify-book.js，确认 never-reached-endings 为空
- [ ] 检查 balance-check 的 max/min ratio，理想 < 20
- [ ] 排查"条件逻辑不可达"（如写 `<=1` 但实际最小值为 2）
- [ ] 排查"数值互斥"（如某路线的属性变化方向与结局条件相反）
- [ ] 排查"优先级覆盖"（低 priority 结局是否被同路线更高 priority 完全覆盖）
- [ ] 更新 `docs/specs/2026-04-22-palace-book-01-ending-table.md`

## 回响矩阵落地 checklist

每次新增 flag 时必须完成：

- [ ] 在 echo-hub 节点（morning_greeting, rumor_spreads, emperor_falls_ill）至少添加 1 个文本变体
- [ ] 在至少 1 个 choice 中添加 showIf 或改变概率
- [ ] 在至少 1 个结局中体现影响（showIf、priority 或 scoreBonus）
- [ ] 跑 check-echo-matrix.js 验证
- [ ] 更新 `docs/specs/2026-04-22-palace-book-01-echo-matrix.md`

## 下一步如何复用

扩第二本或第二题材时，直接复用：

- `js/data/schema.js`
- `js/runtime/story-runner.js`
- `js/runtime/story-validator.js`
- `js/ui/renderer.js`
- `scripts/verify-book.js`
- `scripts/check-echo-matrix.js`

然后只需要替换或扩展：

- 新的 `stateModel`
- 新的 `scenes`
- 新的 `endings`
