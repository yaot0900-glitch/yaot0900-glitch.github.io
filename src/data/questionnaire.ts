/**
 * 前后测问卷题目配置
 *
 * 题型说明：
 * - likert-5: 5点李克特量表（1非常不同意 ~ 5非常同意）
 * - single: 单选题（A/B/C/D/E）
 * - text: 简答题
 * - info: 信息展示（无答题，仅展示提示文字）
 *
 * 题目标记：
 * - preOnly: 仅前测出现（基本信息、自评）
 * - postOnly: 仅后测出现（游戏反馈）
 * - 无标记: 前后测共享（核心量表+算法认知+情景题）
 */

// ============================================================
// Types
// ============================================================

export type QuestionType = 'likert-5' | 'single' | 'text' | 'info'

export interface QuestionOption {
  value: string
  label: string
}

export interface QuestionnaireQuestion {
  id: string
  type: QuestionType
  text: string
  options?: QuestionOption[]
  preOnly?: boolean      // 仅前测
  postOnly?: boolean     // 仅后测
  category?: string      // 分类标签
}

export type QuestionnaireAnswers = Record<string, string>

// ============================================================
// 共享量表选项
// ============================================================

const LIKERT_5 = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
] as QuestionOption[]

const JUDGMENT_OPTIONS = [
  { value: 'A', label: 'A. 真实' },
  { value: 'B', label: 'B. 大概率真实' },
  { value: 'C', label: 'C. 无法判断' },
  { value: 'D', label: 'D. 虚假 / 存在夸大' },
  { value: 'E', label: 'E. 明显虚假 / 缺乏证据' },
] as QuestionOption[]

// ============================================================
// 全部题目
// ============================================================

