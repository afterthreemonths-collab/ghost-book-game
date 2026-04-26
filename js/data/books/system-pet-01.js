const { BOOK_SCHEMA_VERSION, SCENE_MODES } = require('../schema');

const systemPetBook01 = {
  id: 'system-pet-01',
  version: BOOK_SCHEMA_VERSION,
  meta: {
    title: '灵宠纪元',
    shortTitle: '灵宠',
    theme: 'system_pet',
    intro: '觉醒仪式上，你激活了一只被全世界嘲笑的废物灵宠——小熊猫。但同时，一个声音在你脑海中响起：神级选择系统，已激活。'
  },
  config: {
    startSceneId: 'awakening_ceremony',
    maxSteps: 20
  },
  stateModel: {
    player: {
      name: '',
      reputation: 0,
      coins: 0
    },
    pet: {
      name: '小熊猫',
      level: 1,
      exp: 0,
      evolutionStage: 0,
      size: 'small',
      attributes: {
        strength: 5,
        defense: 5,
        speed: 5,
        spirit: 5,
        health: 100
      },
      talents: [],
      skills: [],
      evolutionFragments: 0
    },
    system: {
      totalChoices: 0,
      hardChoices: 0
    },
    stats: {
      favor: 50
    },
    relations: {},
    flags: {
      systemActivated: false,
      firstTalentGained: false,
      hadClassroomConflict: false,
      wonFirstBattle: false,
      encounteredBully: false
    },
    routeTags: {
      cautious: 0,
      aggressive: 0,
      cunning: 0
    }
  },
  scenes: {
    awakening_ceremony: {
      id: 'awakening_ceremony',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 1,
      title: '觉醒仪式',
      fallbackText: '学校操场上，十六岁的学生们排成长队，等待一生中最重要的时刻——伴生灵宠觉醒。高台上的觉醒石散发着幽蓝光芒，每个学生上前触摸，便会激发出属于自己的灵宠。前面的人纷纷觉醒出火焰狼、疾风鹰、铁甲犀牛……每个都气势不凡。轮到你了。',
      choices: [
        {
          id: 'touch_stone',
          text: '深吸一口气，将手放上觉醒石',
          hint: '命运的时刻',
          effects: {
            flagsOn: ['systemActivated']
          },
          outcomes: [{ weight: 100, to: 'awakening_result', textAfterChoice: '你把手放上觉醒石。光芒亮起，却异常微弱。' }]
        }
      ],
      tags: ['entry']
    },
    awakening_result: {
      id: 'awakening_result',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_1',
      order: 2,
      title: '觉醒结果',
      fallbackText: '觉醒石的光芒散去，一只毛茸茸的小家伙从你掌心钻了出来。它有着红棕色的皮毛，大大的尾巴，黑溜溜的眼睛正无辜地看着你。全场安静了一秒，然后爆发出哄笑。',
      onEnterEffects: {
        stats: { favor: -10 }
      },
      textVariants: [
        {
          id: 'panda_reveal',
          priority: 100,
          if: ['flag:systemActivated=true'],
          text: '觉醒石的光芒散去，一只毛茸茸的小家伙从你掌心钻了出来。它有着红棕色的皮毛，大大的尾巴，黑溜溜的眼睛正无辜地看着你。全场安静了一秒，然后爆发出哄笑。「小熊猫？F级的废物灵宠！」「这东西除了卖萌还有什么用？」你低头看着掌心里这只巴掌大的小家伙，它正用爪子扒拉着你的手指，嘴里发出细软的嘤咛。就在这时，一个冰冷的声音在你脑海中响起：【神级选择系统激活。检测到嘲讽场景，系统任务触发。】'
        }
      ],
      choices: [
        {
          id: 'accept_fate',
          text: '默默抱起小熊猫，接受嘲笑',
          outcomes: [{ weight: 100, to: 'system_first_choice', textAfterChoice: '你沉默地抱起小熊猫。它的身体温温热热，在你怀里缩成一团。周围的嘲笑声像针一样扎在背上。' }]
        }
      ],
      tags: ['awakening']
    },
    system_first_choice: {
      id: 'system_first_choice',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 3,
      title: '【系统任务】废物？',
      fallbackText: '【系统任务触发】场景：被当众嘲讽灵宠为废物。请选择你的应对方式。',
      choices: [
        {
          id: 'choice_a_bear_it',
          text: 'A. 低头忍耐，默默离开',
          type: 'system',
          systemLabel: 'A',
          hint: '安全，小奖励',
          risk: 'low',
          effects: {
            player: { reputation: -5 },
            pet: { attributes: { spirit: 2 } },
            system: { totalChoices: 1 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_first_choice', textAfterChoice: '你低下头，抱着小熊猫快步离开操场。身后嘲笑声依旧，但你至少避免了更多冲突。系统提示：【精神抗性微幅提升】' }]
        },
        {
          id: 'choice_b_talk_back',
          text: 'B. 简单反驳：灵宠不分强弱，只看御兽师',
          type: 'system',
          systemLabel: 'B',
          hint: '中等风险，中等奖励',
          risk: 'medium',
          effects: {
            player: { reputation: 5 },
            pet: { attributes: { spirit: 5, strength: 3 } },
            system: { totalChoices: 1 },
            routeTags: { aggressive: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_first_choice', textAfterChoice: '你停下脚步，回头平静地说了一句。声音不大，却让附近几个人愣了一下。系统提示：【基础属性小幅提升】' }]
        },
        {
          id: 'choice_c_dominate',
          text: 'C. 当众放话：我的灵宠，以后碾压你们全部',
          type: 'system',
          systemLabel: 'C',
          hint: '高风险，逆天奖励',
          risk: 'high',
          effects: {
            player: { reputation: 20 },
            pet: {
              attributes: { strength: 15, defense: 10, spirit: 10, health: 30 },
              evolutionFragments: 5
            },
            system: { totalChoices: 1, hardChoices: 1 },
            routeTags: { aggressive: 2 },
            talentsAdd: ['giant_body_seed']
          },
          outcomes: [
            { weight: 70, to: 'after_first_choice', textAfterChoice: '你扬起声音，全场瞬间安静。有人想笑，却被你眼里的冷意冻住。你怀中的小熊猫忽然动了动，身体似乎……大了一圈？系统提示：【解锁天赋：巨化之种 | 全属性暴涨 | 进化碎片+5】' },
            { weight: 30, to: 'after_first_choice_fail', textAfterChoice: '你话音刚落，人群中传来更大声的嘲笑。「就凭这只废物？」但你注意到，小熊猫的爪子似乎变硬了一些。系统提示：【部分奖励发放，下次注意分寸】' }
          ]
        }
      ],
      tags: ['system', 'first-choice']
    },
    after_first_choice: {
      id: 'after_first_choice',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 4,
      title: '仪式之后',
      fallbackText: '觉醒仪式结束了。同学们三三两两散去，各自讨论着自己强大的灵宠。你抱着小熊猫走在最后，它在你怀里打了个哈欠，尾巴卷成一个大大的问号。',
      textVariants: [
        {
          id: 'with_giant_seed',
          priority: 100,
          if: ['talent:giant_body_seed=true'],
          text: '觉醒仪式结束了。你抱着小熊猫走在最后，忽然感觉怀里一沉。低头一看，这小家伙的身体似乎比刚才大了一圈，从巴掌大变成了足球大小。它正用爪子拍你的胸口，力道……有点疼。'
        }
      ],
      choices: [
        {
          id: 'go_home',
          text: '先回家，慢慢研究这只小家伙',
          outcomes: [{ weight: 100, to: 'first_night', textAfterChoice: '你抱着小熊猫回了家。一路上它都很安静，只是偶尔用尾巴扫一扫你的手臂。' }]
        },
        {
          id: 'test_abilities',
          text: '找个没人的地方，试试它有什么能力',
          showIf: ['talent:giant_body_seed=true'],
          effects: {
            pet: { attributes: { strength: 5 } }
          },
          outcomes: [{ weight: 100, to: 'first_night', textAfterChoice: '你找了个废弃的训练场，把小熊猫放下。它落地后身体居然又涨大了一圈，四肢也变得粗壮有力。它好奇地拍了拍地面，水泥地裂开了几道缝。你：「……」' }]
        }
      ],
      tags: ['transition']
    },
    after_first_choice_fail: {
      id: 'after_first_choice_fail',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 4.5,
      title: '仪式之后',
      fallbackText: '觉醒仪式结束了。你抱着小熊猫走在最后，它在你怀里安静地缩成一团。虽然刚才的放话被嘲笑了，但你感觉它似乎有了一些微妙的变化。',
      choices: [
        {
          id: 'go_home_fail',
          text: '先回家',
          outcomes: [{ weight: 100, to: 'first_night', textAfterChoice: '你默默回了家。小熊猫在你怀里睡得很香，仿佛完全不在乎外面的风风雨雨。' }]
        }
      ],
      tags: ['transition']
    },
    first_night: {
      id: 'first_night',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 5,
      title: '第一夜',
      fallbackText: '夜深人静。你坐在床边，看着面前这只毛茸茸的小熊猫。它正在啃你给它准备的竹子，吃得很香。你打开系统面板，发现只有一行字：【更多系统任务将在冲突场景中触发。】',
      choices: [
        {
          id: 'sleep_early',
          text: '早点睡，明天还要上课',
          outcomes: [{ weight: 100, to: 'classroom_day', textAfterChoice: '你关灯睡觉。黑暗中，小熊猫蜷在你枕头边，呼吸均匀。你不知道，它的身体正在以微不可察的速度，悄悄生长。' }]
        },
        {
          id: 'train_pet',
          text: '趁夜训练小熊猫',
          effects: {
            pet: { attributes: { strength: 3, speed: 3 } }
          },
          outcomes: [{ weight: 100, to: 'classroom_day', textAfterChoice: '你带小熊猫到楼下空地，试着让它做一些基础动作。它学得很快，尤其是一个「扑」的动作，力道大得把你撞退了两步。' }]
        }
      ],
      tags: ['rest']
    },
    classroom_day: {
      id: 'classroom_day',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 6,
      title: '课堂风波',
      fallbackText: '第二天，御兽理论课。老师正在讲解灵宠品级的重要性，忽然点名让你站起来。「听说你觉醒了一只F级的小熊猫？来，给大家讲讲，你打算怎么培养这个……吉祥物？」全班哄笑。',
      choices: [
        {
          id: 'stay_silent_class',
          text: '沉默站着，等老师说完',
          outcomes: [{ weight: 100, to: 'system_classroom', textAfterChoice: '你沉默地站着。老师的嘲讽还在继续，但你注意到小熊猫从你书包里探出头，黑眼睛一眨不眨地盯着老师。' }]
        },
        {
          id: 'retort_class',
          text: '平静回答：品级不代表一切',
          effects: {
            routeTags: { aggressive: 1 }
          },
          outcomes: [{ weight: 100, to: 'system_classroom', textAfterChoice: '你平静地说了一句。老师愣了一下，然后冷笑：「好，那我就拭目以待。」' }]
        }
      ],
      tags: ['classroom']
    },
    system_classroom: {
      id: 'system_classroom',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 7,
      title: '【系统任务】课堂羞辱',
      fallbackText: '【系统任务触发】场景：被老师当众羞辱。请选择你的应对方式。',
      choices: [
        {
          id: 'class_a_apologize',
          text: 'A. 低头道歉，承认自己的灵宠确实不行',
          type: 'system',
          systemLabel: 'A',
          hint: '安全，小奖励',
          risk: 'low',
          effects: {
            player: { reputation: -10 },
            system: { totalChoices: 1 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_classroom', textAfterChoice: '你低头道歉。老师满意地点点头，让你坐下。系统提示：【心态稳定，精神+3】' }]
        },
        {
          id: 'class_b_debate',
          text: 'B. 有理有据地反驳老师的偏见',
          type: 'system',
          systemLabel: 'B',
          hint: '中等风险，中等奖励',
          risk: 'medium',
          effects: {
            player: { reputation: 10 },
            pet: { attributes: { spirit: 5 } },
            system: { totalChoices: 1 },
            routeTags: { cunning: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_classroom', textAfterChoice: '你列出了一堆历史案例，证明低品级灵宠也有逆袭先例。老师脸色不太好看，但也没法反驳。系统提示：【知识就是力量，灵力+5】' }]
        },
        {
          id: 'class_c_challenge',
          text: 'C. 当场挑战：一周后的实战考核，我的灵宠碾压全场',
          type: 'system',
          systemLabel: 'C',
          hint: '高风险，逆天奖励',
          risk: 'high',
          effects: {
            player: { reputation: 30 },
            pet: {
              attributes: { strength: 20, defense: 15, speed: 10, health: 40 },
              evolutionFragments: 10
            },
            system: { totalChoices: 1, hardChoices: 1 },
            routeTags: { aggressive: 2 },
            talentsAdd: ['iron_skin_seed'],
            skillsAdd: ['crush']
          },
          outcomes: [
            { weight: 60, to: 'after_classroom', textAfterChoice: '你话音落下，教室安静了三秒。然后有人嗤笑，有人摇头。但你怀中的小熊猫忽然立起身体，发出一声从未有过的低吼——那声音不像小熊猫，更像某种……巨兽。系统提示：【解锁天赋：铁肤之种 | 解锁技能：碾压 | 全属性暴涨 | 进化碎片+10】' },
            { weight: 40, to: 'after_classroom_fail', textAfterChoice: '老师冷笑：「好，那我就等着看你的笑话。」但你注意到小熊猫的爪子变得乌黑坚硬，像铁一样。系统提示：【部分奖励发放】' }
          ]
        }
      ],
      tags: ['system', 'classroom']
    },
    after_classroom: {
      id: 'after_classroom',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 8,
      title: '风波之后',
      fallbackText: '课后，你被同学们围观。有人嘲笑，有人好奇。但你已经顾不上这些了——你感觉到小熊猫正在发生某种变化。',
      textVariants: [
        {
          id: 'with_iron_skin',
          priority: 100,
          if: ['talent:iron_skin_seed=true'],
          text: '课后，你一个人走到操场角落。小熊猫从你怀里跳下来，落地时发出沉闷的响声。它的体型已经涨到了半人高，皮毛下隐约可见金属般的光泽。你试着用石头砸它的背——石头碎了，它连哼都没哼一声。'
        }
      ],
      choices: [
        {
          id: 'prepare_for_trial',
          text: '为一周后的野外试炼做准备',
          effects: {
            flagsOn: ['hadClassroomConflict']
          },
          outcomes: [{ weight: 100, to: 'wilderness_trial', textAfterChoice: '你带着小熊猫开始了秘密训练。它的成长速度快得惊人，每天醒来都比昨天大一圈。' }]
        }
      ],
      tags: ['transition']
    },
    after_classroom_fail: {
      id: 'after_classroom_fail',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 8.5,
      title: '风波之后',
      fallbackText: '课后，你默默离开教室。虽然挑战的口气被嘲笑了，但你感觉到小熊猫似乎有了一些变化。',
      choices: [
        {
          id: 'prepare_anyway',
          text: '不管怎样，开始准备试炼',
          outcomes: [{ weight: 100, to: 'wilderness_trial', textAfterChoice: '你默默开始了训练。小熊猫虽然还是毛茸茸的一团，但动作明显比昨天灵活了许多。' }]
        }
      ],
      tags: ['transition']
    },
    wilderness_trial: {
      id: 'wilderness_trial',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 9,
      title: '野外试炼',
      fallbackText: '一周后，学校组织野外试炼。所有新生都要进入低阶灵兽区，猎杀或驯服至少一只灵兽作为考核成绩。同学们纷纷召唤出自己的灵宠——火焰狼喷吐着火舌，疾风鹰盘旋在空中。你看了看身边的小熊猫。它现在已经……相当大只了。',
      textVariants: [
        {
          id: 'giant_panda_trial',
          priority: 100,
          if: ['talent:giant_body_seed=true'],
          text: '一周后，学校组织野外试炼。所有新生都要进入低阶灵兽区。你看了看身边的小熊猫——它现在已经有一人多高，站在你身边像个毛茸茸的巨兽。周围同学纷纷侧目，有人甚至后退了几步。'
        }
      ],
      choices: [
        {
          id: 'enter_wilderness',
          text: '进入灵兽区，开始试炼',
          outcomes: [{ weight: 100, to: 'encounter_beast', textAfterChoice: '你带着小熊猫踏入了灵兽区。空气中弥漫着草木和野兽的气息。' }]
        }
      ],
      tags: ['trial']
    },
    encounter_beast: {
      id: 'encounter_beast',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 10,
      title: '遭遇灵兽',
      fallbackText: '深入灵兽区不久，你们遭遇了一只狂暴铁背熊——D级灵兽，皮糙肉厚，力量惊人。其他同学见状纷纷后退，有人已经开始逃跑。铁背熊盯着你们，发出低沉的咆哮。',
      choices: [
        {
          id: 'observe_bear',
          text: '观察局势，不急于出手',
          outcomes: [{ weight: 100, to: 'system_bear', textAfterChoice: '你拉住小熊猫，先观察铁背熊的动向。它似乎在保护什么——身后有一个闪烁着微光的洞穴。' }]
        }
      ],
      tags: ['encounter']
    },
    system_bear: {
      id: 'system_bear',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 11,
      title: '【系统任务】铁背熊',
      fallbackText: '【系统任务触发】场景：遭遇D级灵兽铁背熊。请选择你的应对方式。',
      choices: [
        {
          id: 'bear_a_flee',
          text: 'A. 带小熊猫撤退，寻找更弱的目标',
          type: 'system',
          systemLabel: 'A',
          hint: '安全，小奖励',
          risk: 'low',
          effects: {
            player: { reputation: -5 },
            system: { totalChoices: 1 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_bear', textAfterChoice: '你带着小熊猫悄悄绕开了。铁背熊没有追来，但你错过了那个洞穴里的东西。系统提示：【生存优先，速度+3】' }]
        },
        {
          id: 'bear_b_distract',
          text: 'B. 让小熊猫吸引注意力，你去偷洞穴里的宝物',
          type: 'system',
          systemLabel: 'B',
          hint: '中等风险，中等奖励',
          risk: 'medium',
          effects: {
            player: { coins: 100 },
            pet: { attributes: { speed: 5 } },
            system: { totalChoices: 1 },
            routeTags: { cunning: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_bear', textAfterChoice: '小熊猫冲出去吸引了铁背熊的注意力，你趁机溜进洞穴，拿到了一块散发着温热气息的灵石。系统提示：【灵石获取 | 金币+100 | 速度+5】' }]
        },
        {
          id: 'bear_c_crush',
          text: 'C. 命令小熊猫：坐死它',
          type: 'system',
          systemLabel: 'C',
          hint: '高风险，逆天奖励',
          risk: 'high',
          effects: {
            player: { reputation: 40, coins: 200 },
            pet: {
              attributes: { strength: 25, defense: 15, health: 50 },
              evolutionFragments: 15,
              exp: 50
            },
            system: { totalChoices: 1, hardChoices: 1 },
            routeTags: { aggressive: 2 },
            talentsAdd: ['crush_aura'],
            skillsAdd: ['mega_crush']
          },
          outcomes: [
            { weight: 70, to: 'bear_victory', textAfterChoice: '你轻声说了一句：「坐。」小熊猫猛地跃起，身体在半空中暴涨，从一人高变成了一辆卡车大小。它轰然落下——铁背熊连惨叫都没来得及发出，就被压进了土里。全场寂静。系统提示：【解锁天赋：碾压气场 | 解锁技能：万吨坐杀 | 进化碎片+15 | 力量暴涨】' },
            { weight: 30, to: 'bear_injured', textAfterChoice: '小熊猫冲了上去，但铁背熊的力量比想象中更强。一番激战后，铁背熊倒下了，小熊猫也受了伤。系统提示：【惨胜 | 部分奖励发放】' }
          ]
        }
      ],
      tags: ['system', 'combat']
    },
    bear_victory: {
      id: 'bear_victory',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 12,
      title: '碾压',
      fallbackText: '小熊猫慢慢从铁背熊身上爬起来，抖了抖毛。铁背熊已经昏死过去，地面上留下了一个巨大的坑。远处，刚才逃跑的同学们目瞪口呆地看着这一幕。',
      choices: [
        {
          id: 'collect_loot',
          text: '搜刮战利品，离开现场',
          effects: {
            flagsOn: ['wonFirstBattle'],
            player: { coins: 300 }
          },
          outcomes: [{ weight: 100, to: 'demo_ending', textAfterChoice: '你搜走了铁背熊守护的灵石和几块稀有矿石。小熊猫跟在你身后，体型已经恢复到了正常大小，但眼神明显不一样了——它变得……更有自信了？' }]
        }
      ],
      tags: ['victory']
    },
    bear_injured: {
      id: 'bear_injured',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 12.5,
      title: '惨胜',
      fallbackText: '小熊猫摇摇晃晃地走回来，身上有几道爪痕。它赢了，但赢得很艰难。铁背熊倒在不远处，还在喘息。',
      choices: [
        {
          id: 'heal_pet',
          text: '给它包扎伤口，拿走灵石',
          effects: {
            flagsOn: ['wonFirstBattle'],
            player: { coins: 100 }
          },
          outcomes: [{ weight: 100, to: 'demo_ending', textAfterChoice: '你给小熊猫简单包扎了一下，拿走了洞穴里的灵石。它舔了舔你的手，眼神依然明亮。' }]
        }
      ],
      tags: ['victory']
    },
    after_bear: {
      id: 'after_bear',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 12,
      title: '试炼结束',
      fallbackText: '试炼时间到了。你带着小熊猫走出灵兽区，虽然没有正面击败铁背熊，但也获得了一些收获。',
      choices: [
        {
          id: 'return_school',
          text: '回学校汇报',
          outcomes: [{ weight: 100, to: 'demo_ending', textAfterChoice: '你回到了学校。同学们看你的眼神已经有些不同了——至少不再像看废物那样。' }]
        }
      ],
      tags: ['transition']
    },
    demo_ending: {
      id: 'demo_ending',
      kind: 'scene',
      mode: SCENE_MODES.ENDING,
      chapter: 'chapter_2',
      order: 13,
      title: 'Demo 结束',
      fallbackText: '',
      endingCandidates: ['demo_end'],
      tags: ['ending']
    }
  },
  endings: {
    demo_end: {
      id: 'demo_end',
      title: '初露锋芒',
      category: 'progress',
      priority: 100,
      summary: '这只是开始。你的小熊猫已经从一只被全世界嘲笑的废物，成长为让人不敢小觑的存在。下一章：校内考核，碾压天才。',
      showIf: [],
      scoreBonus: 0
    }
  }
};

module.exports = {
  systemPetBook01
};
