import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import CountdownBar from '../components/CountdownBar'
import CredibilityStars from '../components/CredibilityStars'
import MobileStatusBar from '../components/MobileStatusBar'
import Button from '../components/Button'
import FeedbackModal from '../components/FeedbackModal'

const TIME_LIMIT = 30

interface Issue {
  id: string
  text: string
  isRealIssue: boolean
  analysis: string
}

interface TextQuestion {
  id: string
  title: string
  context: string
  content: string
  issues: Issue[]
}

const TEXT_QUESTIONS: TextQuestion[] = [
  {
    id: 'txt-1',
    title: '📝 AI消息辨伪 · 第1题',
    context: '以下是一条网络传播的健康广告，请找出其中最不合理的地方（单选）：',
    content: `【内部特大喜讯！】
某国大健康实验室历时20年突破生物极限！最新研发的"逆龄活细胞口服液"今日面世。只需连续饮用3天，即可100%修复全身受损器官，让80岁的老人重获20岁年轻人的骨骼密度与皮肤弹性。数量有限，点此链接立即抢购。

——转发自"养生健康前沿速递"`,
    issues: [
      {
        id: 'i1', text: '研发历时20年显得太短，不可信', isRealIssue: false,
        analysis: '药品研发时长本身不能作为判断真假的依据——有些药物确实需要数十年研发。真正该质疑的是"3天修复全身器官"这种违反生理规律的夸大疗效，而不是研发时长。',
      },
      {
        id: 'i2', text: '"3天100%修复器官、让80岁变20岁"违背基本医学常识与生物学规律', isRealIssue: true,
        analysis: '人体器官再生是极其复杂的生物学过程，目前没有任何药物能在3天内100%修复全身器官，更不可能让80岁老人拥有20岁的骨骼密度与皮肤弹性。这类"神药"话术是虚假健康广告的典型特征。',
      },
      {
        id: 'i3', text: '动态配图科技感太强，普通人看不懂', isRealIssue: false,
        analysis: '配图风格与信息真伪无关——虚假信息可以配简单的图，真实信息也可以配科技感强的图。判断信息真伪应该看内容本身的科学依据，而不是图片风格。',
      },
      {
        id: 'i4', text: '转发来源账号名字里带有"前沿"两个字', isRealIssue: false,
        analysis: '账号名称中有"前沿"字眼不能作为判断依据——很多正规科普账号也使用类似词汇。判断来源是否可信，应该查看其认证状态、历史发布记录和专业背景，而不是仅看名称。',
      },
    ],
  },
  {
    id: 'txt-2',
    title: '📝 AI消息辨伪 · 第2题',
    context: '以下是一条网络通知，请找出其中最不合理的地方（单选）：',
    content: `【紧急通知】
接上级最新指示，为了全面提升市民身体素质，自下周一零点起，我市所有公共场所、企事业单位及住宅小区将实施全面封控管理。全体市民必须居家进行每日3小时的强制室内有氧运动，由社区通过智能手环线上打卡监督，不达标者将影响个人征信。

[配图：外地企业复工表]

——转发自"本地生活大小事儿"`,
    issues: [
      {
        id: 'i1', text: '每天3小时的运动量对上班族来说时间不够', isRealIssue: false,
        analysis: '时间是否充足不是核心判断依据——真正的问题是这条"政策通知"本身是否真实存在。"全面封控+强制运动+影响征信"这种极端政策不可能由一个自媒体账号首发，必须先查政府官方渠道核实。',
      },
      {
        id: 'i2', text: '强制居家运动属于利民政策，不应该用"紧急通知"的格式', isRealIssue: false,
        analysis: '政府通知的格式因具体情况而异，"紧急通知"格式本身不代表真假。真正的破绽在于：如此重大的全市性政策，消息源竟是一个非官方的自媒体账号，而非政府官网或官微。',
      },
      {
        id: 'i3', text: '政策通知极其重大，但来源却是自媒体，且配图是无关的"外地企业复工表"，图文完全不符', isRealIssue: true,
        analysis: '这是最关键的判断依据——涉及全市封控、强制运动、影响征信的重大政策，不可能由"本地生活大小事儿"这种自媒体账号首发，必须先有政府官方公告。加上配图是无关的"外地企业复工表"，图文完全不匹配，是典型的拼接谣言特征。',
      },
      {
        id: 'i4', text: '智能手环打卡技术上无法实现', isRealIssue: false,
        analysis: '智能手环运动打卡在技术上完全可以实现，已有成熟方案。质疑技术可行性反而偏离了真正的破绽——这条消息根本没有任何官方来源，政策本身大概率是编造的。',
      },
    ],
  },
  {
    id: 'txt-3',
    title: '📝 AI消息辨伪 · 第3题',
    context: '以下是一条社会热点转发消息，请找出其中不合理的地方（多选：3个）：',
    content: `【痛心！扩散求公道！】
刚刚发生的惨剧！我市某知名大桥因偷工减料，在一辆新能源面包车驶过时突然发生粉碎性垮塌，导致数十辆车坠入江中。现场惨绝人寰，可相关部门为了压热度，竟然封锁了方圆5公里的消息，根本不让主流媒体报道。气愤！是中国人就转起来，让更多人看到真相！

[配图：桥梁正常对接施工照片]

——转发自"正义发声先锋"`,
    issues: [
      {
        id: 'i1', text: '桥梁施工在技术上必须留有断口，不可能是一整块石头做出来的', isRealIssue: false,
        analysis: '讨论桥梁施工技术细节偏离了重点——真正需要关注的是：消息来源是否可靠？有没有权威媒体报道？图片是否被恶意曲解？这篇帖子的多处破绽才是辨别关键。',
      },
      {
        id: 'i2', text: '煽动性极强的情绪化语言（如"是中国人就转""惨绝人寰""气愤"）', isRealIssue: true,
        analysis: '大量使用情绪煽动性词汇是谣言的典型特征。当一条消息反复使用"是中国人就转""惨绝人寰""气愤"等激烈语言时，它的目的不是传递事实，而是激发你的情绪来促使用户转发。理性判断的第一步就是不被情绪牵着走。',
      },
      {
        id: 'i3', text: '逻辑前后矛盾，声称"封锁消息不让报道"，自己却能言之凿凿地发在网上', isRealIssue: true,
        analysis: '这是一个明显的逻辑硬伤——如果消息真的被完全封锁了，发帖人又怎么可能知道所有细节并在网上传播？这种"既被封锁又被我知道"的矛盾叙事是谣言常见的逻辑漏洞。',
      },
      {
        id: 'i4', text: '配图实为正常的桥梁对接施工照片，却被恶意曲解为"垮塌事故"', isRealIssue: true,
        analysis: '这是"张冠李戴"式谣言的经典手法——用真实存在的正常照片，配上完全不相干的煽动性文字，让读者误以为图片就是事件证据。遇到带图的爆料，先查一下图片是否来自其他无关场景。',
      },
    ],
  },
  {
    id: 'txt-4',
    title: '📝 AI消息辨伪 · 第4题',
    context: '以下是一条投资理财推广消息，请找出其中不合理的地方（多选：2个）：',
    content: `【重磅福利，限时进群】
知名投资大咖、前亚洲首富幕后操盘手李教授因看透股市红尘，决定在退休前造福社会。李教授联合知名国际风投机构，利用独家AI量化算法，免费带大家布局下一只百倍暴涨股。承诺保本保收益，首批名额仅限188人，扫码立即进群领取。

[配图：李教授照片]

——转发自"财富密码天天看"`,
    issues: [
      {
        id: 'i1', text: '投资市场不存在"保本保收益"且能"百倍暴涨"的稳赚生意', isRealIssue: true,
        analysis: '这是金融常识——任何投资都有风险，"保本保收益"和"百倍暴涨"在逻辑上互相矛盾。凡是承诺高收益又保证零风险的投资产品，基本可以判定为骗局。正规金融机构从不会做出这种承诺。',
      },
      {
        id: 'i2', text: '名人照片存在明显的AI合成/修图翻车痕迹，涉嫌假冒身份', isRealIssue: true,
        analysis: '"前亚洲首富幕后操盘手李教授"这个身份本身就很可疑。通过AI合成名人照片来冒充金融大咖，是近年来杀猪盘和投资诈骗的常用手段。遇到"名人荐股"，先查该人物是否真实存在、是否有权威媒体报道。',
      },
      {
        id: 'i3', text: '"首批名额仅限188人"的限制人数太少，不符合大机构的作风', isRealIssue: false,
        analysis: '"限量名额"是营销中常见的制造紧迫感的手段，本身不代表真假。真正需要警惕的是"保本保收益+百倍暴涨"这种违背金融规律的承诺，以及伪造的名人身份——这些才是骗局的核心特征。',
      },
      {
        id: 'i4', text: '转发源"财富密码天天看"没有完成微信的官方企业实名认证', isRealIssue: false,
        analysis: '是否有企业认证不是判断信息真伪的决定性因素——很多正规个人博主也没有企业认证。关键要看信息内容本身：承诺"保本+百倍暴涨"已经暴露了骗局本质，不需要纠结账号认证状态。',
      },
    ],
  },
  {
    id: 'txt-5',
    title: '📝 AI消息辨伪 · 第5题',
    context: '以下是一条科技新闻，请找出其中不合理的地方（多选：3个）：',
    content: `【科技前沿】
震撼！天文学家昨日观测到太阳表面发生超级大耀斑，释放出的"伽马辐射流"将在今晚引爆地球磁场。届时所有智能手机、Wi-Fi信号将被转化为高频辐射，直接烧伤人体皮肤。请大家务必在今晚22点前关闭手机，并将其放入盛满水的脸盆中隔绝辐射。

——转发自"环球探索微科学"`,
    issues: [
      {
        id: 'i1', text: '太阳耀斑和磁暴确实存在，但Wi-Fi信号绝不会转化为"烧伤皮肤的物理辐射"', isRealIssue: true,
        analysis: '这是用"科学术语"包装谣言的典型——太阳耀斑、磁暴是真实的天文现象，但通信信号被"转化"为烧伤人体的辐射在物理学上毫无依据。Wi-Fi信号是电磁波，不会因为太阳活动就变成高能电离辐射。谣言常常用真实概念+虚构后果来制造恐慌。',
      },
      {
        id: 'i2', text: '把开机的手机放进水盆里防辐射，属于破坏电子设备的荒谬做法', isRealIssue: true,
        analysis: '用水盆"隔绝辐射"不仅毫无科学依据，还会损坏电子设备。电磁辐射的屏蔽需要使用特殊材料（如金属网），普通自来水根本挡不住。如果真的存在高能辐射，一盆水也起不到任何保护作用——这纯粹是破坏性恶作剧。',
      },
      {
        id: 'i3', text: '现在的智能手机大多具备IP68级防水，放进水里也不会坏', isRealIssue: false,
        analysis: '讨论手机防水等级完全偏离了重点——真正的问题不是"手机会不会坏"，而是"把手机放进水里防辐射"这个做法本身是荒谬的。即使手机防水，水也不能屏蔽电磁辐射。关注手机的防水性能反而被谣言带偏了方向。',
      },
      {
        id: 'i4', text: '重大天文灾难预警没有引用国家航天局或国家空间天气监测预警中心的官方声明', isRealIssue: true,
        analysis: '涉及影响全体公众的天文灾难预警，一定会有国家航天局、中国气象局国家空间天气监测预警中心等权威机构发布官方声明。此类重大预警绝不可能由一个叫"环球探索微科学"的自媒体账号首发。查不到官方来源 = 谣言。',
      },
    ],
  },
]