export const ALL_QUESTIONS: QuestionnaireQuestion[] = [
  // ========== 前测专有：基本信息 ==========
  {
    id: 'pre-age',
    type: 'single',
    text: '你的年龄：',
    options: [
      { value: 'A', label: 'A. 18岁以下' },
      { value: 'B', label: 'B. 18–20岁' },
      { value: 'C', label: 'C. 21–23岁' },
      { value: 'D', label: 'D. 24岁及以上' },
    ],
    category: '基本信息',
    preOnly: true,
  },
  {
    id: 'pre-gender',
    type: 'single',
    text: '你的性别：',
    options: [
      { value: 'A', label: 'A. 男' },
      { value: 'B', label: 'B. 女' },
      { value: 'C', label: 'C. 其他 / 不便透露' },
    ],
    category: '基本信息',
    preOnly: true,
  },
  {
    id: 'pre-education',
    type: 'single',
    text: '你当前的学历阶段：',
    options: [
      { value: 'A', label: 'A. 本科' },
      { value: 'B', label: 'B. 研究生' },
      { value: 'C', label: 'C. 高职/专科' },
      { value: 'D', label: 'D. 其他' },
    ],
    category: '基本信息',
    preOnly: true,
  },
  {
    id: 'pre-social-time',
    type: 'single',
    text: '你平均每天使用社交媒体的时长：',
    options: [
      { value: 'A', label: 'A. 1小时以内' },
      { value: 'B', label: 'B. 1–3小时' },
      { value: 'C', label: 'C. 3–5小时' },
      { value: 'D', label: 'D. 5小时以上' },
    ],
    category: '基本信息',
    preOnly: true,
  },

  // ========== 信息获取与信任倾向量表（前后测共享，8题）==========
  {
    id: 'scale-verify',
    type: 'likert-5',
    text: '我通常会在转发信息前核实来源。',
    options: LIKERT_5,
    category: '信息信任倾向',
  },
  {
    id: 'scale-doubt',
    type: 'likert-5',
    text: '只要内容看起来"合理"，我一般不会质疑其真实性。',
    options: LIKERT_5,
    category: '信息信任倾向',
  },
  {
    id: 'scale-authority',
    type: 'likert-5',
    text: '我更容易相信带有"官方""权威""内部消息"字样的信息。',
    options: LIKERT_5,
    category: '信息信任倾向',
  },
  {
    id: 'scale-compare',
    type: 'likert-5',
    text: '我会主动对比不同平台的信息来判断真伪。',
    options: LIKERT_5,
    category: '信息信任倾向',
  },
  {
    id: 'scale-emotion',
    type: 'likert-5',
    text: '如果信息带有情绪冲击（如震惊、愤怒），我更容易转发。',
    options: LIKERT_5,
    category: '信息信任倾向',
  },
  {
    id: 'scale-trust',
    type: 'likert-5',
    text: '我认为大多数网络信息基本可信，不需要过度怀疑。',
    options: LIKERT_5,
    category: '信息信任倾向',
  },
  {
    id: 'scale-fact-opinion',
    type: 'likert-5',
    text: '我能区分"观点类内容"和"事实类内容"。',
    options: LIKERT_5,
    category: '信息信任倾向',
  },
  {
    id: 'scale-official',
    type: 'likert-5',
    text: '我在看到"紧急通知/重大消息"时会优先查证官方渠道。',
    options: LIKERT_5,
    category: '信息信任倾向',
  },

  // ========== 媒介与算法认知（前后测共享，3题）==========
  {
    id: 'algo-know',
    type: 'single',
    text: '我知道短视频/社交平台的内容是通过算法推荐给我的。',
    options: [
      { value: 'A', label: 'A. 非常清楚' },
      { value: 'B', label: 'B. 大致了解' },
      { value: 'C', label: 'C. 不太清楚' },
      { value: 'D', label: 'D. 完全不了解' },
    ],
    category: '媒介算法认知',
  },
  {
    id: 'algo-hotlist',
    type: 'likert-5',
    text: '我认为平台热搜/排行榜是完全客观真实的。',
    options: LIKERT_5,
    category: '媒介算法认知',
  },
  {
    id: 'algo-push',
    type: 'likert-5',
    text: '我认为"很多热门内容可能是被运营或资金推动的"。',
    options: LIKERT_5,
    category: '媒介算法认知',
  },

  // ========== 前测专有：信息辨识能力自评（2题）==========
  {
    id: 'pre-self-eval',
    type: 'single',
    text: '我认为自己辨别虚假信息的能力：',
    options: [
      { value: 'A', label: 'A. 很强' },
      { value: 'B', label: 'B. 较强' },
      { value: 'C', label: 'C. 一般' },
      { value: 'D', label: 'D. 较弱' },
      { value: 'E', label: 'E. 很弱' },
    ],
    category: '自评',
    preOnly: true,
  },
  {
    id: 'pre-reshare',
    type: 'single',
    text: '过去一个月，我曾经转发后发现信息是假的情况：',
    options: [
      { value: 'A', label: 'A. 从未' },
      { value: 'B', label: 'B. 1次' },
      { value: 'C', label: 'C. 2–3次' },
      { value: 'D', label: 'D. 4次及以上' },
    ],
    category: '自评',
    preOnly: true,
  },

  // ========== 前测核心能力情景题（9题，3赛道×3题）==========
  // --- 健康赛道 ---
  {
    id: 'pre-health-1',
    type: 'single',
    text: '某健康短视频博主称："每天喝某种‘排毒水’可以清除体内90%以上毒素，甚至可以替代肝脏功能，长期饮用可逆转慢性病。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '健康赛道',
    preOnly: true,
  },
  {
    id: 'pre-health-2',
    type: 'single',
    text: '某健康科普账号称："人体在睡眠时大脑会完全关闭，因此如果晚上醒来思考问题，说明睡眠质量极差，长期如此会导致脑细胞永久死亡。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '健康赛道',
    preOnly: true,
  },
  {
    id: 'pre-health-3',
    type: 'single',
    text: '某养生账号发布内容："最新研究表明，长期熬夜的损伤可以通过补觉完全逆转，甚至可以通过周末集中补觉恢复全部免疫系统功能，对身体无长期影响。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '健康赛道',
    preOnly: true,
  },
  // --- 文娱赛道 ---
  {
    id: 'pre-culture-1',
    type: 'single',
    text: '某娱乐账号发布消息："某知名影视作品票房暴涨，是因为片方通过‘内部操作’人为制造午夜满场假象，并大量雇佣水军刷票房数据，因此该片实际口碑极差但数据极好。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '文化娱乐赛道',
    preOnly: true,
  },
  {
    id: 'pre-culture-2',
    type: 'single',
    text: '某影视评论账号称："某电影豆瓣评分低是因为开画当天遭遇‘恶意差评攻击’，大量账号在短时间内集中打一星，导致评分严重失真。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '文化娱乐赛道',
    preOnly: true,
  },
  {
    id: 'pre-culture-3',
    type: 'single',
    text: '某娱乐资讯账号发布爆料称："某顶流演员被曝片场态度恶劣"并附带偷拍视频截图，同时引用另一平台网友评论"业内早就知道他人品有问题"。核查发现偷拍视频来自不同剧组，评论来自另一事件话题。\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '文化娱乐赛道',
    preOnly: true,
  },
  // --- 时政赛道 ---
  {
    id: 'pre-politics-1',
    type: 'single',
    text: '某社交平台传播消息称："国家即将出台新政策，全面取消线下政务窗口办理，所有业务必须通过手机APP完成，不再接受任何人工服务。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '时政社会赛道',
    preOnly: true,
  },
  {
    id: 'pre-politics-2',
    type: 'single',
    text: '某自媒体发布："国家将在未来一年内取消所有地方性政策执行权，所有政策必须由中央统一审批，各地政府仅执行不再有自主权。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '时政社会赛道',
    preOnly: true,
  },
  {
    id: 'pre-politics-3',
    type: 'single',
    text: '某网络账号发布："某地政府将推出新规：所有公共场所拍摄必须提前报备审批，否则将被处罚。该政策已在部分城市试点，并逐步全国推广。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '时政社会赛道',
    preOnly: true,
  },

  // ========== 后测核心能力情景题（9题，3赛道×3题）==========
  // --- 健康赛道 ---
  {
    id: 'post-health-1',
    type: 'single',
    text: '某养生博主在短视频中宣称："长期不吃主食，只吃蔬菜水果，就能快速减脂，还能彻底清除体内湿气、根治肠胃疾病，是人人适用的健康养生方式。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '健康赛道',
    postOnly: true,
  },
  {
    id: 'post-health-2',
    type: 'single',
    text: '网络流传说法："睡前大量饮用红酒，可以软化血管、预防三高，长期坚持能远离心脑血管疾病。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '健康赛道',
    postOnly: true,
  },
  {
    id: 'post-health-3',
    type: 'single',
    text: '有博主科普："普通感冒属于自限性疾病，多数情况下无需特殊用药，多喝水、多休息一周左右可自行痊愈。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '健康赛道',
    postOnly: true,
  },
  // --- 文娱赛道 ---
  {
    id: 'post-culture-1',
    type: 'single',
    text: '某娱乐自媒体发布爆料："当下热门综艺节目所有镜头均为刻意剪辑造假，嘉宾所有互动全是剧本安排，节目呈现内容和现实完全不符，行业内所有综艺皆是如此。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '文化娱乐赛道',
    postOnly: true,
  },
  {
    id: 'post-culture-2',
    type: 'single',
    text: '网传知名喜剧演员变卖国内房产、全家移民海外，配图为网络无关别墅图片，当事人及工作室已公开辟谣。\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '文化娱乐赛道',
    postOnly: true,
  },
  {
    id: 'post-culture-3',
    type: 'single',
    text: '媒体发布政府采购公示，显示地方文旅部门与热门户外综艺达成合作，支付宣传费用用于城市文旅推广，相关文件可在政府采购平台查询。\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '文化娱乐赛道',
    postOnly: true,
  },
  // --- 时政赛道 ---
  {
    id: 'post-politics-1',
    type: 'single',
    text: '社交平台大量转发消息："全国各大高校将全面取消线下课堂教学，所有课程永久转为线上授课，不再开展线下教学活动。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '时政社会赛道',
    postOnly: true,
  },
  {
    id: 'post-politics-2',
    type: 'single',
    text: '网传伪造政府文件称："全国社区便利店、小卖部全部关停，日常购物统一前往大型商超，小型商铺一律取缔。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '时政社会赛道',
    postOnly: true,
  },
  {
    id: 'post-politics-3',
    type: 'single',
    text: '街道办官方蓝V账号发布通知："本社区将于本周六开展免费老年人体检活动，60周岁以上居民可携带身份证前往社区服务中心参与。"\n请判断该信息：',
    options: JUDGMENT_OPTIONS,
    category: '时政社会赛道',
    postOnly: true,
  },

  // ========== 后测专有：游戏体验反馈（4题）==========
  {
    id: 'post-difficulty',
    type: 'single',
    text: '您认为这款虚假信息识别游戏的整体难度如何？',
    options: [
      { value: 'A', label: 'A. 太简单' },
      { value: 'B', label: 'B. 偏简单' },
      { value: 'C', label: 'C. 适中' },
      { value: 'D', label: 'D. 偏难' },
      { value: 'E', label: 'E. 太难' },
    ],
    category: '游戏反馈',
    postOnly: true,
  },
  {
    id: 'post-learned',
    type: 'single',
    text: '体验游戏后，你是否掌握了新的虚假信息识别方法与技巧？',
    options: [
      { value: 'A', label: 'A. 完全没学到' },
      { value: 'B', label: 'B. 学到很少' },
      { value: 'C', label: 'C. 学到一些' },
      { value: 'D', label: 'D. 学到较多' },
      { value: 'E', label: 'E. 学到很多' },
    ],
    category: '游戏反馈',
    postOnly: true,
  },
  {
    id: 'post-helpful',
    type: 'single',
    text: '你认为游戏中学到的辨伪技巧，对日常上网、社交、学习是否有帮助？',
    options: [
      { value: 'A', label: 'A. 完全没帮助' },
      { value: 'B', label: 'B. 不太有帮助' },
      { value: 'C', label: 'C. 一般' },
      { value: 'D', label: 'D. 比较有帮助' },
      { value: 'E', label: 'E. 非常有帮助' },
    ],
    category: '游戏反馈',
    postOnly: true,
  },
  {
    id: 'post-suggestions',
    type: 'text',
    text: '对于游戏的内容、画面、题目设计、互动形式等，你有哪些改进建议或想法？',
    category: '游戏反馈',
    postOnly: true,
  },
]

// ============================================================
// 辅助函数
// ============================================================

/** 获取前测题目（排除 postOnly） */
export function getPreTestQuestions(): QuestionnaireQuestion[] {
  return ALL_QUESTIONS.filter(q => !q.postOnly)
}

/** 获取后测题目（排除 preOnly） */
export function getPostTestQuestions(): QuestionnaireQuestion[] {
  return ALL_QUESTIONS.filter(q => !q.preOnly)
}

/** 获取前后测共享题目（用于对比分析） */
export function getSharedQuestions(): QuestionnaireQuestion[] {
  return ALL_QUESTIONS.filter(q => !q.preOnly && !q.postOnly)
}

/** 前测共享题数量（用于汇报） */
export const SHARED_QUESTION_COUNT = getSharedQuestions().length
