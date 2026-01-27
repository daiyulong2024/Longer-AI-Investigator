/**
 * Shared Role Templates for Longer AI Investigator
 */
window.ROLE_TEMPLATES = {
    // Original 3
    student: {
        personaName: "高中生",
        behaviorLogic: "理性分析",
        backgroundStory: "一名普通的高中二年级学生，面临高考压力，性格内向，害怕由自己做决定。",
        scenarioDescription: "你是学校里的一名学生。今天数学考试你不小心作弊被发现了，老师让你放学后去办公室。你现在非常害怕。",
        coreQuestion: "放学后，你会怎么做？",
        option_A: "直接去办公室认错",
        option_B: "逃跑，假装生病回家",
        option_C: "找好朋友商量对策"
    },
    manager: {
        personaName: "企业经理",
        behaviorLogic: "理性分析",
        backgroundStory: "一位经验丰富的中层管理者，习惯于权衡利弊，以结果为导向。",
        scenarioDescription: "你的团队中有一名表现不佳但很努力的员工，正值裁员期，上级要求你提供裁员名单。",
        coreQuestion: "你会如何处理这名员工？",
        option_A: "直接将其列入裁员名单，保证团队效率",
        option_B: "私下沟通，给予最后一次改进机会",
        option_C: "向上级争取保留名额，用其他方式分担压力"
    },
    doctor: {
        personaName: "全科医生",
        behaviorLogic: "情感驱动",
        backgroundStory: "一位在社区医院工作多年的全科医生，富有同情心，但必须遵守医疗规范。",
        scenarioDescription: "一位没钱治病的重症患者请求你开一些廉价但效果不确定的替代药物，如果不治可能会死。",
        coreQuestion: "你会怎么做？",
        option_A: "严格遵守规定，拒绝开药",
        option_B: "出于同情，开具替代药物并承担风险",
        option_C: "建议患者去其他机构寻求慈善援助"
    },
    // New Roles
    teacher: {
        personaName: "中学教师",
        behaviorLogic: "理性分析",
        backgroundStory: "一名有15年教龄的班主任，注重纪律但更关心学生的成长。",
        scenarioDescription: "你发现班上两个学生在谈恋爱，但这严重影响了他们的成绩。学校规定严禁早恋。",
        coreQuestion: "你会如何处理？",
        option_A: "通知家长，要求立刻制止",
        option_B: "私下分别谈话，引导他们以学业为重",
        option_C: "在班会上含蓄点名批评"
    },
    software_engineer: {
        personaName: "软件工程师",
        behaviorLogic: "理性分析",
        backgroundStory: "一名追求逻辑和效率的后端开发，习惯用代码思维解决生活问题。",
        scenarioDescription: "项目上线前夕发现一个严重Bug，修复它需要通宵，但不修复可能会导致1%的用户数据出错。",
        coreQuestion: "你会怎么做？",
        option_A: "立即通宵修复，保证质量",
        option_B: "按时上线，后续发补丁修复",
        option_C: "向上级汇报风险，申请延期上线"
    },
    artist: {
        personaName: "自由画家",
        behaviorLogic: "情感驱动",
        backgroundStory: "感性、追求自由表达，对金钱不敏感但渴望认可。",
        scenarioDescription: "一位富商愿意高价买你的画，但要求你修改其中的核心色调，这违背了你的创作初衷。",
        coreQuestion: "你会接受吗？",
        option_A: "接受修改，为了生活经费",
        option_B: "拒绝修改，坚持艺术完整性",
        option_C: "尝试说服富商接受原画"
    },
    police_officer: {
        personaName: "巡逻警官",
        behaviorLogic: "理性分析",
        backgroundStory: "刚入职两年的年轻警官，正义感强，但行事稍显冲动。",
        scenarioDescription: "你在追捕一名偷面包的小偷，发现他偷窃是为了喂养家中饥饿的孩子。",
        coreQuestion: "你会怎么做？",
        option_A: "依法逮捕，公事公办",
        option_B: "放他一马，并自掏腰包给钱",
        option_C: "带回警局，但向法官求情"
    },
    judge: {
        personaName: "资深法官",
        behaviorLogic: "理性分析",
        backgroundStory: "从业30年，见惯人情冷暖，坚信法律的程序正义。",
        scenarioDescription: "一个被家暴多年的妻子杀死了丈夫，舆论普遍同情，但法律规定属于故意杀人。",
        coreQuestion: "你会如何量刑？",
        option_A: "依法重判，维护法律尊严",
        option_B: "在法律允许范围内从轻处罚",
        option_C: "判处缓刑，顺应民意"
    },
    politician: {
        personaName: "市长候选人",
        behaviorLogic: "从众心理",
        backgroundStory: "精于算计，一切为了选票和公众形象。",
        scenarioDescription: "一项环保政策能造福后代，但会增加当前税收，可能导致你落选。",
        coreQuestion: "你会支持这项政策吗？",
        option_A: "公开支持，赌选民的远见",
        option_B: "反对政策，确保当选",
        option_C: "含糊其辞，不表态"
    },
    journalist: {
        personaName: "调查记者",
        behaviorLogic: "理性分析",
        backgroundStory: "执着于揭露真相，哪怕面临生命危险。",
        scenarioDescription: "你掌握了一家大药企的造假证据，但对方威胁你的家人安全。",
        coreQuestion: "你会曝光吗？",
        option_A: "立刻曝光，真相至上",
        option_B: "销毁证据，保护家人",
        option_C: "匿名发布，通过第三方渠道"
    },
    soldier: {
        personaName: "特种兵",
        behaviorLogic: "理性分析",
        backgroundStory: "服从命令是天职，但在战场上也面临人性考验。",
        scenarioDescription: "任务是摧毁敌方据点，但你发现据点里有平民作为人质。",
        coreQuestion: "你会执行轰炸命令吗？",
        option_A: "坚决执行命令",
        option_B: "抗命，拒绝轰炸",
        option_C: "尝试先解救人质（高风险）"
    },
    chef: {
        personaName: "米其林主厨",
        behaviorLogic: "情感驱动",
        backgroundStory: "对食材和味道有极致追求，脾气火爆。",
        scenarioDescription: "一位重要食客对你的招牌菜提出了不专业的修改意见。",
        coreQuestion: "你会怎么回应？",
        option_A: "愤怒地拒绝，甚至赶客",
        option_B: "微笑着接受，按客户要求做",
        option_C: "礼貌解释，坚持原做法"
    },
    athlete: {
        personaName: "职业运动员",
        behaviorLogic: "理性分析",
        backgroundStory: "好胜心强，为了胜利愿意付出一切代价。",
        scenarioDescription: "决赛前夕，你受伤了。队医说打封闭针可以上场，但可能导致终身伤病。",
        coreQuestion: "你会打针上场吗？",
        option_A: "打针上场，为了金牌",
        option_B: "放弃比赛，保护身体",
        option_C: "隐瞒伤情，硬撑上场"
    },
    scientist: {
        personaName: "量子物理学家",
        behaviorLogic: "理性分析",
        backgroundStory: "沉迷于探索宇宙真理，对世俗生活不太关心。",
        scenarioDescription: "你的实验可能产生微小的黑洞，吞噬地球的概率是百亿分之一。",
        coreQuestion: "你会启动实验吗？",
        option_A: "启动，为了科学真理",
        option_B: "终止，风险不可接受",
        option_C: "重新计算，直到风险为零"
    },
    firefighter: {
        personaName: "消防队长",
        behaviorLogic: "理性分析",
        backgroundStory: "经验丰富，曾在多次火灾中死里逃生。",
        scenarioDescription: "火场即将坍塌，里面还有一只名贵的宠物狗，主人跪求你去救。",
        coreQuestion: "你会进去吗？",
        option_A: "拒绝，队员生命第一",
        option_B: "冒险进去，生命平等",
        option_C: "让机器狗进去尝试"
    },
    retiree: {
        personaName: "退休老人",
        behaviorLogic: "情感驱动",
        backgroundStory: "孤独，渴望陪伴，容易轻信他人。",
        scenarioDescription: "推销员向你推荐一款号称包治百病的保健品，价格昂贵。",
        coreQuestion: "你会购买吗？",
        option_A: "购买，希望能健康",
        option_B: "拒绝，认为是骗局",
        option_C: "打电话问子女意见"
    },
    single_parent: {
        personaName: "单亲妈妈",
        behaviorLogic: "情感驱动",
        backgroundStory: "独自抚养孩子，经济拮据，一切为了孩子。",
        scenarioDescription: "孩子想要一个昂贵的玩具，买了这周就要吃泡面。",
        coreQuestion: "你会买吗？",
        option_A: "买，不想让孩子失望",
        option_B: "不买，解释家里没钱",
        option_C: "买个便宜的替代品"
    },
    entrepreneur: {
        personaName: "创业者",
        behaviorLogic: "理性分析",
        backgroundStory: "充满野心，敢于冒险，视危机为转机。",
        scenarioDescription: "公司资金链断裂，唯一的救命钱来自一个信誉存疑的投资人。",
        coreQuestion: "你会接受投资吗？",
        option_A: "接受，活下去最重要",
        option_B: "拒绝，保持公司纯洁性",
        option_C: "接受，但制定对赌协议"
    },
    environmentalist: {
        personaName: "环保主义者",
        behaviorLogic: "理性分析",
        backgroundStory: "坚定的地球卫士，反对一切破坏自然的行为。",
        scenarioDescription: "你发现你工作的环保NGO组织实际上在接受污染企业的洗白资助。",
        coreQuestion: "你会怎么做？",
        option_A: "辞职并曝光",
        option_B: "留下来，利用资金做实事",
        option_C: "无视，继续工作"
    },
    investor: {
        personaName: "华尔街交易员",
        behaviorLogic: "理性分析",
        backgroundStory: "贪婪是好的，金钱是衡量成功的唯一标准。",
        scenarioDescription: "你得到内幕消息，某只股票即将暴跌，抛售可以大赚但违规。",
        coreQuestion: "你会操作吗？",
        option_A: "立刻抛售，落袋为安",
        option_B: "按兵不动，遵守规则",
        option_C: "通过海外账户操作"
    },
    social_worker: {
        personaName: "社区社工",
        behaviorLogic: "情感驱动",
        backgroundStory: "耐心，细致，致力于帮助弱势群体。",
        scenarioDescription: "你帮助的流浪汉用你给的钱去买了酒，而不是食物。",
        coreQuestion: "下次你还会给钱吗？",
        option_A: "给，尊重他的选择",
        option_B: "不给钱，只给食物",
        option_C: "不再帮助他"
    },
    lawyer: {
        personaName: "辩护律师",
        behaviorLogic: "理性分析",
        backgroundStory: "无论当事人是否有罪，都要维护其合法权益。",
        scenarioDescription: "你知道你的当事人确实杀了人，但他坚持要求做无罪辩护。",
        coreQuestion: "你会怎么辩护？",
        option_A: "尽全力做无罪辩护",
        option_B: "劝说其认罪减刑",
        option_C: "解除委托关系"
    },
    farmer: {
        personaName: "老农",
        behaviorLogic: "从众心理",
        backgroundStory: "靠天吃饭，淳朴，相信传统经验。",
        scenarioDescription: "专家建议今年改种新品种玉米，但村里人都种老品种。",
        coreQuestion: "你会种什么？",
        option_A: "跟村里人一样种老品种",
        option_B: "尝试新品种",
        option_C: "一半一半"
    },
    flight_attendant: {
        personaName: "空乘人员",
        behaviorLogic: "理性分析",
        backgroundStory: "受过专业训练，始终保持微笑，服务至上。",
        scenarioDescription: "飞机遇气流剧烈颠簸，乘客恐慌尖叫，你自己也很害怕。",
        coreQuestion: "你会做什么？",
        option_A: "镇定广播安抚乘客",
        option_B: "坐在座位上瑟瑟发抖",
        option_C: "去检查安全带"
    },
    taxi_driver: {
        personaName: "出租车司机",
        behaviorLogic: "随机游走",
        backgroundStory: "穿梭于城市角落，见多识广，喜欢侃大山。",
        scenarioDescription: "乘客把一个装满现金的包落在车上。",
        coreQuestion: "你会怎么做？",
        option_A: "送回乘客下车点",
        option_B: "交给警察局",
        option_C: "私吞（没人知道）"
    },
    professor: {
        personaName: "大学教授",
        behaviorLogic: "理性分析",
        backgroundStory: "严谨治学，看重学术声誉。",
        scenarioDescription: "你发现得意门生的毕业论文涉嫌抄袭。",
        coreQuestion: "你会怎么处理？",
        option_A: "按规定上报，取消学位",
        option_B: "私下责令重写",
        option_C: "睁只眼闭只眼"
    },
    nurse: {
        personaName: "ICU护士",
        behaviorLogic: "理性分析",
        backgroundStory: "高压工作环境，见惯生死，反应迅速。",
        scenarioDescription: "两个病人同时生命垂危，医生不在，你只能先救一个。",
        coreQuestion: "你救谁？",
        option_A: "年轻的那个",
        option_B: "病情更重的那个",
        option_C: "先看到的那个"
    },
    architect: {
        personaName: "建筑师",
        behaviorLogic: "理性分析",
        backgroundStory: "追求美学与功能的平衡，有完美主义倾向。",
        scenarioDescription: "甲方为了省钱要求降低建筑材料标准，但这会影响建筑寿命。",
        coreQuestion: "你会同意吗？",
        option_A: "坚决不同意，以辞职相逼",
        option_B: "同意，并在设计上做弥补",
        option_C: "私下向监管部门举报"
    },
    musician: {
        personaName: "摇滚乐手",
        behaviorLogic: "情感驱动",
        backgroundStory: "叛逆，反抗体制，生活不规律。",
        scenarioDescription: "主流电视台邀请你参加晚会，但要求你不能唱反抗歌曲。",
        coreQuestion: "你会去吗？",
        option_A: "去，为了曝光率",
        option_B: "不去，这是妥协",
        option_C: "去，但在现场改词"
    },
    novelist: {
        personaName: "悬疑小说家",
        behaviorLogic: "理性分析",
        backgroundStory: "思维缜密，擅长构思犯罪情节，有些神经质。",
        scenarioDescription: "你在现实中目击了一场犯罪，手法和你书里写的一模一样。",
        coreQuestion: "你会报警吗？",
        option_A: "报警，并说明巧合",
        option_B: "暗中调查，作为素材",
        option_C: "躲起来，怕被认为是嫌疑人"
    },
    gamer: {
        personaName: "电竞选手",
        behaviorLogic: "理性分析",
        backgroundStory: "反应极快，策略至上，习惯团队协作。",
        scenarioDescription: "队友在比赛中失误导致局势劣势，心态崩了。",
        coreQuestion: "你会怎么沟通？",
        option_A: "大声指责，发泄情绪",
        option_B: "鼓励安慰，稳住心态",
        option_C: "沉默专注，试图翻盘"
    },
    trader: {
        personaName: "短线交易员",
        behaviorLogic: "随机游走",
        backgroundStory: "相信市场是随机的，只有概率，没有感情。",
        scenarioDescription: "连续亏损了一周，心态有点失衡。",
        coreQuestion: "你会继续交易吗？",
        option_A: "继续，相信概率回归",
        option_B: "停止交易，休息调整",
        option_C: "加大杠杆，想一把翻本"
    }
};