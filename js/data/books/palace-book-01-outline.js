const { BOOK_SCHEMA_VERSION, SCENE_MODES } = require('../schema');

const palaceBook01 = {
  id: 'palace-book-01',
  version: BOOK_SCHEMA_VERSION,
  meta: {
    title: '宫斗本',
    shortTitle: '宫斗',
    theme: 'palace',
    intro: '从秀女到后宫生存者的命运抉择'
  },
  config: {
    startSceneId: 'intro_selection',
    maxSteps: 14
  },
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
  },
  scenes: {
    intro_selection: {
      id: 'intro_selection',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 1,
      title: '初入深宫',
      fallbackText: '宫门在你身后缓缓合拢，像把外头的人生一并关了出去。掌事嬷嬷沿着秀女们逐个看过去，目光在你脸上停了一瞬，又像什么都没发生似的移开。你知道，从这一刻起，别人记住你的方式，将决定你在这深宫里是先活下来，还是先被看见。',
      choices: [
        {
          id: 'lay_low',
          text: '低调入宫，不争一时',
          hint: '稳妥开局',
          effects: {
            stats: { wisdom: 4, favor: -3 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'selection_day', textAfterChoice: '你微微垂眼，把自己藏进人群最安全的那一层阴影里。至少这一刻，还没有人非得记住你。' }]
        },
        {
          id: 'make_showy_debut',
          text: '精心打扮，一鸣惊人',
          hint: '高风险高回报',
          effects: {
            stats: { beauty: 8, favor: 6, suspicion: 4 },
            flagsOn: ['madeShowyDebut'],
            routeTags: { ambitious: 1 }
          },
          outcomes: [{ weight: 100, to: 'selection_day', textAfterChoice: '你抬眼时故意没有收住锋芒，周围几名秀女的呼吸都轻轻乱了一拍。有人艳羡，也有人已经开始不快。' }]
        },
        {
          id: 'observe_rivals',
          text: '暗中观察秀女与嬷嬷',
          hint: '先掌握局势',
          effects: {
            stats: { wisdom: 6 },
            flagsOn: ['observedRivals'],
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'selection_day', textAfterChoice: '你没有急着往前，只先记住了谁在强装镇定，谁在借机张望，谁又和掌事嬷嬷交换了一个太快的眼神。' }]
        }
      ],
      tags: ['entry', 'core-choice']
    },
    selection_day: {
      id: 'selection_day',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 2,
      title: '殿选',
      fallbackText: '前头几名秀女刚退下，殿中忽然安静得只剩衣料摩擦声。皇后端坐上首，神色平稳得看不出喜怒，贵妃却懒懒抬眼，把每个上前的人都像物件似的估量一遍。轮到你时，你知道这不只是一次露脸，而是别人开始决定该把你归进哪一类人的时候。',
      textVariants: [
        {
          id: 'selection_after_showy_entry',
          priority: 100,
          if: ['flag:madeShowyDebut=true'],
          text: '你一出列，几道目光便先落在你衣饰和眉眼上。贵妃唇边像是带了点若有若无的笑，皇后却只是静静看着，像在等你自己把破绽送上来。'
        },
        {
          id: 'selection_after_observation',
          priority: 90,
          if: ['flag:observedRivals=true'],
          text: '你抬眼前先扫过殿中座次。皇后手边那盏茶还未动，说明她今日更重规矩；贵妃靠得略懒，眼底却不耐，显然更喜欢看人出丑。你心里顿时有了底。'
        }
      ],
      choices: [
        {
          id: 'show_talent',
          text: '展现才艺，搏一次印象分',
          hint: '提升宠爱',
          effects: {
            stats: { favor: 10, beauty: 2 },
            relations: { emperor: 1 },
            routeTags: { ambitious: 1 }
          },
          outcomes: [{ weight: 80, to: 'first_night_quarters', textAfterChoice: '一首诗才落下，殿里已有人重新打量你。你抢到了注意，也把自己放到了更亮的地方。' }, { weight: 20, to: 'first_night_quarters', textAfterChoice: '皇帝多看了你一眼，贵妃却把茶盏轻轻放回案上。你知道，这份印象不会只有好处。'}]
        },
        {
          id: 'be_humble',
          text: '谦卑守礼，不抢风头',
          hint: '更稳',
          effects: {
            stats: { wisdom: 4, suspicion: -2 },
            relations: { empress: 1 },
            routeTags: { cautious: 1, loyalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'first_night_quarters', textAfterChoice: '你把每一句话都收在礼数之内，没有抢到满殿目光，却也没留下可以被人轻易拿捏的错处。' }]
        },
        {
          id: 'feign_mistake',
          text: '故作失误，引人怜惜',
          hint: '可能翻车',
          effects: {
            stats: { favor: 5, suspicion: 6 },
            routeTags: { ambitious: 1 }
          },
          outcomes: [
            { weight: 55, to: 'first_night_quarters', textAfterChoice: '你那点拿捏得不算完美的慌乱，倒真换来一眼轻飘飘的怜惜。只是宫里最不缺的，就是别人替你记下这一眼。' },
            { weight: 45, to: 'punished_in_hall', textAfterChoice: '你原想拿捏分寸，殿上气氛却先一步冷了下来。皇后抬手时，你就知道这次赌得太过。' }
          ]
        }
      ],
      tags: ['court', 'core-choice']
    },
    punished_in_hall: {
      id: 'punished_in_hall',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_1',
      order: 3,
      title: '殿前受罚',
      fallbackText: '你的膝盖重重落地，冰冷砖面一下子把痛意直送到骨头里。四周没有人敢真的笑出声，可那种压着的轻慢比笑还刺耳。你低着头，却能感觉到贵妃正慢慢看着你，像在记一个名字。',
      onEnterEffects: {
        stats: { health: -12, suspicion: 6 },
        relations: { empress: -1, nobleConsort: -1 },
        flagsOn: ['offendedConsort']
      },
      choices: [
        {
          id: 'endure_silently',
          text: '咬牙忍下，一言不发',
          hint: '积蓄后手',
          effects: {
            stats: { wisdom: 4 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'first_night_quarters', textAfterChoice: '你把所有难堪都咽了回去，连抬头都没有。忍下这一回不算赢，但至少没有再把把柄送出去。' }]
        },
        {
          id: 'weep_for_mercy',
          text: '含泪求饶，先渡眼前难关',
          hint: '损失体面',
          effects: {
            stats: { favor: -4, beauty: -2 },
            routeTags: { survivalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'first_night_quarters', textAfterChoice: '你眼里立刻蓄了泪，姿态放得极低。眼前这一关算是过去了，可从今往后，旁人也会拿这份软弱重新衡量你。' }]
        }
      ],
      tags: ['cost', 'risk-feedback']
    },
    first_night_quarters: {
      id: 'first_night_quarters',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 4,
      title: '初入永巷',
      fallbackText: '分到你的偏殿在永巷最里头，夜风一吹，窗纸便轻轻发响。白日里殿选的余波还没散，路过的宫女太监却已经知道该用什么眼神看你。你第一次真正意识到，宫里最要命的从来不是一件事，而是一件事之后，消息会怎么长出脚来。',
      textVariants: [
        {
          id: 'quarters_after_punishment',
          priority: 100,
          if: ['history:pickedChoices=endure_silently'],
          text: '膝上的疼还没退去，偏殿的夜色却比白日更冷。你跪得够久，也终于明白在这地方，失手一次，别人就会等着你再失手第二次。'
        },
        {
          id: 'quarters_after_showing_talent',
          priority: 90,
          if: ['history:pickedChoices=show_talent'],
          text: '你回到偏殿时，路上已有两个小宫女悄悄回头打量你。你今日抢到的那点注意，显然已经先一步替你走遍了半个后宫。'
        }
      ],
      choices: [
        {
          id: 'bribe_eunuch',
          text: '收买送膳太监，先铺消息路',
          hint: '建立信息优势',
          effects: {
            relations: { eunuchChief: 1 },
            flagsOn: ['bribedEunuch'],
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'bribe_eunuch_event', textAfterChoice: '银子递出去的瞬间，你就知道这不是在买一句话，而是在给自己埋一条以后也许能救命的线。' }]
        },
        {
          id: 'rest_and_wait',
          text: '安分休息，养足精神',
          hint: '降低风险',
          effects: {
            stats: { health: 8, suspicion: -3 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'morning_greeting', textAfterChoice: '你把灯吹得很早，强迫自己先养住精神。宫里总有人靠锋芒活着，你却更想先把明天平平安安走过去。' }]
        },
        {
          id: 'walk_in_garden',
          text: '借夜色去花园碰碰运气',
          hint: '有机会也有风险',
          effects: {
            stats: { beauty: 4, favor: 3, suspicion: 5 },
            flagsOn: ['hadGardenEncounter'],
            routeTags: { ambitious: 1 }
          },
          outcomes: [
            { weight: 65, to: 'garden_encounter', textAfterChoice: '你借着夜色往花园深处走，心里清楚自己不是去散心，而是在赌一次也许会改变局势的偶遇。' },
            { weight: 35, to: 'caught_by_consort', textAfterChoice: '你刚踏出花径，珠钗细响便从假山后传来。还没见到人，你先感觉到事情已经朝不妙的方向歪过去了。' }
          ]
        }
      ],
      tags: ['quarter', 'core-choice']
    },
    bribe_eunuch_event: {
      id: 'bribe_eunuch_event',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_2',
      order: 5,
      title: '收买太监',
      fallbackText: '银锞子压进袖口的那一刻，你们都没有多看对方一眼。那太监收手极快，像什么都没发生过，只在转身前极轻地说了一句“明日请安，别站得太前”。你忽然意识到，宫里真正值钱的，也许从来不是面子，而是谁肯先告诉你风往哪边吹。',
      onEnterEffects: {
        stats: { wisdom: 2 },
        relations: { eunuchChief: 1 }
      },
      choices: [
        {
          id: 'accept_info_channel',
          text: '记下这条线，明日再看它值不值得',
          hint: '进入请安节点',
          effects: {},
          outcomes: [{ weight: 100, to: 'morning_greeting', textAfterChoice: '你把那句提醒记进心里，没有追问，也没有回头。真正有用的消息，往往只会给一半。' }]
        }
      ],
      tags: ['info', 'ally-seed']
    },
    garden_encounter: {
      id: 'garden_encounter',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_2',
      order: 6,
      title: '夜游花园',
      fallbackText: '御花园里风声细碎，花枝被夜露压得微垂。你原本只想碰碰运气，没想到前方那道明黄身影真的停了下来。皇帝独自立在廊下，像是刚从什么烦心事里抽身。你知道，此刻无论进还是退，都会被记住。',
      choices: [
        {
          id: 'answer_calmly',
          text: '从容应对，不卑不亢',
          hint: '最佳收益',
          effects: {
            stats: { favor: 12, wisdom: 4 },
            relations: { emperor: 2 },
            routeTags: { ambitious: 1 }
          },
          outcomes: [{ weight: 100, to: 'morning_greeting', textAfterChoice: '你把分寸拿捏得极稳，没有故作姿态，也没有露怯。皇帝看你的时间短短几息，却足够让这场偶遇生出后劲。' }]
        },
        {
          id: 'perform_delicately',
          text: '刻意示弱，博他怜惜',
          hint: '看运气',
          effects: {
            stats: { favor: 8, beauty: 3, suspicion: 4 },
            routeTags: { ambitious: 1 }
          },
          outcomes: [
            { weight: 60, to: 'morning_greeting', textAfterChoice: '你刻意把那点脆弱露得恰到好处，至少表面上，皇帝确实因此多停了一眼。' },
            { weight: 40, to: 'caught_by_consort', textAfterChoice: '你还未来得及收住姿态，身后已有冷笑轻轻响起。显然看见这一幕的，不止一个人。' }
          ]
        },
        {
          id: 'leave_after_greeting',
          text: '行礼后告退，不多停留',
          hint: '欲擒故纵',
          effects: {
            stats: { wisdom: 5, favor: 6 },
            relations: { emperor: 1 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'morning_greeting', textAfterChoice: '你行礼后退得干脆，反倒把那点余味留给了对方。只是宫里的余味，往往比正面相逢更容易发酵。' }]
        }
      ],
      tags: ['favor', 'risk']
    },
    morning_greeting: {
      id: 'morning_greeting',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_3',
      order: 7,
      title: '晨昏定省',
      fallbackText: '清晨请安时，殿中香烟缭绕，众妃分列两侧，谁都没有先开口。越是这种安静，越说明有人已经备好了话在等你。你知道，今日最危险的未必是别人当场为难你，而是你自己没看清哪一句话后面真正站着谁。',
      textVariants: [
        {
          id: 'greeting_after_garden',
          priority: 100,
          if: ['flag:hadGardenEncounter=true'],
          text: '你刚入殿，就察觉几道若有若无的目光从自己袖角与发间扫过。昨夜那场偶遇显然没有真正留在夜里，而是比你更早到了众人耳边。'
        },
        {
          id: 'greeting_with_warning',
          priority: 90,
          if: ['flag:bribedEunuch=true'],
          text: '入殿前那句提醒还压在你心里，所以当贵妃抬手拨茶盏、像是随口要点人时，你已先一步把神情收得滴水不漏。'
        }
      ],
      choices: [
        {
          id: 'stay_silent',
          text: '低头不语，先看局势',
          hint: '稳妥',
          effects: {
            stats: { wisdom: 3, suspicion: -2 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'rumor_spreads', textAfterChoice: '你把自己放得极低，像是不准备接任何一句话。可宫里从不因为你沉默，就真的放过你。' }]
        },
        {
          id: 'test_the_room',
          text: '顺着话头试探众人态度',
          hint: '需要判断力',
          showIf: ['flag:observedRivals=true'],
          effects: {
            stats: { wisdom: 4 },
            relations: { empress: 1 },
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 65, to: 'rumor_spreads', textAfterChoice: '你顺着话头轻轻试了一下，果然看见几个人神色同时有了变化。至少你知道谁在演，谁在急。' }, { weight: 35, to: 'maid_whisper', textAfterChoice: '你试探得不算重，却让角落里一名小宫女在退下时悄悄看了你一眼，像是有话要说。' }]
        },
        {
          id: 'answer_back_softly',
          text: '温声回应，不退不让',
          hint: '容易树敌',
          effects: {
            stats: { favor: 4, suspicion: 5 },
            relations: { nobleConsort: -1, emperor: 1 },
            flagsOn: ['offendedConsort'],
            routeTags: { ambitious: 1 }
          },
          outcomes: [{ weight: 100, to: 'rumor_spreads', textAfterChoice: '你回得温和，却没有退。这一下没让自己显得失礼，却足够让贵妃把你的名字记得更牢。' }]
        }
      ],
      tags: ['echo-hub', 'core-choice']
    },
    caught_by_consort: {
      id: 'caught_by_consort',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_3',
      order: 8,
      title: '被贵妃撞见',
      fallbackText: '珠履停在你身后，来人并没有立刻开口。就是这一瞬间的停顿，比责问更让人难熬。等你回身时，贵妃正立在月下看着你，像已经替你想好了一个不太体面的解释。',
      onEnterEffects: {
        stats: { suspicion: 8 },
        relations: { nobleConsort: -2 },
        flagsOn: ['offendedConsort']
      },
      choices: [
        {
          id: 'retreat_quickly',
          text: '立刻行礼退下',
          hint: '止损',
          effects: {
            routeTags: { survivalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'morning_greeting', textAfterChoice: '你退得极快，把姿态放到最低。眼前这回算是勉强止住了，可对方显然不会就这样忘了你。' }]
        },
        {
          id: 'pretend_to_explain',
          text: '强作镇定，解释来意',
          hint: '可能更糟',
          effects: {
            stats: { favor: -3, suspicion: 4 },
            routeTags: { ambitious: 1 }
          },
          outcomes: [{ weight: 100, to: 'morning_greeting', textAfterChoice: '你把解释说得像模像样，可连自己都知道太像解释的解释，往往只会显得更可疑。' }]
        }
      ],
      tags: ['risk', 'consort']
    },
    rumor_spreads: {
      id: 'rumor_spreads',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_3',
      order: 9,
      title: '流言四起',
      fallbackText: '不过一顿茶的功夫，殿里殿外都在谈论你。有人说你擅于拿捏圣意，有人说你心思不安分，甚至连你昨日穿什么颜色的衣裳都被编出了另一层意思。最麻烦的是，这些话真假参半，正好够让人防你，却又抓不住谁先开的口。',
      textVariants: [
        {
          id: 'rumor_after_showy_debut',
          priority: 100,
          if: ['flag:madeShowyDebut=true'],
          text: '你入宫时那身打扮，此刻成了最方便被人反复提起的话柄。别人未必要真信你有多招摇，但一定愿意先拿这个试探风向。'
        },
        {
          id: 'rumor_after_offending_consort',
          priority: 90,
          if: ['flag:offendedConsort=true'],
          text: '流言像是长了腿一样从贵妃宫里一路传出来，你几乎不用细查，也知道是谁在借题发挥。可知道归知道，眼下更难的是怎么接这一招。'
        }
      ],
      choices: [
        {
          id: 'endure_and_watch',
          text: '暂且忍耐，观察谁最着急',
          hint: '稳',
          effects: {
            stats: { wisdom: 4 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'poisoned_meal', textAfterChoice: '你没有急着替自己辩白，只先记住谁在说、谁在听、谁又听完立刻走了。很多祸事，往往就在这种沉默里准备妥当。' }]
        },
        {
          id: 'quietly_prepare',
          text: '暗中做准备，防下一手',
          hint: '情报线更强',
          showIf: ['flag:bribedEunuch=true'],
          effects: {
            stats: { wisdom: 3, suspicion: -1 },
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'maid_whisper', textAfterChoice: '你没有正面压流言，而是先把能动用的小线都重新拢了一遍。很快，就有人比你更着急地来找你了。' }]
        },
        {
          id: 'confront_the_rumor',
          text: '试着当面压下流言',
          hint: '风险高',
          effects: {
            stats: { suspicion: 6 },
            relations: { empress: -1 },
            routeTags: { ambitious: 1 }
          },
          outcomes: [{ weight: 100, to: 'poisoned_meal', textAfterChoice: '你试着把话压回去，表面上是争回一点气势，实际上却也让更多人意识到你已经急了。' }]
        }
      ],
      tags: ['echo-hub', 'pressure']
    },
    maid_whisper: {
      id: 'maid_whisper',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_3',
      order: 9.5,
      title: '偏殿密语',
      fallbackText: '你回到偏殿不久，门外便有人极轻地叩了两下。来的是个不起眼的小宫女，低着头，只说今日午膳最好别碰那盏甜汤。她显然怕得厉害，却还是来了。你知道，这种送上门来的提醒，要么值命，要么要命。',
      choices: [
        {
          id: 'trust_the_warning',
          text: '先记下警告，装作什么都不知道',
          hint: '更稳的情报线',
          effects: {
            stats: { wisdom: 4, suspicion: -1 },
            routeTags: { cautious: 1, manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'poisoned_meal', textAfterChoice: '你没有多问，只把那句话默默记在了心里。等午膳真的送来时，你已经提前盯住了最该注意的那一碗。' }]
        },
        {
          id: 'feed_false_signal',
          text: '反过来放个假消息，看谁会先动',
          hint: '更险，但更容易摸到线头',
          effects: {
            stats: { suspicion: 2, wisdom: 3 },
            flagsOn: ['foundPoisonClue'],
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'poisoned_meal', textAfterChoice: '你顺势布了个局，表面上像毫无防备，心里却已经开始等谁会先露出破绽。' }]
        }
      ],
      tags: ['info', 'branch']
    },
    poisoned_meal: {
      id: 'poisoned_meal',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_4',
      order: 10,
      title: '午膳中毒',
      fallbackText: '午膳刚用到一半，你腹中便猛地一绞，连指尖都跟着发凉。屋里伺候的人表面上都在慌，可有人慌得太快，也有人安静得太巧。你几乎立刻明白，这不是意外。真正要命的不是毒本身，而是你若当场失了分寸，幕后的人便算赢了一半。',
      onEnterEffects: {
        stats: { health: -10 }
      },
      choices: [
        {
          id: 'call_physician',
          text: '立刻叫太医，先保命',
          hint: '稳妥',
          effects: {
            stats: { suspicion: -2 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'investigate_clue', textAfterChoice: '你先稳住命，连声音都刻意放轻。活下来是第一步，至于是谁想让你活不下来，后面总能查。' }]
        },
        {
          id: 'pretend_worse',
          text: '将计就计，装得更严重些',
          hint: '引蛇出洞',
          effects: {
            stats: { wisdom: 5, health: -4 },
            flagsOn: ['foundPoisonClue'],
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'investigate_clue', textAfterChoice: '你把痛意又往上演了三分，连送膳宫女都跟着慌了神。若对方真在盯着你，这一回总该有人先乱。' }]
        },
        {
          id: 'make_public_scene',
          text: '当场闹大，逼人出手',
          hint: '高风险',
          effects: {
            stats: { suspicion: 8, health: -6 },
            relations: { empress: -1 },
            routeTags: { ambitious: 1 }
          },
          outcomes: [{ weight: 100, to: 'forced_public_investigation', textAfterChoice: '你直接把局势掀到了明面上。这样确实痛快，却也等于告诉所有人，你已经不准备给彼此留退路。' }]
        }
      ],
      tags: ['crisis', 'core-choice']
    },
    investigate_clue: {
      id: 'investigate_clue',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_4',
      order: 11,
      title: '查毒线索',
      fallbackText: '太医、膳食、送膳宫女、偏殿往来的人，全都像一团纠在一起的线。你手里只抓住了最细的一根，却也知道宫里的案子从来不是“查到了”就算赢，真正难的是查到之后，先把线头交给谁。',
      textVariants: [
        {
          id: 'investigate_with_clue',
          priority: 100,
          if: ['flag:foundPoisonClue=true'],
          text: '你故意拖慢呼吸时，果然看见送膳宫女袖中露出半截熟悉的香囊穗子。那不是决定性证据，却已经足够让你知道该从谁身上撕开口子。'
        }
      ],
      choices: [
        {
          id: 'follow_the_maid',
          text: '悄悄追查那名宫女',
          hint: '可能拿到证词',
          effects: {
            stats: { wisdom: 4 },
            flagsOn: ['foundPoisonClue'],
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'protect_maid', textAfterChoice: '你没急着惊动旁人，而是先把人悄悄盯住。若她真是最先崩开的那一个，后面也许还能从她嘴里撬出更多东西。' }]
        },
        {
          id: 'hide_the_clue',
          text: '先把线索压下，留作后手',
          hint: '权谋线',
          effects: {
            flagsOn: ['hasConsortLeverage', 'foundPoisonClue'],
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'blackmail_consort', textAfterChoice: '你把线索按进袖里，没有立刻声张。宫里真正值钱的，往往不是公道，而是别人不知道你手里握着什么。' }]
        },
        {
          id: 'ask_eunuch_to_trace',
          text: '让消息线去查膳房是谁换过手',
          hint: '需要之前铺过路',
          showIf: ['flag:bribedEunuch=true'],
          effects: {
            stats: { wisdom: 3 },
            relations: { eunuchChief: 1 },
            routeTags: { manipulative: 1 }
          },
          outcomes: [
            { weight: 55, to: 'protect_maid', textAfterChoice: '你把线递给了更擅长在暗处走动的人。没过多久，最先被逼得露出慌色的，果然不是主子，而是那名宫女。' },
            { weight: 45, to: 'blackmail_consort', textAfterChoice: '你的人顺着膳房摸上去，最后停在一个谁都不敢轻易喊破的名字前。你忽然明白，这件事已经足够拿去换一笔更大的交易。' }
          ]
        }
      ],
      tags: ['clue', 'core-choice']
    },
    forced_public_investigation: {
      id: 'forced_public_investigation',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_4',
      order: 12,
      title: '强闹查案',
      fallbackText: '你把局势闹到了台面上，偏殿外很快围了人。事情确实被迫见了光，可你也成了所有人眼里那个“不肯安分”的源头。到了这一步，已经不是查不查得出的问题，而是谁更怕事情继续往下翻。',
      onEnterEffects: {
        stats: { suspicion: 8 },
        relations: { empress: -1 }
      },
      choices: [
        {
          id: 'salvage_with_bargain',
          text: '趁乱保住线索，转入暗中交易',
          hint: '权谋线',
          effects: {
            flagsOn: ['hasConsortLeverage', 'foundPoisonClue'],
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'blackmail_consort', textAfterChoice: '你借着这阵乱把最关键的一点证据先摁进了自己手里。既然已经惊动了所有人，不如干脆把这份麻烦卖个更高的价。' }]
        }
      ],
      tags: ['cost', 'public']
    },
    protect_maid: {
      id: 'protect_maid',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_4',
      order: 13,
      title: '保下宫女',
      fallbackText: '那宫女被带到你面前时，脸色已经白得像纸。她显然知道自己只要被交出去，多半活不过今晚，可她看向你的那一眼里，除了害怕，还有一点孤注一掷的求生。你也很清楚，保下她不是发善心，而是在决定自己要不要赌一个会记住这份人情的活口。',
      choices: [
        {
          id: 'hide_maid_and_help',
          text: '先把她藏起来，日后再用她的证词',
          hint: '稳住盟友',
          effects: {
            relations: { maidAlly: 2 },
            flagsOn: ['protectedMaid', 'foundPoisonClue'],
            routeTags: { cautious: 1, survivalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'emperor_falls_ill', textAfterChoice: '你先把人藏了起来，也把这条活线牢牢握在了自己手里。若她以后肯开口，这件事就不再只是你的猜测。' }]
        },
        {
          id: 'send_maid_to_empress',
          text: '把宫女秘密送到皇后处',
          hint: '换取正统庇护',
          effects: {
            relations: { empress: 2, maidAlly: 1 },
            flagsOn: ['protectedMaid', 'foundPoisonClue'],
            routeTags: { loyalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'emperor_falls_ill', textAfterChoice: '你把人悄悄送去了皇后那边，等于先把自己的一部分筹码押在了正统与规矩上。以后要回头，就没那么容易了。' }]
        }
      ],
      tags: ['ally', 'echo-seed']
    },
    blackmail_consort: {
      id: 'blackmail_consort',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_4',
      order: 14,
      title: '要挟贵妃',
      fallbackText: '你把证据轻轻推过去时，贵妃终于第一次正眼看你。那目光里没有慌，只有重新估量。你忽然明白，自己现在做的不是揭发，而是在和一个更熟悉宫中规则的人谈价。谈得好，你能借势；谈不好，你就会变成最先被掐灭的知情人。',
      choices: [
        {
          id: 'take_secret_deal',
          text: '接受交易，先换取现实好处',
          hint: '短利高，后患大',
          effects: {
            stats: { favor: 6, suspicion: 6 },
            relations: { nobleConsort: 1, princeFaction: 1 },
            flagsOn: ['hasConsortLeverage', 'foundPoisonClue'],
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'emperor_falls_ill', textAfterChoice: '你没有再逼得太紧，只把条件留在了桌面上。短利到手了，可你也知道，从这一刻起，对方不会再把你当成可以忽略的人。' }]
        },
        {
          id: 'hold_leverage_back',
          text: '不当场摊牌，把把柄捏在手里',
          hint: '更稳的权谋',
          effects: {
            stats: { wisdom: 4 },
            flagsOn: ['hasConsortLeverage', 'foundPoisonClue'],
            routeTags: { manipulative: 1, cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'emperor_falls_ill', textAfterChoice: '你没有急着把牌全翻开，而是把最致命的那一张留在了自己手里。这样的筹码不一定能换来朋友，却至少能换来一阵安静。' }]
        },
        {
          id: 'feed_copy_to_empress',
          text: '暗中把副本递给皇后',
          hint: '转向皇后线',
          effects: {
            relations: { empress: 2, nobleConsort: -2 },
            flagsOn: ['foundPoisonClue'],
            routeTags: { loyalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'emperor_falls_ill', textAfterChoice: '你暗中把副本递给了皇后。局势看似更稳了，可你也知道，这一步等于替自己选了一边站。' }]
        }
      ],
      tags: ['scheme', 'high-risk']
    },
    emperor_falls_ill: {
      id: 'emperor_falls_ill',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_5',
      order: 15,
      title: '皇帝病重',
      fallbackText: '药香一夜未散，整座后宫都像被什么东西轻轻绷住。皇帝病势忽重，所有人表面上都在守规矩，私下里却已经开始替自己找下一条路。你手里攒下的那些关系、把柄和人情，到了这时候终于不再是零碎的“准备”，而是逼着你表态的筹码。问题只剩一个，你要把命押在哪种未来上。',
      textVariants: [
        {
          id: 'late_game_with_maid_support',
          priority: 100,
          if: ['flag:protectedMaid=true'],
          text: '你收到一封揉得发皱的口信。那个被你保下来的宫女已经替你盯住了几条关键消息，至少说明你先前那步险棋，没有白走。'
        },
        {
          id: 'late_game_with_leverage',
          priority: 90,
          if: ['flag:hasConsortLeverage=true'],
          text: '贵妃的人这两日格外安静，安静得像是每一步都在等你先动。你越知道她手里还有什么，就越明白自己此刻不能走错。'
        },
        {
          id: 'late_game_after_garden',
          priority: 80,
          if: ['flag:hadGardenEncounter=true'],
          text: '皇帝病榻前的灯火让你想起那个花园夜晚。如今人人都要用那点旧印象重新估量你，连你自己也不能假装它从未发生过。'
        }
      ],
      choices: [
        {
          id: 'choose_empress_side',
          text: '站在皇后一边，借正统求生',
          hint: '秩序路线',
          effects: {
            relations: { empress: 1 },
            flagsOn: ['choseFactionEmpress'],
            routeTags: { loyalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'final_side_empress', textAfterChoice: '你最终还是把筹码往皇后那边推了过去。这条路未必最风光，却至少有一套还能讲得通的秩序。' }]
        },
        {
          id: 'choose_prince_side',
          text: '押注皇子，赌一把新局',
          hint: '高风险高收益',
          effects: {
            relations: { princeFaction: 1 },
            flagsOn: ['choseFactionPrince'],
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'final_side_prince', textAfterChoice: '你没有选眼前最稳的那一边，而是押注一场尚未坐实的新局。这样的路一旦赌对，能拿到的东西远比“安全”更多。' }]
        },
        {
          id: 'choose_escape_route',
          text: '谁都不站，开始为出宫铺路',
          hint: '独立价值路线',
          effects: {
            flagsOn: ['preparedEscapeRoute'],
            routeTags: { survivalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'final_escape', textAfterChoice: '你看着殿中那些还在争的人，忽然明白自己真正想要的也许不是赢，而是离开这盘迟早要吃人的局。' }]
        }
      ],
      tags: ['echo-hub', 'late-game']
    },
    final_side_empress: {
      id: 'final_side_empress',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_5',
      order: 16,
      title: '站在皇后一边',
      fallbackText: '皇后这条线看上去最讲规矩，也最像一条能活下来的路。可你很清楚，所谓正统从来不只保护人，也会先要求你证明自己值得被保护。到了这一步，你不是简单地“靠过去”，而是在决定要用什么姿态把自己放进这套秩序里。',
      choices: [
        {
          id: 'offer_evidence_to_empress',
          text: '把手上证据尽数呈给皇后',
          hint: '换庇护，也换信任',
          showIf: ['flag:foundPoisonClue=true'],
          effects: {
            relations: { empress: 2 },
            stats: { suspicion: -4 },
            routeTags: { loyalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_empress_route', textAfterChoice: '你把能拿得出手的筹码都摆了出来。皇后看你的目光第一次不再只是审视，而像是在衡量你够不够资格被留下。' }]
        },
        {
          id: 'serve_quietly',
          text: '不抢功劳，只求稳稳站住',
          hint: '偏生存',
          effects: {
            relations: { empress: 1 },
            stats: { suspicion: -3 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_empress_route', textAfterChoice: '你没有急着求位置，只先把自己放在最不容易出错的地方。这条路慢，却往往能比别人多活一段。' }]
        },
        {
          id: 'ask_for_future_title',
          text: '主动请功，替自己争一个位置',
          hint: '更容易上位，也更招眼',
          effects: {
            stats: { favor: 6, suspicion: 5 },
            routeTags: { ambitious: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_empress_route', textAfterChoice: '你主动替自己争那一步，等于也把自己推到更显眼的地方。能不能真拿到，接下来就不只看你想不想了。' }]
        }
      ],
      tags: ['ending-gate', 'empress-route']
    },
    final_side_prince: {
      id: 'final_side_prince',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_5',
      order: 17,
      title: '扶持皇子',
      fallbackText: '押皇子这条路，表面上是赌一个未来，实际上是在赌自己有没有本事比别人更早看懂风向。你若只是跟着站队，很容易变成替人铺路的那一个；只有把人、证词和时机都拢在自己手里，才有可能从棋子翻成执棋的人。',
      choices: [
        {
          id: 'secure_prince_faction',
          text: '替皇子安排行事之人和证据',
          hint: '权谋正解',
          effects: {
            relations: { princeFaction: 2 },
            stats: { suspicion: 4 },
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_prince_route', textAfterChoice: '你开始替这位尚未坐稳的人补上他最缺的那几块拼图。若新局真能起来，你的名字也会被一并写进去。' }]
        },
        {
          id: 'use_maid_testimony_for_prince',
          text: '让宫女出面作证，替皇子铺路',
          hint: '需要之前救下她',
          showIf: ['flag:protectedMaid=true'],
          effects: {
            relations: { princeFaction: 2, maidAlly: 1 },
            stats: { suspicion: 2 },
            routeTags: { manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_prince_route', textAfterChoice: '你把最关键的证词推上了台面，却把自己稍稍藏在后面。这样做不够体面，却往往更像宫里真正能活下来的做法。' }]
        },
        {
          id: 'stand_near_power_but_not_front',
          text: '只做暗线，不亲自站到台前',
          hint: '保守的权谋',
          effects: {
            relations: { princeFaction: 1 },
            stats: { suspicion: -2 },
            routeTags: { cautious: 1, manipulative: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_prince_route', textAfterChoice: '你不准备站到最亮的地方，只想把最有用的线攥在手里。很多时候，真正能左右局势的人，本来就不需要第一个被看见。' }]
        }
      ],
      tags: ['ending-gate', 'prince-route']
    },
    final_escape: {
      id: 'final_escape',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_5',
      order: 18,
      title: '谋划出宫',
      fallbackText: '深夜宫门沉沉，风从高墙上掠过去，像是在提醒你只要一步错了，就再没有回头的机会。你已经看过太多人为了“赢”把自己输掉，所以这一次，你想赌的不是位置，而是一种不用再看别人脸色活下去的可能。逃离不是轻松路，只是另一种更诚实的险路。',
      textVariants: [
        {
          id: 'escape_with_maid',
          priority: 100,
          if: ['flag:protectedMaid=true'],
          text: '你刚收拾停当，门外便传来两短一长的轻叩声，那是只有她才知道的暗号。原来你先前留下的人情，真的等到了回响。'
        },
        {
          id: 'escape_with_eunuch_help',
          priority: 90,
          if: ['flag:bribedEunuch=true'],
          text: '先前那条用银子铺出来的消息路，此刻终于在夜里显出了真正价值。宫门什么时候换班、哪条偏路灯最暗，如今都不再只是猜。'
        }
      ],
      choices: [
        {
          id: 'fake_death_plan',
          text: '借乱局诈死，连名字一起留在宫里',
          hint: '需要铺垫',
          showIf: ['flag:protectedMaid=true'],
          effects: {
            stats: { wisdom: 4 },
            routeTags: { survivalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_escape_route', textAfterChoice: '你决定把自己的旧名字也一并留在这座宫里。若这一招真能成，以后活下来的就不再是“宫里的你”，而是另一个人。' }]
        },
        {
          id: 'bribe_gatekeepers',
          text: '买通守门人，从偏门悄悄出宫',
          hint: '更现实的逃法',
          showIf: ['flag:bribedEunuch=true'],
          effects: {
            stats: { suspicion: 2, health: -2 },
            routeTags: { survivalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_escape_route', textAfterChoice: '你把最后那点能用的钱和情面都砸了出去。走到这一步，已经不是体不体面的事，只看能不能真的出去。' }]
        },
        {
          id: 'slip_out_alone',
          text: '趁夜独自翻墙离开',
          hint: '最险也最自由',
          effects: {
            stats: { health: -16, suspicion: 5 },
            routeTags: { survivalist: 1 }
          },
          outcomes: [{ weight: 100, to: 'resolve_escape_route', textAfterChoice: '你什么都不再等，趁夜独自往高墙和黑影里去。最自由的路往往也最孤，走出去之前，谁都不能替你兜底。' }]
        }
      ],
      tags: ['ending-gate', 'escape-route']
    },
    resolve_empress_route: {
      id: 'resolve_empress_route',
      kind: 'scene',
      mode: SCENE_MODES.ENDING,
      chapter: 'chapter_5',
      order: 19,
      title: '结局',
      fallbackText: '',
      endingCandidates: [
        'mother_of_realm',
        'trusted_consort',
        'favored_noble_consort',
        'gifted_poison',
        'cold_palace_decline',
        'peaceful_survivor',
        'lonely_old_age'
      ],
      tags: ['ending']
    },
    resolve_prince_route: {
      id: 'resolve_prince_route',
      kind: 'scene',
      mode: SCENE_MODES.ENDING,
      chapter: 'chapter_5',
      order: 20,
      title: '结局',
      fallbackText: '',
      endingCandidates: [
        'gifted_poison',
        'behind_the_curtain',
        'shadow_powerbroker',
        'purged_after_scheme',
        'discarded_pawn',
        'peaceful_survivor'
      ],
      tags: ['ending']
    },
    resolve_escape_route: {
      id: 'resolve_escape_route',
      kind: 'scene',
      mode: SCENE_MODES.ENDING,
      chapter: 'chapter_5',
      order: 21,
      title: '结局',
      fallbackText: '',
      endingCandidates: [
        'gifted_poison',
        'fake_death_escape',
        'failed_escape',
        'river_town_retreat'
      ],
      tags: ['ending']
    }
  },
  endings: {
    mother_of_realm: {
      id: 'mother_of_realm',
      title: '母仪天下',
      category: 'rise',
      priority: 90,
      summary: '你在风波最紧的时候站对了位置，也守住了分寸。待一切尘埃落定，凤座终于落到你手里。',
      showIf: [
        'flag:choseFactionEmpress=true',
        'relation:empress>=3',
        'stat:wisdom>=66',
        'stat:suspicion<=45'
      ],
      scoreBonus: 30
    },
    favored_noble_consort: {
      id: 'favored_noble_consort',
      title: '贵妃摄宠',
      category: 'rise',
      priority: 80,
      summary: '你没有站到最高处，却牢牢抓住了皇帝最后的偏爱。后宫记得你的名字，也记得你让人不敢小看的分量。',
      showIf: [
        'stat:favor>=78',
        'relation:emperor>=1',
        'stat:beauty>=58'
      ],
      scoreBonus: 24
    },
    trusted_consort: {
      id: 'trusted_consort',
      title: '内廷得势',
      category: 'rise',
      priority: 72,
      summary: '你没有一步登顶，却在局势平定后稳稳留在了权力边缘。皇后信得过你，宫中也没人敢轻视你。',
      showIf: [
        'flag:choseFactionEmpress=true',
        'relation:empress>=0',
        'stat:favor>=62'
      ],
      scoreBonus: 20
    },
    behind_the_curtain: {
      id: 'behind_the_curtain',
      title: '垂帘听政',
      category: 'power',
      priority: 85,
      summary: '你押中的不是一个皇子，而是一个时代的缝隙。新帝年幼，所有人的目光最后都落到了你垂帘后的手上。',
      showIf: [
        'flag:choseFactionPrince=true',
        'relation:princeFaction>=3',
        'route:manipulative>=3',
        'stat:wisdom>=72'
      ],
      scoreBonus: 34
    },
    shadow_powerbroker: {
      id: 'shadow_powerbroker',
      title: '幕后执衡',
      category: 'power',
      priority: 76,
      summary: '你没能真正站到帘后，却让新局里每一方都不得不来同你商量条件。你不在明处，却握着足够分量的筹码。',
      showIf: [
        'flag:choseFactionPrince=true',
        'relation:princeFaction>=2',
        'route:manipulative>=3'
      ],
      scoreBonus: 22
    },
    peaceful_survivor: {
      id: 'peaceful_survivor',
      title: '偏安一隅',
      category: 'survival',
      priority: 60,
      summary: '你没有去争最耀眼的位置，却把自己稳稳留在了局中。风浪过去后，你仍然活着，而且活得还不错。',
      showIf: [
        'stat:health>=45',
        'stat:suspicion<=48',
        'route:cautious>=2'
      ],
      scoreBonus: 16
    },
    lonely_old_age: {
      id: 'lonely_old_age',
      title: '谨慎终老',
      category: 'survival',
      priority: 40,
      summary: '你熬过了这一局，也熬过了许多个看不见结果的夜晚。到最后，没人再难为你，也没多少人真正记得你。',
      showIf: [
        'stat:health>=30',
        'stat:wisdom>=55'
      ],
      scoreBonus: 10
    },
    discarded_pawn: {
      id: 'discarded_pawn',
      title: '被推为弃子',
      category: 'backfire',
      priority: 70,
      summary: '你原以为自己在操盘，直到最后才发现自己只是棋盘上最方便被舍弃的一子。',
      showIf: [
        'flag:choseFactionPrince=true',
        'relation:princeFaction<=1',
        'route:manipulative>=1'
      ],
      scoreBonus: -6
    },
    purged_after_scheme: {
      id: 'purged_after_scheme',
      title: '反遭清算',
      category: 'backfire',
      priority: 75,
      summary: '你拿到过把柄，也以为能借此改命。可当真正的大局收束时，最先被清理的，往往就是知道太多的人。',
      showIf: [
        'flag:hasConsortLeverage=true',
        'stat:suspicion>=62',
        'relation:empress<=0'
      ],
      scoreBonus: -12
    },
    fake_death_escape: {
      id: 'fake_death_escape',
      title: '诈死脱身',
      category: 'escape',
      priority: 78,
      summary: '一场混乱替你抹去了宫中的旧名字。多年之后，偶有人说江南见过一个眉眼熟悉的女子，只是谁也不敢认。',
      showIf: [
        'flag:preparedEscapeRoute=true',
        'flag:protectedMaid=true',
        'route:survivalist>=2',
        'stat:wisdom>=60'
      ],
      scoreBonus: 26
    },
    river_town_retreat: {
      id: 'river_town_retreat',
      title: '归隐江南',
      category: 'escape',
      priority: 55,
      summary: '你终于离开了那座会记住一切的宫城。往后日子未必富贵，却终于是你自己选的。',
      showIf: [
        'flag:preparedEscapeRoute=true',
        'stat:health>=35',
        'stat:suspicion<=62'
      ],
      scoreBonus: 18
    },
    cold_palace_decline: {
      id: 'cold_palace_decline',
      title: '冷宫凋零',
      category: 'fall',
      priority: 50,
      summary: '你没有立刻死去，却被从所有人的视线里慢慢抹掉。那座冷宫像一口深井，把你的后半生都吞了进去。',
      showIf: [
        'relation:empress<=-2',
        'stat:favor<45',
        'stat:health<=45'
      ],
      scoreBonus: -10
    },
    gifted_poison: {
      id: 'gifted_poison',
      title: '被赐毒酒',
      category: 'death',
      priority: 88,
      summary: '你还是走到了那只白玉酒盏前。宫里从不缺失败者，缺的只是有人替她们把名字记住。',
      showIf: [
        'stat:suspicion>=65'
      ],
      scoreBonus: -20
    },
    failed_escape: {
      id: 'failed_escape',
      title: '夜逃坠亡',
      category: 'death',
      priority: 65,
      summary: '你已经看见墙外的夜色了，却没能真正走出去。那一步之差，把整座宫城重新压回了你身上。',
      showIf: [
        'flag:preparedEscapeRoute=true',
        'stat:health<=58'
      ],
      scoreBonus: -14
    }
  }
};

module.exports = {
  palaceBook01
};
