import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import CountdownBar from '../components/CountdownBar'
import CredibilityStars from '../components/CredibilityStars'
import MobileStatusBar from '../components/MobileStatusBar'
import Button from '../components/Button'
import FeedbackModal from '../components/FeedbackModal'

const TIME_LIMIT = 30

// 缺陷数据结构
interface Flaw {
  id: string
  x: number       // 百分比 0-100
  y: number       // 百分比 0-100
  radius: number  // 判定半径（百分比）
  label: string   // 简短标签
  analysis: string // 详细解析（从Word文档提取）
}

interface ImageQuestion {
  id: string
  image: string
  title: string
  description: string
  flaws: Flaw[]
}

// ===== 6道真实AI图片题目（坐标由用户标记bbox校正） =====
const ALL_IMAGE_QUESTIONS: ImageQuestion[] = [
  {
    id: 'img-1',
    image: '/images/第二关AI图片识别/1.jpg',
    title: '🖼️ AI图片找茬 · 民国茶馆',
    description: '这张民国江南茶馆街景中有 4 处时代错误，点击标记它们',
    flaws: [
      { id: 'f1', x: 23.0, y: 37.6, radius: 15.0, label: '收款码海报', analysis: '民国时期不存在二维码和移动支付，纸质收款码海报是21世纪产物，时代物品冲突' },
      { id: 'f2', x: 41.3, y: 59.7, radius: 15.0, label: '智能触屏手表①', analysis: '民国时期不存在智能触屏手表，粉衣女子手腕上的智能手表属于时代错误' },
      { id: 'f3', x: 87.5, y: 68.9, radius: 15.0, label: '怪异轮毂', analysis: '民国黄包车全部为实木辐条车轮，无现代铝合金多辐条汽车轮毂' },
      { id: 'f4', x: 62.5, y: 60.1, radius: 15.0, label: '智能触屏手表②', analysis: '民国时期不存在智能触屏手表，右侧人物手腕上同样出现了智能手表，属于时代错误' },
    ],
  },
  {
    id: 'img-2',
    image: '/images/第二关AI图片识别/2.jpg',
    title: '🖼️ AI图片找茬 · 水运码头',
    description: '这张清末江南水运码头场景中有 3 处时代错误，点击标记它们',
    flaws: [
      { id: 'f1', x: 24.2, y: 68.9, radius: 15.0, label: '甲板上的手机', analysis: '清末木船甲板上不可能放着一台现代智能手机，属于严重时代错误' },
      { id: 'f2', x: 62.5, y: 55.0, radius: 15.0, label: '微信收款立牌', analysis: '船夫身边出现微信支付收款立牌，清末尚无移动支付和微信' },
      { id: 'f3', x: 68.4, y: 22.7, radius: 15.0, label: '监控摄像头', analysis: '远处码头立柱上装有现代监控摄像头，清末没有电子监控设备' },
    ],
  },
  {
    id: 'img-3',
    image: '/images/第二关AI图片识别/3.jpg',
    title: '🖼️ AI图片找茬 · 公园喂锦鲤',
    description: '这张城市公园亲子喂锦鲤图中有 2 处不合理之处，点击标记它们',
    flaws: [
      { id: 'f1', x: 43.4, y: 38.3, radius: 15.0, label: '面包屑悬浮空中', analysis: '物理bug：固体面包碎屑受重力必然下落，无法凭空悬浮在半空中，违反重力常识' },
      { id: 'f2', x: 28.6, y: 75.4, radius: 15.0, label: '鱼长了爪子', analysis: '生物bug：鱼类只有鱼鳍，不会长出陆生哺乳动物的爪子，属于AI生成的生理结构错误' },
    ],
  },
  {
    id: 'img-4',
    image: '/images/第二关AI图片识别/4.jpg',
    title: '🖼️ AI图片找茬 · 十字路口',
    description: '这张城市十字路口图中有 3 处不合理之处，点击标记它们',
    flaws: [
      { id: 'f1', x: 59.4, y: 38.3, radius: 15.0, label: '红绿灯同时亮', analysis: '符号标识错误：行人红绿灯同时亮起红灯和绿灯，现实中不可能出现这种信号矛盾' },
      { id: 'f2', x: 82.2, y: 53.5, radius: 15.0, label: '怪异球形护栏', analysis: '材质矛盾：道路隔离护栏需要坚固耐磨的金属材质保障安全，海绵/塑料球形装饰无法起到防护作用' },
      { id: 'f3', x: 56.9, y: 75.0, radius: 15.0, label: '路面倒影红灯', analysis: '光学悖论：白天干燥的柏油路面哑光不反光，不可能出现红绿灯的清晰红色倒影' },
    ],
  },
  {
    id: 'img-5',
    image: '/images/第二关AI图片识别/5.jpg',
    title: '🖼️ AI图片找茬 · 供销社柜台',
    description: '这张六十年代乡村供销社图中有 4 处时代错误，点击标记它们',
    flaws: [
      { id: 'f1', x: 21.2, y: 49.5, radius: 15.0, label: '口袋里的手机', analysis: '平板手机、触屏手机属于21世纪现代电子产品，60年代根本没有手机' },
      { id: 'f2', x: 35.7, y: 63.1, radius: 15.0, label: '美元钞票', analysis: '计划经济年代实行粮票、布票限量采购副食和日用品，不使用货币（更不可能是美元）直接交易' },
      { id: 'f3', x: 49.2, y: 72.7, radius: 15.0, label: '美团外卖标牌', analysis: '外卖平台、线上优惠券2015年后才出现，60年代没有互联网和外卖服务' },
      { id: 'f4', x: 66.1, y: 72.0, radius: 15.0, label: '玻璃罐糖果', analysis: '网红亚克力/玻璃罐糖果是当代网红日用品，60年代供销社只有铁皮糖果盒和粗陶储物罐' },
    ],
  },
  {
    id: 'img-6',
    image: '/images/第二关AI图片识别/6.jpg',
    title: '🖼️ AI图片找茬 · 唐代仕女',
    description: '这张唐代御花园仕女赏花图中有 2 处时代错误，点击标记它们',
    flaws: [
      { id: 'f1', x: 50.5, y: 35.6, radius: 15.0, label: '蓝牙耳机', analysis: '无线蓝牙耳机是21世纪数码产品，唐代没有电力、电子相关设备，不可能出现入耳式耳机' },
      { id: 'f2', x: 31.9, y: 48.3, radius: 15.0, label: '动漫印花团扇', analysis: '古代团扇一般绘山水花鸟或书法诗词，不存在现代动漫卡通人物印花图案' },
    ],
  },
]

