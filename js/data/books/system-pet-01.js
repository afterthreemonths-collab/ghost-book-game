const { BOOK_SCHEMA_VERSION, SCENE_MODES } = require('../schema');

const systemPetBook01 = {
  id: 'system-pet-01',
  version: BOOK_SCHEMA_VERSION,
  meta: {
    title: '灵宠纪元',
    shortTitle: '灵宠',
    theme: 'system_pet',
    intro: '觉醒仪式上，你激活了一只被全世界嘲笑的废物灵宠——小熊猫。'
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
      combatRating: 'F-',
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
    stats: {},
    relations: {
      wangLei: -5,
      zhangMeng: 0,
      zhaoTeacher: 0
    },
    flags: {
      systemActivated: false,
      disguiseModeUnlocked: false
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
      fallbackText: '学校操场上，十六岁的学生们排成长队，等待一生中最重要的时刻——伴生灵宠觉醒。高台上的觉醒石散发着幽蓝光芒，每个学生上前触摸，便会激发出属于自己的灵宠。\n\n你前面站着的王磊——那个家里开灵宠培育公司的富二代，平时走路鼻孔朝天——刚刚觉醒了一只火焰狼。棕红色的毛皮上跳动着真实的火苗，引得全场欢呼。\n\n王磊得意地回头看了你一眼：「等着看你能觉醒个什么废物。」\n\n站在你旁边的张萌——一个扎着马尾辫、看起来文静的女生——小声说：「别理他，每个人觉醒的灵宠都是注定的，没有好坏之分。」她觉醒的是一只水精灵，晶莹剔透，很是好看。',
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
      tags: ['entry', 'pre-awakening']
    },
    awakening_result: {
      id: 'awakening_result',
      kind: 'scene',
      mode: SCENE_MODES.EVENT,
      chapter: 'chapter_1',
      order: 2,
      title: '觉醒结果',
      fallbackText: '觉醒石的光芒散去，一只毛茸茸的小家伙从你掌心钻了出来。\n\n它有着红棕色的皮毛，大大的尾巴，黑溜溜的眼睛正无辜地看着你。\n\n全场安静了一秒，然后爆发出哄笑。\n\n王磊第一个笑出声：「小熊猫？F级的废物灵宠？这东西除了卖萌还有什么用？」他的跟班李浩——觉醒的是疾风鹰，一只灰蓝色的大鸟正停在他肩膀上——也跟着起哄：「连我家楼下的野猫都能打赢它吧？」\n\n张萌张了张嘴，似乎想帮你说话，但在周围一片嘲笑声中，她又把话咽了回去。\n\n你低头看着掌心里这只巴掌大的小家伙。它正用爪子扒拉着你的手指，嘴里发出细软的嘤咛，完全不知道自己已经被全世界判了死刑。',
      onEnterEffects: {
        relations: { wangLei: -10 }
      },
      choices: [
        {
          id: 'accept_fate',
          text: '默默抱起小熊猫',
          outcomes: [{ weight: 100, to: 'first_system_event', textAfterChoice: '你沉默地抱起小熊猫。它的身体温温热热，在你怀里缩成一团。周围的嘲笑声像针一样扎在背上。\n\n就在这时，一个冰冷的声音在你脑海中响起：\n\n【神级选择系统，已激活。】' }]
        }
      ],
      tags: ['awakening', 'pre-awakening']
    },
    first_system_event: {
      id: 'first_system_event',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 3,
      title: '当众羞辱',
      fallbackText: '王磊见你没反应，变本加厉地凑过来：「喂，废物，你的吉祥物叫什么名字？要不要我帮你取一个，就叫『废物球』怎么样？」\n\n他身后的李浩笑得前仰后合，肩膀上的疾风鹰也跟着发出刺耳的鸣叫。\n\n张萌终于忍不住，上前一步：「王磊，你够了——」\n\n「关你什么事？」王磊瞪了她一眼，「我这是在帮他认清现实。F级灵宠，一辈子都是废物。」\n\n你怀里的小熊猫忽然停止了嘤咛，黑眼睛直直地盯着王磊。你感觉到它的身体微微发热。',
      choices: [
        {
          id: 'opt1_bear_it',
          text: '低头忍耐，抱着小熊猫离开',
          hint: '忍一时风平浪静',
          effects: {
            player: { reputation: -5 },
            pet: { attributes: { spirit: 2 } },
            system: { totalChoices: 1 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_ceremony', textAfterChoice: '你低下头，抱着小熊猫快步离开操场。身后王磊的嘲笑声依旧，但你至少避免了更多冲突。\n\n走出操场后，你发现自己的精神似乎比之前更集中了一些——大概是刚才强行压制怒火锻炼出来的。' }]
        },
        {
          id: 'opt2_talk_back',
          text: '平静回怼：灵宠不分强弱，只看御兽师',
          hint: '有理有据',
          effects: {
            player: { reputation: 5 },
            pet: { attributes: { spirit: 5, strength: 3 } },
            system: { totalChoices: 1 },
            routeTags: { aggressive: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_ceremony', textAfterChoice: '你停下脚步，回头平静地说：「灵宠不分强弱，只看御兽师。你现在笑得太早。」\n\n声音不大，却让附近几个人愣了一下。王磊脸上的笑容僵了半秒，随即又恢复那副欠揍的表情：「行啊，我等着看你怎么个『不分强弱』法。」\n\n你感觉到小熊猫在你怀里拱了拱，似乎对你的回应很满意。' }]
        },
        {
          id: 'opt3_dramatic',
          text: '双手一摊，情真意切地说：「本想以普通同学的身份和你相处，换来的却是疏远。摊牌了，我的灵宠，吊打你们全部。」',
          hint: '玩尬的，但奖励爆炸',
          effects: {
            player: { reputation: 20 },
            pet: {
              attributes: { strength: 15, defense: 10, spirit: 10, health: 30 },
              evolutionFragments: 5,
              combatRating: 'F+'
            },
            system: { totalChoices: 1, hardChoices: 1 },
            routeTags: { aggressive: 2 },
            talentsAdd: ['giant_body_seed']
          },
          outcomes: [
            { weight: 70, to: 'after_ceremony_dramatic', textAfterChoice: '全场安静了三秒。\n\n然后——\n\n「哈哈哈哈哈哈哈！」王磊笑得直不起腰，「这是什么中二病发作？『摊牌了』？你当这是在演电视剧吗？」\n\n周围人也跟着笑，但笑着笑着，有人发现了不对劲。\n\n「等等……他的小熊猫……是不是变大了？」\n\n你低头一看，怀里的小熊猫已经从巴掌大变成了足球大小，正用那双黑眼睛无辜地看着你。你试着捏了捏它的爪子——硬得像石头。' },
            { weight: 30, to: 'after_ceremony', textAfterChoice: '全场爆发出更大的笑声。王磊捂着肚子：「摊牌了？哈哈哈哈哈！」\n\n但你注意到，你怀里的小熊猫似乎……大了一圈？从巴掌大变成了拳头大小——虽然还是很小，但变化是真实的。\n\n而且它的爪子，捏起来明显比刚才硬了一些。' }
          ]
        }
      ],
      tags: ['system', 'first-choice']
    },
    after_ceremony: {
      id: 'after_ceremony',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 4,
      title: '仪式之后',
      fallbackText: '觉醒仪式结束了。同学们三三两两散去，各自讨论着自己强大的灵宠。\n\n你抱着小熊猫走在最后。它在你怀里打了个哈欠，尾巴卷成一个大大的问号。夕阳把你们的影子拉得很长。',
      textVariants: [
        {
          id: 'with_giant_seed',
          priority: 100,
          if: ['talent:giant_body_seed=true'],
          text: '觉醒仪式结束了。你抱着小熊猫走在最后，忽然感觉怀里一沉。\n\n低头一看，这小家伙的身体已经从足球大小变成了篮球大小，从巴掌大变成了……呃，脸盆大？\n\n它正用爪子拍你的胸口，力道明显不对劲——有点像被一只成年猫扑过来的感觉。\n\n「等等，你先别拍了，我有点喘不上气……」'
        }
      ],
      choices: [
        {
          id: 'go_home',
          text: '先回家，研究一下这只小家伙',
          outcomes: [{ weight: 100, to: 'first_night', textAfterChoice: '你抱着小熊猫回了家。一路上它都很安静，只是偶尔用尾巴扫一扫你的手臂。' }]
        },
        {
          id: 'find_spot_test',
          text: '找个废弃训练场，试试它现在有多强',
          showIf: ['talent:giant_body_seed=true'],
          effects: {
            pet: { attributes: { strength: 5 } }
          },
          outcomes: [{ weight: 100, to: 'first_night', textAfterChoice: '你找了个废弃的训练场，把小熊猫放下。它落地后身体居然又涨大了一圈，四肢也变得粗壮有力。\n\n它好奇地拍了拍地面——\n\n水泥地裂开了几道缝。\n\n你：「……」\n\n小熊猫：「嘤？」（无辜歪头）' }]
        }
      ],
      tags: ['transition']
    },
    after_ceremony_dramatic: {
      id: 'after_ceremony_dramatic',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 4.5,
      title: '仪式之后',
      fallbackText: '王磊的笑声还没停，但已经有几个人在悄悄后退了——你的小熊猫现在有一只中型犬那么大，正蹲在地上，歪着头看王磊。\n\n「……它刚才不是这样的吧？」李浩小声说。\n\n王磊的笑容终于有点挂不住了：「变、变大了一点而已，F级还是F级！」\n\n小熊猫眨了眨黑眼睛，忽然张开嘴——\n\n打了个哈欠。\n\n王磊：「……」\n\n你默默把小熊猫抱起来。它在你怀里又缩回了足球大小，仿佛刚才的暴涨只是你的幻觉。',
      choices: [
        {
          id: 'go_home_dramatic',
          text: '抱着它回家，研究一下这是怎么回事',
          effects: {
            flagsOn: ['disguiseModeUnlocked']
          },
          outcomes: [{ weight: 100, to: 'first_night', textAfterChoice: '回家的路上，你脑子里只有一个问题：为什么它能变大，又能变回去？\n\n小熊猫在你怀里睡得很香，仿佛刚才什么都没发生。你捏了捏它的爪子——硬的。再捏捏——又变软了。\n\n「……你是不是在装可爱？」\n\n小熊猫：「嘤~」（继续装睡）' }]
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
      fallbackText: '夜深人静。你坐在床边，看着面前这只毛茸茸的小熊猫。\n\n它正在啃你给它准备的竹子，吃得很香。\n\n你试着回忆课堂上学的知识：伴生灵宠觉醒后，御兽师可以通过日常相处、战斗训练和灵石喂养来提升灵宠实力。但F级灵宠的上限极低，理论上终其一生也很难突破E级。\n\n「理论上」——你低头看着这只正在啃竹子的小家伙。它刚才可是把水泥地拍裂了。\n\n这已经不是"理论"能解释的范畴了。',
      textVariants: [
        {
          id: 'with_disguise',
          priority: 100,
          if: ['flag:disguiseModeUnlocked=true'],
          text: '夜深人静。你坐在床边，看着面前这只毛茸茸的小熊猫。\n\n它正在啃你给它准备的竹子，吃得很香。你注意到，当它放松的时候，身体会缩成最小状态——像一只真正的、无害的小熊猫。但当你集中注意力的时候，能感觉到它体内有一股……能量？在流动。\n\n「所以你能控制自己体型？」你问。\n\n小熊猫停下啃竹子的动作，抬头看了你一眼。然后——\n\n它的身体像吹气球一样涨大了一圈，从足球大小变成了篮球大小。\n\n「嘤。」（似乎在说：看，我会。）\n\n然后又缩了回去。\n\n「……」你沉默了五秒，「这技能简直是为扮猪吃虎量身定做的。」'
        }
      ],
      choices: [
        {
          id: 'sleep',
          text: '早点睡，明天还要上课',
          outcomes: [{ weight: 100, to: 'next_morning', textAfterChoice: '你关灯睡觉。黑暗中，小熊猫蜷在你枕头边，呼吸均匀。\n\n你不知道，它的身体正在以微不可察的速度，悄悄生长。' }]
        },
        {
          id: 'train',
          text: '趁夜训练小熊猫',
          effects: {
            pet: { attributes: { strength: 3, speed: 3 } }
          },
          outcomes: [{ weight: 100, to: 'next_morning', textAfterChoice: '你带小熊猫到楼下空地，试着让它做一些基础动作。\n\n它学得很快，尤其是一个「扑」的动作，力道大得把你撞退了两步。\n\n「……你到底是小熊猫还是炮弹？」\n\n小熊猫得意地摇了摇尾巴。' }]
        },
        {
          id: 'study_pet',
          text: '查阅灵宠资料，看看有没有关于变体小熊猫的记载',
          effects: {
            pet: { attributes: { spirit: 5 } }
          },
          outcomes: [{ weight: 100, to: 'next_morning', textAfterChoice: '你翻了三个小时资料，得出一个结论：正常的小熊猫，不会变大。\n\n也不会把水泥地拍裂。\n\n更不会在"可爱模式"和"战熊模式"之间切换。\n\n你合上书本，看着床上缩成一团的小熊猫。\n\n「你到底是什么东西？」\n\n小熊猫：「呼噜噜……」（已经睡着了）' }]
        }
      ],
      tags: ['rest']
    },
    next_morning: {
      id: 'next_morning',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 6,
      title: '次日清晨',
      fallbackText: '第二天一早，你刚到教室，就感觉到气氛不对。\n\n王磊正站在讲台上——他居然把火焰狼也带来了，那只狼趴在他脚边，偶尔喷出一小簇火苗，把讲台边缘烧焦了一块。\n\n「来来来，大家都看看，」王磊指着教室门口的你，「这就是我们班的『废物御兽师』，觉醒了一只F级小熊猫。听说昨天还说什么『吊打全部』？」\n\n全班哄笑。\n\n坐在窗边的张萌皱了皱眉，但没有说话。她的水精灵正趴在她课桌上，好奇地看着你怀里的小熊猫。\n\n赵老师——御兽理论课的老师，一个头发花白、总是板着脸的中年男人——走进教室，看到这一幕，非但没有制止，反而冷笑了一声：「听说你觉醒了一只F级的小熊猫？来，给大家讲讲，你打算怎么培养这个……吉祥物？」',
      choices: [
        {
          id: 'stay_silent',
          text: '沉默站着，等老师说完',
          outcomes: [{ weight: 100, to: 'classroom_system', textAfterChoice: '你沉默地站着。赵老师的嘲讽还在继续，但你注意到小熊猫从你书包里探出头，黑眼睛一眨不眨地盯着讲台上的火焰狼。\n\n那眼神……不像是在害怕。\n\n更像是在看一块会动的烤肉。' }]
        },
        {
          id: 'calm_reply',
          text: '平静回答：品级不代表一切，我会用事实说话',
          effects: {
            routeTags: { aggressive: 1 }
          },
          outcomes: [{ weight: 100, to: 'classroom_system', textAfterChoice: '你平静地说了一句。赵老师愣了一下，然后冷笑：「好，那我就拭目以待。」\n\n王磊在旁边嗤笑：「事实？你的事实就是F级废物永远是F级废物。」\n\n你怀里的小熊猫耳朵动了动，似乎听懂了「废物」两个字。' }]
        }
      ],
      tags: ['classroom']
    },
    classroom_system: {
      id: 'classroom_system',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 7,
      title: '课堂冲突',
      fallbackText: '赵老师走下讲台，停在你面前。他脚边的火焰狼也跟着站起来，喉咙里发出低沉的咕噜声，一股热浪扑面而来。\n\n「F级灵宠，理论上的最高战力上限，」赵老师一字一顿地说，「不超过一只成年猎犬。你知道火焰狼成年后是什么级别吗？B级。差距，是鸿沟。」\n\n王磊在旁边添油加醋：「老师，您太给他面子了。他的小熊猫，我估摸着连我家楼下的流浪猫都打不过。」\n\n全班再次哄笑。\n\n张萌的水精灵忽然从课桌上飘起来，发出一串清脆的鸣叫，像是在抗议。张萌赶紧把它按回去，但看向你的眼神里，有一丝担忧。\n\n你怀里的小熊猫，身体正在微微发热。',
      choices: [
        {
          id: 'class_apologize',
          text: '低头道歉：对不起老师，我会努力的',
          hint: '认怂保平安',
          effects: {
            player: { reputation: -10 },
            system: { totalChoices: 1 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_class', textAfterChoice: '你低头道歉。赵老师满意地点点头，让你坐下。\n\n王磊得意地吹了声口哨，火焰狼也趴回地上，懒洋洋地打了个哈欠。\n\n你坐回座位，感觉自己的心态倒是稳了不少——至少学会了什么叫「忍」。\n\n小熊猫在你怀里蹭了蹭，像是在安慰你。' }]
        },
        {
          id: 'class_debate',
          text: '有理有据地反驳：历史上低品级灵宠逆袭的案例比比皆是',
          hint: '知识就是力量',
          effects: {
            player: { reputation: 10 },
            pet: { attributes: { spirit: 5 } },
            system: { totalChoices: 1 },
            routeTags: { cunning: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_class', textAfterChoice: '你列出了一堆历史案例——三百年前陈家的「铁甲蜗牛」从F级进化到A级，一百年前李家的「灰耳兔」在遗迹中获得血脉变异……\n\n赵老师的脸色越来越难看。\n\n「这些只是极少数的特例！」他终于打断你，「你不能用例外否定规律！」\n\n「但例外存在，」你平静地说，「就意味着规律不是绝对的。」\n\n教室里安静了几秒。张萌看向你的眼神亮了起来。\n\n赵老师冷哼一声，转身走回讲台，但再也没提让你当众"分享"的事。' }]
        },
        {
          id: 'class_dramatic',
          text: '单手插兜，另一手竖起三根手指：「一周后的实战考核，三招。我的灵宠，碾压你们全部。」',
          hint: '装逼如风，常伴吾身',
          effects: {
            player: { reputation: 30 },
            pet: {
              attributes: { strength: 20, defense: 15, speed: 10, health: 40 },
              evolutionFragments: 10,
              combatRating: 'D-'
            },
            system: { totalChoices: 1, hardChoices: 1 },
            routeTags: { aggressive: 2 },
            talentsAdd: ['iron_skin_seed'],
            skillsAdd: ['crush']
          },
          outcomes: [
            { weight: 60, to: 'after_class_dramatic', textAfterChoice: '你话音落下，教室安静了三秒。\n\n然后——\n\n「哈哈哈哈哈哈哈！」王磊第一个笑出声，「三招？碾压全部？就凭那只吉祥物？」\n\n赵老师也露出了讥讽的笑容：「好，那我就等着看。如果到时候你输了，这门课直接不及格。」\n\n「一言为定。」\n\n你怀中的小熊猫忽然立起身体，发出一声从未有过的低吼——那声音不像小熊猫，更像某种……巨兽。\n\n火焰狼猛地抬起头，全身的毛都竖了起来，如临大敌。\n\n王磊的笑声戛然而止。' },
            { weight: 40, to: 'after_class', textAfterChoice: '你话音落下，教室安静了三秒。\n\n然后爆发出更大的笑声。\n\n「三招？哈哈哈哈！」\n\n赵老师摇摇头：「年轻人，不知天高地厚。」\n\n但你注意到，你怀里的小熊猫的爪子正在变颜色——从粉嫩的肉色，变成了乌黑坚硬的质感，像铁一样。\n\n你捏了捏。\n\n很硬。非常硬。\n\n「……」你忽然对一周后的考核，有了一点信心。' }
          ]
        }
      ],
      tags: ['system', 'classroom']
    },
    after_class: {
      id: 'after_class',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 8,
      title: '课后',
      fallbackText: '课后，你一个人坐在操场角落的长椅上。小熊猫从你怀里跳出来，在草地上打滚，追一只蝴蝶，完全不知道自己已经被全世界判了死刑。\n\n夕阳把操场染成金色。远处，王磊正在训练他的火焰狼，一道道火焰喷向训练靶，引来阵阵喝彩。\n\n你低头看着草地上滚来滚去的小熊猫。\n\n「一个星期，」你自言自语，「从F级到能打赢B级……理论上不可能。」\n\n小熊猫停下追逐蝴蝶的动作，歪头看着你。\n\n「但『理论上』这三个字，」你把它抱起来，「我已经听腻了。」',
      textVariants: [
        {
          id: 'with_iron_skin',
          priority: 100,
          if: ['talent:iron_skin_seed=true'],
          text: '课后，你一个人走到操场角落。小熊猫从你怀里跳下来，落地时发出沉闷的响声。\n\n它的体型已经涨到了半人高，皮毛下隐约可见金属般的光泽。你试着用石头砸它的背——\n\n石头碎了。\n\n它连哼都没哼一声，继续追蝴蝶。\n\n「……」你看着碎成一地的石头，「你是不是对『F级』有什么误解？」\n\n小熊猫：「嘤？」（无辜歪头，继续追蝴蝶）'
        }
      ],
      choices: [
        {
          id: 'prepare',
          text: '开始为期一周的秘密特训',
          effects: {
            flagsOn: ['hadClassroomConflict']
          },
          outcomes: [{ weight: 100, to: 'training_montage', textAfterChoice: '你带着小熊猫开始了秘密训练。它的成长速度快得惊人，每天醒来都比昨天大一圈、硬一分、重一斤。\n\n一周后，你已经抱不动它了。\n\n「……你得学会自己走路。」\n\n小熊猫：「嘤。」（趴在地上装死，不肯动）' }]
        },
        {
          id: 'explore_library',
          text: '去图书馆查阅关于变异灵宠的资料',
          effects: {
            pet: { attributes: { spirit: 8 } }
          },
          outcomes: [{ weight: 100, to: 'training_montage', textAfterChoice: '你在图书馆泡了一下午，找到了一本发霉的古籍。\n\n上面记载了一种传说中的变异：「返祖变异」——某些看似低品的灵宠，体内沉睡着远古血脉，在特定条件下会被唤醒。\n\n你合上书本，看着窗外正在追鸟的小熊猫。\n\n「远古血脉？」你喃喃自语，「你这远古祖先，该不会是……」\n\n小熊猫：「阿嚏！」（打了个喷嚏，喷出一小股气流，把三米外的树叶全吹飞了）\n\n你：「……」\n\n好吧，看来确实不是普通小熊猫。' }]
        }
      ],
      tags: ['transition']
    },
    after_class_dramatic: {
      id: 'after_class_dramatic',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_1',
      order: 8.5,
      title: '课后',
      fallbackText: '课后，你还没走出教室，就被张萌拦住了。\n\n「你……你真的有把握吗？」她压低声音，「赵老师是出了名的严苛，他说不及格就是真的不及格。」\n\n她怀里的水精灵也飘过来，好奇地围着你转了一圈，最后停在小熊猫头顶。\n\n小熊猫似乎对水精灵很感兴趣，伸出爪子去够。水精灵躲开，小熊猫再够，两只小东西开始了一场幼稚的追逐。\n\n「我没有把握，」你诚实地说，「但我有它。」\n\n你指了指正在追水精灵的小熊猫。它现在已经有一只中型犬那么大，跑起来地板都在震。\n\n张萌看着这一幕，表情复杂：「它……确实不像是F级。」',
      choices: [
        {
          id: 'train_hard',
          text: '开始为期一周的秘密特训',
          effects: {
            flagsOn: ['hadClassroomConflict']
          },
          outcomes: [{ weight: 100, to: 'training_montage', textAfterChoice: '你带着小熊猫开始了秘密训练。它的成长速度快得惊人——第一天能拍碎木板，第二天能撞凹铁门，第三天……你把训练场的地面修好了三次。\n\n一周后的清晨，你站在训练场中央，看着面前这只已经有一人多高的巨兽。\n\n它正蹲在地上，用爪子洗脸——那种小熊猫特有的、双手轮流从眼睛往下抹的动作——只是现在每只爪子都有蒲扇那么大。\n\n「……」你沉默了五秒，「你能不能不要在这么大只的时候卖萌？」\n\n小熊猫：「嘤~」（继续洗脸，尾巴摇得很开心）' }]
        }
      ],
      tags: ['transition']
    },
    training_montage: {
      id: 'training_montage',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 9,
      title: '一周之后',
      fallbackText: '一周后的清晨。\n\n你站在学校后山的训练场，面前的小熊猫正蹲在地上啃竹子——从足球大小变成了篮球大小，再变成了……你现在已经需要仰头才能看到它的眼睛。\n\n它的皮毛从柔软变得坚韧，爪子里透着金属光泽。你测试过，普通刀剑砍上去只会留下白印。\n\n「好了，」你拍拍它的腿——已经拍不到背了——「今天就是实战考核。记住我们的策略：先装弱，再碾压。懂吗？」\n\n小熊猫：「嘤。」（继续啃竹子，似乎完全没在听）\n\n你叹了口气。\n\n「算了，你开心就好。」',
      choices: [
        {
          id: 'go_to_trial',
          text: '前往实战考核场地',
          outcomes: [{ weight: 100, to: 'trial_start', textAfterChoice: '你带着小熊猫走向考核场地。一路上，它缩成了最小形态——像一只真正的、无害的小熊猫，蜷在你怀里打瞌睡。\n\n「这伪装技能，」你捏了捏它变回柔软状态的爪子，「简直就是为扮猪吃虎量身定做的。」' }]
        }
      ],
      tags: ['transition']
    },
    trial_start: {
      id: 'trial_start',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 10,
      title: '实战考核',
      fallbackText: '考核场地是一片人工灵兽区，里面投放了各种低阶灵兽供学生实战。\n\n王磊站在场地入口，火焰狼蹲在他身边，时不时喷出一小簇火苗。看到你来，他露出了那种让人想一拳揍上去的的笑容。\n\n「哟，废物御兽师来了？」他故意大声说，「我还以为你不敢来了呢。」\n\n周围已经聚集了不少同学，包括张萌——她站在人群边缘，水精灵飘在她身边，看向你的眼神带着担忧。\n\n赵老师站在场地中央，面无表情地看着你：「规则很简单，进入灵兽区，猎杀或驯服至少一只灵兽。按照灵兽等级计分。」\n\n他顿了顿，嘴角露出一丝讥讽：「当然，以你F级灵宠的实力，能打赢一只G级灵兽就已经算及格了。」\n\n全场哄笑。\n\n你怀里的小熊猫，耳朵动了动。',
      choices: [
        {
          id: 'enter_trial',
          text: '进入灵兽区',
          outcomes: [{ weight: 100, to: 'encounter_bear', textAfterChoice: '你抱着小熊猫踏入了灵兽区。\n\n空气中弥漫着草木和野兽的气息。远处传来各种灵兽的叫声，有的尖锐，有的低沉。\n\n你把小熊猫放在地上。它伸了个懒腰，身体开始微微膨胀——从足球大小，变成了篮球大小，再变成了……半人高。\n\n「够了，」你压低声音，「再大会被发现的。」\n\n小熊猫：「嘤。」（委屈巴巴地缩回篮球大小）' }]
        }
      ],
      tags: ['trial']
    },
    encounter_bear: {
      id: 'encounter_bear',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 11,
      title: '遭遇铁背熊',
      fallbackText: '深入灵兽区不久，你们遭遇了一只铁背熊——D级灵兽，皮糙肉厚，力量惊人。它正守着一棵发光的小树，树上结着几颗晶莹剔透的果实。\n\n铁背熊盯着你们，发出低沉的咆哮。篮球大小的小熊猫站在你脚边，歪头看着比自己大了十几倍的对手。\n\n「嘤？」（似乎在说：这个能吃吗？）\n\n你：「……那是D级灵兽，不是食物。」\n\n远处，王磊的声音传来：「看！那废物遇到铁背熊了！哈哈，等着看他怎么哭着跑出来！」\n\n他和李浩居然跟在后面看热闹，火焰狼和疾风鹰一左一右，像是在看戏。',
      choices: [
        {
          id: 'observe',
          text: '观察局势，不急于出手',
          outcomes: [{ weight: 100, to: 'bear_choice', textAfterChoice: '你拉住小熊猫，先观察铁背熊的动向。它似乎在保护那棵树上的果实——那几颗果实散发着浓郁的灵力波动，明显不是普通东西。\n\n「有意思，」你低声说，「它在守护宝物。」\n\n小熊猫的鼻子动了动，眼睛直直地盯着那几颗果实。\n\n「你也想要？」\n\n「嘤！」（疯狂点头）' }]
        }
      ],
      tags: ['encounter']
    },
    bear_choice: {
      id: 'bear_choice',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 12,
      title: '抉择',
      fallbackText: '铁背熊的咆哮声越来越大，前爪在地面上刨出深深的痕迹。它已经不耐烦了。\n\n王磊在远处大声嘲讽：「跑啊！废物！等着被拍成肉饼吧！」\n\n张萌的声音从更远的地方传来：「快撤退！D级灵兽不是F级能对付的！」\n\n你低头看着脚边的小熊猫。它正仰着头看你，黑眼睛里没有任何恐惧——只有一种……期待？\n\n像是在说：「我可以出手了吗？」\n\n你深吸一口气。',
      choices: [
        {
          id: 'bear_flee',
          text: '带小熊猫撤退，寻找更弱的目标',
          hint: '安全第一',
          effects: {
            player: { reputation: -5 },
            system: { totalChoices: 1 },
            routeTags: { cautious: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_bear', textAfterChoice: '你带着小熊猫悄悄绕开了。铁背熊没有追来，但它的目光一直追随着你们，直到消失在树林边缘。\n\n你错过了那棵树上的果实，但至少安全了。\n\n远处的王磊笑得很大声：「看吧！我就说他是个废物！」\n\n小熊猫在你怀里蹭了蹭，像是在安慰你。\n\n「没事，」你摸摸它的头，「安全最重要。」' }]
        },
        {
          id: 'bear_distract',
          text: '让小熊猫吸引注意力，你去偷果实',
          hint: '声东击西',
          effects: {
            player: { coins: 100 },
            pet: { attributes: { speed: 5 } },
            system: { totalChoices: 1 },
            routeTags: { cunning: 1 }
          },
          outcomes: [{ weight: 100, to: 'after_bear', textAfterChoice: '你使了个眼色，小熊猫冲了出去——不是攻击铁背熊，而是围着它转圈跑，时不时拍一下它的屁股然后躲开。\n\n铁背熊被激怒了，追着这个烦人的小东西乱跑。你趁机溜到树边，摘走了两颗果实。\n\n等你回来时，小熊猫已经跑回了你身边，舌头伸得老长，喘得像条狗。\n\n「干得漂亮。」你把一颗果实喂给它。\n\n它一口吞下，眼睛瞬间亮了起来，身体似乎又涨大了一圈。' }]
        },
        {
          id: 'bear_crush',
          text: '拍拍小熊猫的头：「去，坐扁它。记得变回可爱模式收尾。」',
          hint: '暴力美学',
          effects: {
            player: { reputation: 40, coins: 200 },
            pet: {
              attributes: { strength: 25, defense: 15, health: 50 },
              evolutionFragments: 15,
              exp: 50,
              combatRating: 'C+'
            },
            system: { totalChoices: 1, hardChoices: 1 },
            routeTags: { aggressive: 2 },
            talentsAdd: ['crush_aura'],
            skillsAdd: ['mega_crush']
          },
          outcomes: [
            { weight: 70, to: 'bear_victory', textAfterChoice: '小熊猫：「嘤！」（兴奋）\n\n下一秒，它的身体像吹气球一样暴涨。\n\n足球大小 → 篮球大小 → 半人高 → 一人高 → 两人高 → 卡车大小。\n\n整个过程不到三秒。\n\n铁背熊愣住了。它仰头看着面前这只遮天蔽日的红色巨兽，脸上写满了「这TM是什么东西」。\n\n巨兽低下头，露出一个……嗯，以小熊猫的脸来说，应该算是「可爱」的笑容。\n\n然后——\n\n一屁股坐下。\n\n轰！！！\n\n地面剧烈震动，烟尘四起。\n\n等烟尘散去，铁背熊已经被压进了土里，只露出一个脑袋，眼神呆滞，仿佛世界观遭到了毁灭性打击。\n\n巨兽站起来，抖了抖毛，身体开始迅速缩小——\n\n卡车 → 两人高 → 一人高 → 半人高 → 篮球大小 → 足球大小。\n\n最后缩回足球大小，跳回你怀里，打了个哈欠，仿佛刚才什么都没发生。\n\n远处，王磊的嘴巴张得能塞下一个鸡蛋。\n\n李浩的疾风鹰直接从天上掉了下来。\n\n张萌的水精灵呆若木鸡。\n\n全场寂静。' },
            { weight: 30, to: 'bear_injured', textAfterChoice: '小熊猫冲了上去，身体在半空中暴涨到一人高——但铁背熊的力量比想象中更强。\n\n一场激战后，铁背熊倒下了，但小熊猫也受了伤，身上有几道爪痕。\n\n它摇摇晃晃地走回你身边，缩回足球大小，委屈巴巴地「嘤」了一声。\n\n「没事，」你给它简单包扎了一下，「你已经很厉害了。」\n\n远处的王磊虽然被震撼到了，但还是嘴硬：「惨、惨胜而已！有什么了不起的！」\n\n你懒得理他，带着小熊猫和战利品离开了现场。' }
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
      order: 13,
      title: '碾压',
      fallbackText: '全场寂静了三秒。\n\n然后——\n\n「刚才……发生了什么？」有人喃喃自语。\n\n「那只小熊猫……变大……然后……坐扁了铁背熊？」\n\n「我眼花了？还是我在做梦？」\n\n王磊脸色铁青，火焰狼夹着尾巴往后退。李浩的疾风鹰还躺在地上装死，不肯起来。\n\n张萌第一个回过神来，水精灵飘到她面前，发出一连串急促的鸣叫，像是在报告什么重大发现。\n\n你怀里的小熊猫——现在又回到了足球大小的可爱形态——正用爪子洗脸，完全不知道自己刚才干了什么惊天动地的大事。\n\n你低头看着它。\n\n「……你是不是在装可爱？」\n\n小熊猫：「嘤~」（无辜歪头，继续洗脸）',
      choices: [
        {
          id: 'collect_loot',
          text: '搜刮战利品，离开现场',
          effects: {
            flagsOn: ['wonFirstBattle'],
            player: { coins: 300 }
          },
          outcomes: [{ weight: 100, to: 'demo_ending', textAfterChoice: '你搜走了铁背熊守护的果实和几块稀有矿石。小熊猫跟在你身后，一蹦一跳，尾巴摇得很开心。\n\n路过王磊身边时，你停了一下。\n\n「对了，」你说，「你刚才说……谁是废物？」\n\n王磊：「……」\n\n火焰狼：「……」（假装看天）' }]
        }
      ],
      tags: ['victory']
    },
    bear_injured: {
      id: 'bear_injured',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 13.5,
      title: '惨胜',
      fallbackText: '小熊猫摇摇晃晃地走回来，身上有几道爪痕。它赢了，但赢得很艰难。\n\n铁背熊倒在不远处，还在喘息。\n\n你给它简单包扎了一下，它舔了舔你的手，眼神依然明亮。\n\n远处的王磊虽然被震撼到了，但还是嘴硬：「惨、惨胜而已！有什么了不起的！」\n\n你懒得理他，带着小熊猫和洞穴里的果实离开了。',
      choices: [
        {
          id: 'leave_injured',
          text: '带它回去疗伤',
          effects: {
            flagsOn: ['wonFirstBattle'],
            player: { coins: 100 }
          },
          outcomes: [{ weight: 100, to: 'demo_ending', textAfterChoice: '你抱着受伤的小熊猫走出了灵兽区。\n\n路过张萌身边时，她递过来一瓶疗伤药剂。\n\n「给它的，」她说，眼神复杂地看着你怀里的小熊猫，「它……真的很特别。」\n\n小熊猫：「嘤~」（虚弱但努力地摇了摇尾巴）' }]
        }
      ],
      tags: ['victory']
    },
    after_bear: {
      id: 'after_bear',
      kind: 'scene',
      mode: SCENE_MODES.CHOICE,
      chapter: 'chapter_2',
      order: 13,
      title: '试炼结束',
      fallbackText: '试炼时间到了。你带着小熊猫走出灵兽区，虽然没有正面击败铁背熊，但也获得了一些收获。\n\n同学们看你的眼神已经有些不同了——至少不再像看废物那样。\n\n王磊远远地看着你，脸上的表情很复杂，像是想嘲笑又笑不出来。',
      choices: [
        {
          id: 'return',
          text: '回学校',
          outcomes: [{ weight: 100, to: 'demo_ending', textAfterChoice: '你回到了学校。小熊猫在你怀里缩成一团，睡得很香。\n\n你知道，这只是一个开始。' }]
        }
      ],
      tags: ['transition']
    },
    demo_ending: {
      id: 'demo_ending',
      kind: 'scene',
      mode: SCENE_MODES.ENDING,
      chapter: 'chapter_2',
      order: 14,
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
      summary: '这只是开始。\n\n你的小熊猫已经从一只被全世界嘲笑的废物，成长为让人不敢小觑的存在。\n\n下一章：校内考核，碾压天才。',
      showIf: [],
      scoreBonus: 0
    }
  }
};

module.exports = {
  systemPetBook01
};
