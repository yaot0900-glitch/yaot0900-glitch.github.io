import { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import QuestionCard from '../components/QuestionCard'
import CountdownBar from '../components/CountdownBar'
import CredibilityStars from '../components/CredibilityStars'
import MobileStatusBar from '../components/MobileStatusBar'
import FeedbackModal from '../components/FeedbackModal'
import Button from '../components/Button'
import questionBank from '../data/questions.json'
import type { Track } from '../context/GameContext'

const TIME_LIMIT = 30

// 问题数据接口
interface QuestionData {
  id: number
  track: string
  phase: string
  image: string
  text: string
  source: string
  isFake: boolean
  explanation: string
  tip: string
}

export default function QuizPage() {
  const navigate = useNavigate()
  const { state, submitAnswer, completeTrack, submitPostTestAnswer, completePostTest, revive, isPostTestMode, getCurrentQuestionIds } = useGame()

  const track = state.currentTrack
  const index = state.currentQuestionIndex

  // 获取当前赛道随机分配的题目
  const questionIds = getCurrentQuestionIds()
  const trackQuestions = useMemo(() => {
    if (!track || questionIds.length === 0) return []
    const all = (questionBank as unknown as Record<string, { questions: QuestionData[] }>)[track]?.questions || []
    return questionIds.map(id => all.find(q => q.id === id)).filter(Boolean) as QuestionData[]
  }, [track, questionIds])

  const totalQuestions = trackQuestions.length
  const currentQuestion = trackQuestions[index]

  // 倒计时相关
  const [timerKey, setTimerKey] = useState(0)
  const [timerRunning, setTimerRunning] = useState(true)
  const [remainingSeconds, setRemainingSeconds] = useState(TIME_LIMIT)

  // 反馈弹窗
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastResult, setLastResult] = useState<{ isCorrect: boolean; explanation: string; score: number } | null>(null)

  // 复活弹窗
  const [showRevive, setShowRevive] = useState(false)

  // 如果没选赛道或题目不存在，返回选择页
  useEffect(() => {
    if (!track) {
      navigate('/select')
    }
  }, [track, navigate])

  // 监听 phase 变化做导航
  useEffect(() => {
    if (state.phase === 'reward') navigate('/reward')
    if (state.phase === 'report') navigate('/report')
  }, [state.phase, navigate])

  // 答题处理
  const handleAnswer = useCallback((playerAnswer: boolean) => {
    if (!currentQuestion || showFeedback) return

    setTimerRunning(false)

    // 根据前测/后测使用不同的提交函数
    const submitFn = isPostTestMode ? submitPostTestAnswer : submitAnswer
    const result = submitFn(
      currentQuestion.id,
      currentQuestion.track as Track,
      playerAnswer,
      !currentQuestion.isFake,
      remainingSeconds
    )

    setLastResult({
      isCorrect: result.isCorrect,
      explanation: currentQuestion.explanation || (currentQuestion.isFake ? '这条信息是虚假的。' : '这条信息是真实的。'),
      score: result.score,
    })

    // 如果答错了且信誉值降到0，触发复活（仅前测）
    if (!isPostTestMode && !result.isCorrect && state.credibility <= 1 && !state.hasRevived) {
      setTimeout(() => {
        setShowRevive(true)
        setShowFeedback(false)
      }, 1500)
    } else {
      setShowFeedback(true)
    }
  }, [currentQuestion, showFeedback, isPostTestMode, submitAnswer, submitPostTestAnswer, remainingSeconds, state.credibility, state.hasRevived])

  // 超时处理
  const handleTimeout = useCallback(() => {
    if (showFeedback) return
    setTimerRunning(false)

    if (currentQuestion) {
      const submitFn = isPostTestMode ? submitPostTestAnswer : submitAnswer
      submitFn(
        currentQuestion.id,
        currentQuestion.track as Track,
        true,
        !currentQuestion.isFake,
        0
      )

      setLastResult({
        isCorrect: false,
        explanation: `⏱️ 时间到！正确答案是「${currentQuestion.isFake ? '假消息' : '真消息'}」\n\n${currentQuestion.explanation}`,
        score: 0,
      })
      setShowFeedback(true)
    }
  }, [currentQuestion, showFeedback, isPostTestMode, submitAnswer, submitPostTestAnswer])

  // 下一题
  const handleNext = useCallback(() => {
    setShowFeedback(false)
    setLastResult(null)

    if (index + 1 >= totalQuestions) {
      // 赛道完成 — 根据前测/后测调用不同的完成函数
      if (isPostTestMode) {
        completePostTest()
      } else {
        completeTrack()
      }
    } else {
      // 重置计时器
      setTimerKey(k => k + 1)
      setTimerRunning(true)
      setRemainingSeconds(TIME_LIMIT)
    }
  }, [index, totalQuestions, isPostTestMode, completeTrack, completePostTest])

  // 复活处理
  const handleRevive = useCallback(() => {
    revive()
    setShowRevive(false)
    setTimerKey(k => k + 1)
    setTimerRunning(true)
    setRemainingSeconds(TIME_LIMIT)
  }, [revive])

  // 如果当前没有题目，显示过渡
  if (!currentQuestion) {
    return (
      <div className="page-container items-center justify-center">
        <p className="text-text-muted">加载中...</p>
      </div>
    )
  }

  const trackNames: Record<string, string> = { health: '健康科普', culture: '文化娱乐', politics: '时政社会' }
  const phaseLabel = isPostTestMode ? '后测' : ''

  return (
    <div className="page-container py-4">
      {/* 桌面双栏布局 */}
      <div className="w-full max-w-md mx-auto lg:max-w-none lg:flex lg:gap-6 lg:items-start">
        {/* 左侧：题目区域 */}
        <div className="lg:flex-[0.65] lg:min-w-0">
          {/* 顶部提示 */}
          {isPostTestMode && (
            <div className="w-full mb-3 px-3 py-1.5 rounded-lg bg-gold/5 border border-gold/10 text-center">
              <p className="text-gold text-xs">📈 后测模式 · 考察你的进步</p>
            </div>
          )}

          {/* 题目卡片 */}
          <motion.div
            key={`q-${currentQuestion.id}`}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionCard
              image={currentQuestion.image || undefined}
              text={currentQuestion.text}
              source={currentQuestion.source}
              questionNumber={index + 1}
              totalQuestions={totalQuestions}
              track={track || undefined}
            />
          </motion.div>

          {/* 判断按钮 */}
          <div className="mt-8 flex gap-5">
            <Button
              variant="judge-false"
              className="flex-1"
              onClick={() => handleAnswer(false)}
              disabled={showFeedback}
            >
              ✋ 假消息
            </Button>
            <Button
              variant="judge-true"
              className="flex-1"
              onClick={() => handleAnswer(true)}
              disabled={showFeedback}
            >
              ✅ 真消息
            </Button>
          </div>

          <div className="text-center mt-3">
            <span className="text-text-muted text-xs">
              电脑端可用 ← → 方向键快速选择
            </span>
          </div>
        </div>

        {/* 右侧：状态面板（桌面端显示）*/}
        <div className="hidden lg:block lg:flex-[0.35] lg:min-w-0 space-y-14">
          {/* 信誉值卡片 */}
          <CredibilityStars current={state.credibility} />

          {/* 倒计时卡片 */}
          <CountdownBar
            key={timerKey}
            seconds={TIME_LIMIT}
            running={timerRunning}
            onTimeout={handleTimeout}
          />

          {/* 当前信息 */}
          <div className="card-info text-center">
            <p className="text-text-secondary text-base">
              🏷️ {track ? trackNames[track] : ''} · 第{index + 1}/{totalQuestions}题
            </p>
            <p className="text-3xl font-bold text-accent mt-1.5">{state.score} 分</p>
            <p className="text-text-muted text-sm mt-0.5">
              {phaseLabel || '📋 前测模式'}
            </p>
          </div>
        </div>
      </div>

      {/* 手机端：紧凑顶栏（倒计时 + 信誉度合并） */}
      <div className="lg:hidden w-full max-w-md mx-auto mb-4">
        <MobileStatusBar
          key={timerKey}
          seconds={TIME_LIMIT}
          running={timerRunning}
          onTimeout={handleTimeout}
          credibility={state.credibility}
        />
        <div className="text-center mt-2">
          <span className="text-text-muted text-sm">
            🏷️ {track ? trackNames[track] : ''} · 第{index + 1}/{totalQuestions}题 · {state.score} 分
          </span>
        </div>
      </div>

      {/* 反馈弹窗 */}
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

      {/* 复活弹窗 */}
      <AnimatePresence>
        {showRevive && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div
              className="relative glass-card max-w-sm mx-4 p-6 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              <div className="text-5xl mb-3">📞</div>
              <h3 className="text-lg font-bold text-gold mb-2">局长的紧急电话</h3>
              <p className="text-text-secondary text-sm mb-4">
                "探员，我看到你的信誉值在告急。别担心，每个优秀探员都经历过这一刻。深呼吸，我帮你恢复了2颗星，继续任务吧。"
              </p>
              <p className="text-text-muted text-xs mb-4">⭐ 信誉值恢复至 2 颗（仅此一次）</p>
              <button className="btn-primary w-full" onClick={handleRevive}>
                收到，局长！继续任务
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 键盘快捷键 */}
      <KeyboardHandler
        onTrue={() => handleAnswer(true)}
        onFalse={() => handleAnswer(false)}
        disabled={showFeedback || showRevive}
      />
    </div>
  )
}

/** 键盘快捷键处理 */
function KeyboardHandler({ onTrue, onFalse, disabled }: { onTrue: () => void; onFalse: () => void; disabled: boolean }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (disabled) return
      if (e.key === 'ArrowLeft') onFalse()
      if (e.key === 'ArrowRight') onTrue()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onTrue, onFalse, disabled])

  return null
}
