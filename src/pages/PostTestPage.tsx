import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import { getPostTestQuestions } from '../data/questionnaire'
import { buildFullDataPayload, submitGameData } from '../utils/dataCollector'
import QuestionnaireCard from '../components/QuestionnaireCard'
import Button from '../components/Button'

type ViewState = 'intro' | 'questions' | 'complete'

export default function PostTestPage() {
  const navigate = useNavigate()
  const { state, setPostTestAnswers, markDataSubmitted, resetGame, totalScore, correctRate, totalCorrect } = useGame()
  const totalAnswered = state.answers.length

  const [view, setView] = useState<ViewState>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showErrors, setShowErrors] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const submitRan = useRef(false)

  const questions = getPostTestQuestions()
  const answeredCount = Object.keys(answers).filter(k => answers[k]).length
  const requiredCount = questions.filter(q => q.type !== 'text').length

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setShowErrors(false)
  }, [])

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => q.type !== 'text' && !answers[q.id])
    if (unanswered.length > 0) {
      setShowErrors(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (submitRan.current) return
    submitRan.current = true
    setSubmitting(true)
    setSubmitError(false)

    // 1. 保存后测答案
    setPostTestAnswers(answers)

    // 2. 构建并提交完整数据
    const payload = buildFullDataPayload(
      state.playerName,
      state.participantId,
      state.answers,
      totalScore,
      totalCorrect,
      totalAnswered,
      correctRate,
      state.level2Complete,
      state.level2Score,
      state.credibility,
      state.hasRevived,
      state.preTestAnswers,
      answers,
    )

    const ok = await submitGameData(payload)
    if (ok) {
      markDataSubmitted()
      setView('complete')
    } else {
      setSubmitError(true)
      submitRan.current = false
    }
    setSubmitting(false)
  }

  const handleFinish = () => {
    resetGame()
    navigate('/')
  }

  // 已完成则跳转
  if (state.postTestComplete) {
    return (
      <div className="page-container flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-4xl mb-4">🎉</p>
          <p className="text-text-primary text-lg font-medium mb-2">你已经完成了后测问卷</p>
          <p className="text-text-secondary text-sm mb-6">感谢你的参与！</p>
          <Button variant="primary" onClick={handleFinish}>
            🏠 返回首页
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="page-container py-4 lg:py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <IntroView
            key="intro"
            playerName={state.playerName}
            participantId={state.participantId}
            questionCount={questions.length}
            onStart={() => setView('questions')}
          />
        )}
        {view === 'questions' && (
          <QuestionsView
            key="questions"
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            answeredCount={answeredCount}
            totalCount={requiredCount}
            showErrors={showErrors}
            submitting={submitting}
            submitError={submitError}
            onSubmit={handleSubmit}
          />
        )}
        {view === 'complete' && (
          <CompleteView
            key="complete"
            participantId={state.participantId}
            onFinish={handleFinish}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ 引导页 ============

function IntroView({ playerName, participantId, questionCount, onStart }: {
  playerName: string
  participantId: string
  questionCount: number
  onStart: () => void
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-6 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <p className="text-text-muted text-sm mb-1">真相解码局 · 实验后测</p>
      <h2 className="text-2xl font-bold text-accent mb-6">📊 后测问卷</h2>

      <div className="glass-card w-full max-w-md lg:max-w-2xl p-6 mb-6 text-left">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="text-text-primary font-medium mb-1">
              恭喜完成全部任务，{playerName} 探员！
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              感谢你参与本次实验。请完成这份简短的后测问卷，
              帮助我们评估游戏的学习效果。共 <strong>{questionCount} 题</strong>，预计耗时 <strong>5 分钟</strong>。
            </p>
          </div>
        </div>

        <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 mb-3">
          <p className="text-text-muted text-xs leading-relaxed">
            🏷️ <strong>你的参与者编号：</strong>
            <span className="text-gold text-lg font-bold ml-1">{participantId}</span>
          </p>
        </div>
        <div className="bg-accent/5 border border-accent/10 rounded-lg p-3">
          <p className="text-text-muted text-xs leading-relaxed">
            💡 <strong>提示：</strong>本问卷包含与前测相同的核心题目，
            用于对比你在游戏前后的媒介素养变化。请如实作答。
          </p>
        </div>
      </div>

      <div className="w-full max-w-md lg:max-w-2xl">
        <Button variant="primary" className="w-full text-lg" onClick={onStart}>
          📝 开始后测问卷
        </Button>
        <p className="text-text-muted text-xs mt-2">预计 5 分钟完成</p>
      </div>
    </motion.div>
  )
}

// ============ 答题页 ============

function QuestionsView({ questions, answers, onAnswerChange, answeredCount, totalCount, showErrors, submitting, submitError, onSubmit }: {
  questions: ReturnType<typeof getPostTestQuestions>
  answers: Record<string, string>
  onAnswerChange: (id: string, value: string) => void
  answeredCount: number
  totalCount: number
  showErrors: boolean
  submitting: boolean
  submitError: boolean
  onSubmit: () => void
}) {
  return (
    <motion.div
      className="w-full max-w-md lg:max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* 进度条 */}
      <div className="sticky top-0 z-10 bg-[#C5E8F8]/90 backdrop-blur-sm rounded-xl p-3 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-secondary text-sm">
            📋 后测问卷 · 已回答 {answeredCount}/{totalCount} 题
          </span>
          <span className="text-text-muted text-xs">
            {Math.round((answeredCount / totalCount) * 100)}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/60 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-accent"
            animate={{ width: `${(answeredCount / totalCount) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* 题目列表 */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <QuestionnaireCard
            key={q.id}
            question={q}
            value={answers[q.id] || ''}
            onChange={onAnswerChange}
            index={i}
            showError={showErrors && q.type !== 'text'}
          />
        ))}
      </div>

      {/* 错误提示 */}
      {submitError && (
        <div className="glass-card p-4 mt-4 border-danger/30 text-center">
          <p className="text-danger text-sm mb-2">⚠️ 数据提交失败，请检查网络后重试</p>
          <p className="text-text-muted text-xs">不影响游戏，你也可以直接结束</p>
        </div>
      )}

      {/* 提交按钮 */}
      <div className="sticky bottom-0 bg-[#C5E8F8]/90 backdrop-blur-sm rounded-xl p-4 mt-6 shadow-lg">
        <Button
          variant="primary"
          className="w-full text-lg"
          onClick={onSubmit}
          disabled={submitting}
        >
          {submitting ? '⏳ 提交中...' : '📤 提交并完成'}
        </Button>
        <p className="text-text-muted text-xs text-center mt-2">
          提交后将保存你的全部实验数据
        </p>
      </div>
    </motion.div>
  )
}

// ============ 完成页 ============

function CompleteView({ participantId, onFinish }: {
  participantId: string
  onFinish: () => void
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-10 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="text-5xl mb-4">🎉</p>
      <h2 className="text-2xl font-bold text-accent mb-2">感谢你的参与！</h2>
      <p className="text-text-secondary text-sm mb-6 leading-relaxed max-w-md">
        你的实验数据已成功提交。参与者编号：
        <span className="text-gold font-bold ml-1">{participantId}</span>
      </p>

      <div className="glass-card w-full max-w-md p-4 mb-6 text-left">
        <p className="text-text-muted text-xs leading-relaxed">
          📋 <strong>后续说明：</strong><br />
          你可以在 Google Sheets 中查看完整数据。
          如需进一步了解媒介素养研究成果，请关注后续通知。
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <Button variant="primary" className="w-full" onClick={onFinish}>
          🏠 结束实验
        </Button>
      </div>
    </motion.div>
  )
}
