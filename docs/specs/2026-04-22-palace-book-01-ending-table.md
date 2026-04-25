# 宫斗本第一册结局触发表

## 目标

本表用于把第一册的结局从“概念名单”推进到“可判断规则”。

注意：

- 这里写的是建议触发条件，不是最终平衡值
- 真正落代码时，可以微调阈值
- 结局优先级比单条阈值更重要

## 结局匹配建议

建议运行时按优先级从高到低检查，第一个满足条件的结局即生效。

## 上位类

### E01 `mother_of_realm`

- 标题：母仪天下
- 类别：`rise`
- 优先级：90
- 推荐条件：
  - `flag:choseFactionEmpress=true`
  - `relation:empress>=2`
  - `stat:wisdom>=65`
  - `stat:suspicion<=40`
- 设计意图：
  - 奖励秩序线里的高质量经营

### E02 `favored_noble_consort`

- 标题：贵妃摄宠
- 类别：`rise`
- 优先级：80
- 推荐条件：
  - `stat:favor>=68`
  - `relation:emperor>=1`
  - `stat:beauty>=52`
- 设计意图：
  - 奖励宠爱线，但不一定拥有最高权力

### E03 `trusted_consort`

- 标题：内廷得势
- 类别：`rise`
- 优先级：72
- 推荐条件：
  - `flag:choseFactionEmpress=true`
  - `relation:empress>=0`
  - `stat:favor>=62`
- 设计意图：
  - 承接皇后线的中高位结果，避免结果只剩顶级上位和普通生存

### E04 `behind_the_curtain`

- 标题：垂帘听政
- 类别：`power`
- 优先级：85
- 推荐条件：
  - `flag:choseFactionPrince=true`
  - `relation:princeFaction>=2`
  - `route:manipulative>=2`
  - `stat:wisdom>=75`
- 设计意图：
  - 奖励高风险高回报的操盘路线

### E05 `shadow_powerbroker`

- 标题：幕后执衡
- 类别：`power`
- 优先级：76
- 推荐条件：
  - `flag:choseFactionPrince=true`
  - `relation:princeFaction>=2`
  - `route:manipulative>=3`
- 设计意图：
  - 承接皇子线的中高位成功结果，避免只剩顶级胜利和完全失败

## 生存类

### E06 `peaceful_survivor`

- 标题：偏安一隅
- 类别：`survival`
- 优先级：60
- 推荐条件：
  - `stat:health>0`
  - `stat:suspicion<=45`
  - `route:cautious>=2`
- 设计意图：
  - 让谨慎路线有正向回报，不以“没上位”视作失败

### E07 `lonely_old_age`

- 标题：谨慎终老
- 类别：`survival`
- 优先级：40
- 推荐条件：
  - `stat:health>0`
  - `stat:favor<55`
  - `stat:wisdom>=50`
- 设计意图：
  - 作为低烈度生存结局承接保守玩法

## 权谋反噬类

### E08 `discarded_pawn`

- 标题：被推为弃子
- 类别：`backfire`
- 优先级：70
- 推荐条件：
  - `flag:choseFactionPrince=true`
  - `relation:princeFaction<=2`
  - `route:manipulative>=1`
- 设计意图：
  - 表示投资错误或盟友不稳

### E09 `purged_after_scheme`

- 标题：反遭清算
- 类别：`backfire`
- 优先级：77
- 推荐条件：
  - `flag:hasConsortLeverage=true`
  - `stat:suspicion>=45`
  - `relation:empress<=0`
- 设计意图：
  - 奖惩”拿了把柄却收不住”的玩家

## 逃离类

### E10 `fake_death_escape`

- 标题：诈死脱身
- 类别：`escape`
- 优先级：78
- 推荐条件：
  - `flag:preparedEscapeRoute=true`
  - `flag:protectedMaid=true`
  - `route:survivalist>=2`
  - `stat:wisdom>=60`
- 设计意图：
  - 奖励提前铺路的逃离玩法

### E11 `river_town_retreat`

- 标题：归隐江南
- 类别：`escape`
- 优先级：55
- 推荐条件：
  - `flag:preparedEscapeRoute=true`
  - `stat:health>0`
  - `stat:suspicion<=62`
- 设计意图：
  - 作为较温和的逃离成功结局

## 失败与死亡类

### E12 `cold_palace_decline`

- 标题：冷宫凋零
- 类别：`fall`
- 优先级：61
- 推荐条件：
  - `relation:empress<=-2`
  - `stat:health<=85`
- 设计意图：
  - 承接失宠且无派系庇护的残局

### E13 `gifted_poison`

- 标题：被赐毒酒
- 类别：`death`
- 优先级：88
- 推荐条件：
  - `stat:suspicion>=50`
- 设计意图：
  - 高危高权斗路径的明确失败结局

### E14 `failed_escape`

- 标题：夜逃坠亡
- 类别：`death`
- 优先级：65
- 推荐条件：
  - `flag:preparedEscapeRoute=true`
  - `stat:health<=58`
- 设计意图：
  - 逃离线也必须承担失败风险

## 首册建议优先级顺序

从上到下检查：

1. `mother_of_realm`
2. `gifted_poison`
3. `behind_the_curtain`
4. `favored_noble_consort`
5. `shadow_powerbroker`
6. `trusted_consort`
7. `fake_death_escape`
8. `purged_after_scheme`
9. `discarded_pawn`
10. `failed_escape`
11. `peaceful_survivor`
12. `river_town_retreat`
13. `cold_palace_decline`
14. `lonely_old_age`

## 调平建议（2026-04-25 更新）

### 已调平的结局

| 结局 | 原问题 | 修复方式 | 当前触发率（500次模拟） |
|------|--------|----------|------------------------|
| `gifted_poison` | suspicion>=65 几乎不可达 | 降至 >=50 | ~1.2% |
| `discarded_pawn` | princeFaction<=1 实际不可达（最小为2） | 改为 <=2 | ~0.8% |
| `purged_after_scheme` | suspicion>=62 太严 | 降至 >=45，priority 提至77 | ~0.2% |
| `cold_palace_decline` | favor<40 与 empress<=-2 互斥；priority 50 被覆盖 | 去掉 favor 条件，priority 提至61 | ~0.6% |
| `favored_noble_consort` | favor>=78 太难 | 降至 >=68，beauty 降至 >=52 | ~8.6% |

### 调平经验

- 结局条件不可达的三类根因：
  1. **数值互斥**：某路线的属性变化方向与结局条件相反（如 empress 路线 favor 通常增加，与 favor<40 冲突）
  2. **优先级覆盖**：低 priority 结局被同路线的更高 priority 结局完全覆盖
  3. **逻辑不可达**：条件写的是 `<=1` 但实际最小值为 2
- 每轮调平后必须跑 `node scripts/verify-book.js`，检查 never-reached-endings

### 仍需观察

- `lonely_old_age`：理论上可达，但 500次模拟仍未触发。可能因 peaceful_survivor(60) 覆盖窗口过宽
- `behind_the_curtain`：触发率 ~2.8%，作为最高 power 结局可以接受
- `shadow_powerbroker`：触发率 ~25%， prince 路线最宽出口。若后续觉得太高，可增加 route:manipulative>=4 条件
- `river_town_retreat`：触发率 ~20%，escape 路线最宽出口，合理

## 调平建议

后续在试玩和模拟时重点观察：

- `favored_noble_consort` 是否过于容易达成
- `behind_the_curtain` 是否因为阈值太高而稀有到近乎不可见
- `peaceful_survivor` 是否吃掉太多中间态玩家
- `failed_escape` 是否把逃离线打得过于吃亏