export default function AiImagePage() {
  const navigate = useNavigate()
  const { addLevel2Score } = useGame()

  // 随机抽 3 题
  const [questions] = useState<ImageQuestion[]>(() => {
    const shuffled = [...ALL_IMAGE_QUESTIONS].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  })

  const [qIndex, setQIndex] = useState(0)
  const [markedFlaws, setMarkedFlaws] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; explanation: string; score: number } | null>(null)

  // 倒计时 + 信誉值
  const [timerKey, setTimerKey] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const [credibility, setCredibility] = useState(5)
  const timedOut = useRef(false)

  const current = questions[qIndex]
  const isLast = qIndex >= questions.length - 1

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (submitted) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // 用 flaw.radius 作为判定距离（扩大点击区域）
    for (const flaw of current.flaws) {
      const dx = x - flaw.x
      const dy = y - flaw.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < flaw.radius && !markedFlaws.includes(flaw.id)) {
        setMarkedFlaws(prev => [...prev, flaw.id])
        return
      }
    }
    // 未命中任何缺陷 → 标记为可疑点
    const markerId = `mark-${x.toFixed(0)}-${y.toFixed(0)}`
    if (!markedFlaws.includes(markerId)) {
      setMarkedFlaws(prev => [...prev, markerId])
    }
  }, [current, markedFlaws, submitted])

  const doSubmit = useCallback((isTimeout: boolean) => {
    if (submitted) return
    setSubmitted(true)
    setTimerRunning(false)

    const correctMarks = markedFlaws.filter(m => current.flaws.some(f => f.id === m))
    const wrongMarks = markedFlaws.filter(m => !current.flaws.some(f => f.id === m))
    const foundAll = current.flaws.every(f => markedFlaws.includes(f.id))
    const noWrong = wrongMarks.length === 0
    const score = isTimeout ? 0 : correctMarks.length * 15 - wrongMarks.length * 5 + (foundAll && noWrong ? 25 : 0)

    addLevel2Score(Math.max(0, score))

    // 信誉值：漏了关键flaw或误判 → 扣星
    if (!foundAll || wrongMarks.length > 0) {
      setCredibility(prev => Math.max(0, prev - 1))
    }

    const missedFlaws = current.flaws.filter(f => !markedFlaws.includes(f.id))

    // 构建详细反馈（含解析）
    let explanation = isTimeout ? '⏱️ 时间到！\n\n' : ''
    explanation += `🎯 本题共 ${current.flaws.length} 处错误\n\n`

    if (correctMarks.length > 0) {
      explanation += `✅ 正确找到 ${correctMarks.length} 处：\n`
      for (const m of correctMarks) {
        const flaw = current.flaws.find(f => f.id === m)
        if (flaw) explanation += `  · ${flaw.label} — ${flaw.analysis}\n`
      }
      explanation += '\n'
    }

    if (wrongMarks.length > 0) {
      explanation += `❌ 误判 ${wrongMarks.length} 处（此处没有错误，扣分）\n\n`
    }

    if (missedFlaws.length > 0) {
      explanation += `👀 遗漏 ${missedFlaws.length} 处：\n`
      for (const flaw of missedFlaws) {
        explanation += `  · ${flaw.label} — ${flaw.analysis}\n`
      }
      explanation += '\n'
    }

    if (foundAll && noWrong) {
      explanation = isTimeout ? explanation : `🎉 完美！全部正确找到！\n\n` + explanation
    }

    setLastResult({ isCorrect: foundAll && noWrong, explanation, score: Math.max(0, score) })
    setShowFeedback(true)
  }, [submitted, current, markedFlaws, addLevel2Score])

  const handleSubmit = () => doSubmit(false)
  const handleTimeout = useCallback(() => { timedOut.current = true; doSubmit(true) }, [doSubmit])

  const handleNext = () => {
    setShowFeedback(false)
    if (isLast) {
      // 流程修复：完成后进入文字题，不直接结束第二关
      navigate('/level2-text')
    } else {
      setQIndex(prev => prev + 1)
      setMarkedFlaws([])
      setSubmitted(false)
      setLastResult(null)
      setTimerKey(k => k + 1)
      setTimerRunning(true)
      timedOut.current = false
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
            🤖 AI图片侦探 · {qIndex + 1}/{questions.length}
          </span>
        </div>
      </div>

      {/* 桌面双栏 */}
      <div className="w-full max-w-md mx-auto lg:max-w-none lg:flex lg:gap-6 lg:items-start">
        {/* 左侧：主内容 */}
        <div className="lg:flex-[0.65] lg:min-w-0">
          {/* 进度（桌面端） */}
          <div className="hidden lg:block mb-3">
            <p className="text-text-secondary text-sm text-center">
              🤖 AI 迷雾核心 · Part A：AI图片侦探 · {qIndex + 1}/{questions.length}
            </p>
          </div>

          <h3 className="text-xl font-bold text-center mb-1.5">{current.title}</h3>
          <p className="text-text-secondary text-base text-center mb-3">{current.description}</p>

          {/* 图片区域 */}
          <motion.div
            key={`img-${current.id}`}
            className="relative w-full rounded-2xl border-2 border-[rgba(43,75,124,0.15)] overflow-hidden cursor-crosshair bg-black/5"
            style={{ aspectRatio: '4/3' }}
            onClick={handleImageClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* 真实图片 */}
            <img
              src={current.image}
              alt={current.title}
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />

            <AnimatePresence>
              {markedFlaws.map(markerId => {
                const flaw = current.flaws.find(f => f.id === markerId)
                if (flaw) {
                  return (
                    <motion.div
                      key={markerId}
                      className={`absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        submitted ? 'border-correct bg-correct/20 text-correct' : 'border-accent bg-accent/20 text-accent'
                      }`}
                      style={{ left: `${flaw.x}%`, top: `${flaw.y}%` }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      ✓
                    </motion.div>
                  )
                }
                const [x, y] = markerId.replace('mark-', '').split('-').map(Number)
                return (
                  <motion.div
                    key={markerId}
                    className={`absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full border-2 flex items-center justify-center ${
                      submitted ? 'border-danger bg-danger/20 text-danger' : 'border-accent bg-accent/20 text-accent'
                    }`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {submitted ? '✗' : '?'}
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {submitted && current.flaws.filter(f => !markedFlaws.includes(f.id)).map(flaw => (
              <motion.div
                key={`missed-${flaw.id}`}
                className="absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 border-dashed border-correct/60 flex items-center justify-center animate-pulse"
                style={{ left: `${flaw.x}%`, top: `${flaw.y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="text-correct text-[10px] font-bold">这里！</span>
              </motion.div>
            ))}
          </motion.div>

          {markedFlaws.length > 0 && !submitted && (
            <div className="mt-4">
              <p className="text-text-secondary text-base mb-1.5">已标记 {markedFlaws.length} 处</p>
              <div className="flex flex-wrap gap-2">
                {markedFlaws.map((m, i) => {
                  const flaw = current.flaws.find(f => f.id === m)
                  return (
                    <span key={m} className="text-sm bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5 text-accent">
                      {flaw ? flaw.label : `可疑点${i + 1}`}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-4">
            {!submitted ? (
              <Button variant="primary" className="w-full" onClick={handleSubmit} disabled={markedFlaws.length === 0}>
                提交判断（已标记 {markedFlaws.length} 处）
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
            <p className="text-text-secondary text-base">🤖 AI图片侦探</p>
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