export default function AiTextPage() {
  const navigate = useNavigate()
  const { addLevel2Score, completeLevel2 } = useGame()

  // 每次从 5 题中随机抽取 2 题
  const [questions] = useState(() => {
    const shuffled = [...TEXT_QUESTIONS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 2)
  })

  const [qIndex, setQIndex] = useState(0)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; explanation: string; score: number } | null>(null)

  // 倒计时 + 信誉值
  const [timerKey, setTimerKey] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const [credibility, setCredibility] = useState(5)

  const current = questions[qIndex]
  const isLast = qIndex >= questions.length - 1

  const toggleIssue = (id: string) => {
    if (submitted) return
    setSelectedIssues(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const doSubmit = useCallback((isTimeout: boolean) => {
    if (submitted) return
    setSubmitted(true)
    setTimerRunning(false)

    const realIssues = current.issues.filter(i => i.isRealIssue)
    const correctSelected = selectedIssues.filter(id => realIssues.some(i => i.id === id))
    const wrongSelected = selectedIssues.filter(id => !realIssues.some(i => i.id === id))
    const foundAll = realIssues.every(i => selectedIssues.includes(i.id))
    const noWrong = wrongSelected.length === 0
    const score = isTimeout ? 0 : correctSelected.length * 15 - wrongSelected.length * 5 + (foundAll && noWrong ? 25 : 0)

    addLevel2Score(Math.max(0, score))

    if (!foundAll || wrongSelected.length > 0) {
      setCredibility(prev => Math.max(0, prev - 1))
    }

    // 构建详细反馈（含解析）
    let explanation = isTimeout ? '⏱️ 时间到！\n\n' : ''

    if (foundAll && noWrong && !isTimeout) {
      explanation += '🎉 完美！全部正确识别！\n\n'
    }

    if (correctSelected.length > 0) {
      explanation += `✅ 正确识别 ${correctSelected.length} 处：\n`
      for (const id of correctSelected) {
        const issue = current.issues.find(i => i.id === id)
        if (issue) explanation += `  · 「${issue.text}」\n    → ${issue.analysis}\n`
      }
      explanation += '\n'
    }

    if (wrongSelected.length > 0) {
      explanation += `❌ 误判 ${wrongSelected.length} 处（这些其实不是问题所在）：\n`
      for (const id of wrongSelected) {
        const issue = current.issues.find(i => i.id === id)
        if (issue) explanation += `  · 「${issue.text}」\n    → ${issue.analysis}\n`
      }
      explanation += '\n'
    }

    if (!foundAll) {
      const missed = realIssues.filter(i => !selectedIssues.includes(i.id))
      explanation += `👀 遗漏了 ${missed.length} 处真正的问题：\n`
      for (const issue of missed) {
        explanation += `  · 「${issue.text}」\n    → ${issue.analysis}\n`
      }
      explanation += '\n'
    }

    // 总结提示
    if (!foundAll || wrongSelected.length > 0) {
      explanation += '💡 提示：辨别虚假信息时，抓住核心逻辑漏洞和来源问题，不要被表面细节带偏。\n'
    }

    setLastResult({ isCorrect: foundAll && noWrong, explanation, score: Math.max(0, score) })
    setShowFeedback(true)
  }, [submitted, current, selectedIssues, addLevel2Score])

  const handleSubmit = () => doSubmit(false)
  const handleTimeout = useCallback(() => doSubmit(true), [doSubmit])

  const handleNext = () => {
    setShowFeedback(false)
    if (isLast) {
      completeLevel2()
      navigate('/report')
    } else {
      setQIndex(prev => prev + 1)
      setSelectedIssues([])
      setSubmitted(false)
      setLastResult(null)
      setTimerKey(k => k + 1)
      setTimerRunning(true)
    }
  }

  return (
    <div className="page-container py-4">
      {/* 手机端：紧凑顶栏 */}
      <div className="lg:hidden w-full max-w-md mx-auto mb-4">
        <MobileStatusBar
          key={timerKey}
          seconds={TIME_LIMIT}
          running={timerRunning}
          onTimeout={handleTimeout}
          credibility={credibility}
        />
        <div className="text-center mt-2">
          <span className="text-text-muted text-sm">
            🤖 AI文字侦探 · {qIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* 桌面双栏 */}
      <div className="w-full max-w-md mx-auto lg:max-w-none lg:flex lg:gap-6 lg:items-start">
        {/* 左侧：主内容 */}
        <div className="lg:flex-[0.65] lg:min-w-0">
          <div className="hidden lg:block mb-3">
            <p className="text-text-secondary text-sm text-center">
              🤖 AI 迷雾核心 · Part B：AI消息解码 · {qIndex + 1}/{questions.length}
            </p>
          </div>

          <h3 className="text-xl font-bold text-center mb-1.5">{current.title}</h3>
          <p className="text-text-secondary text-base text-center mb-3">{current.context}</p>

          <motion.div
            key={`msg-${qIndex}`}
            className="glass-card p-5 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-text-primary text-base leading-relaxed whitespace-pre-line">
              {current.content}
            </p>
          </motion.div>

          <div className="space-y-3 mb-5">
            <p className="text-text-secondary text-base">点击你认为不合理的地方：</p>
            {current.issues.map(issue => {
              const isSelected = selectedIssues.includes(issue.id)
              let borderClass = 'border-[#D4C8B0] hover:border-[#D4A843]/50 hover:shadow-[0_0_16px_rgba(212,168,67,0.18)] hover:bg-[#FFFAF2]'
              if (submitted && issue.isRealIssue) borderClass = 'border-correct/40 bg-correct/5'
              if (submitted && !issue.isRealIssue && isSelected) borderClass = 'border-danger/40 bg-danger/5'

              return (
                <button
                  key={issue.id}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-base ${borderClass} ${
                    isSelected && !submitted ? 'border-accent/40 bg-accent/5' : ''
                  } ${!isSelected ? 'text-text-secondary' : 'text-text-primary'}`}
                  onClick={() => toggleIssue(issue.id)}
                  disabled={submitted}
                >
                  <span className="mr-2.5">{isSelected ? '🟠' : '⚪'}</span>
                  {issue.text}
                  {submitted && issue.isRealIssue && !isSelected && (
                    <span className="ml-2 text-correct text-sm">← 遗漏</span>
                  )}
                  {submitted && !issue.isRealIssue && isSelected && (
                    <span className="ml-2 text-danger text-sm">← 误判</span>
                  )}
                </button>
              )
            })}
          </div>

          <div>
            {!submitted ? (
              <Button variant="primary" className="w-full" onClick={handleSubmit} disabled={selectedIssues.length === 0}>
                提交判断（已选 {selectedIssues.length} 项）
              </Button>
            ) : (
              <p className="text-text-muted text-sm text-center">已提交</p>
            )}
          </div>
        </div>

        {/* 右侧：状态面板（桌面端）*/}
        <div className="hidden lg:block lg:flex-[0.35] lg:min-w-0 space-y-14">
          <CredibilityStars current={credibility} />
          <CountdownBar
            key={timerKey}
            seconds={TIME_LIMIT}
            running={timerRunning}
            onTimeout={handleTimeout}
          />
          <div className="card-info text-center">
            <p className="text-text-secondary text-base">🤖 AI消息解码</p>
            <p className="text-text-muted text-sm mt-1">第 {qIndex + 1}/{questions.length} 题</p>
          </div>
        </div>
      </div>



      <AnimatePresence>
        {showFeedback && lastResult && (
          <FeedbackModal
            isCorrect={lastResult.isCorrect}
            explanation={lastResult.explanation}
            score={lastResult.score}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
