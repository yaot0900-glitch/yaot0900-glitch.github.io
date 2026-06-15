import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import { getPreTestQuestions } from '../data/questionnaire'
import QuestionnaireCard from '../components/QuestionnaireCard'
import Button from '../components/Button'

type ViewState = 'intro' | 'questions'

export default function PreTestPage() {
  const navigate = useNavigate()
  const { state, setPreTestAnswers, goTo } = useGame()

  const [view, setView] = useState<ViewState>('intro')
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showErrors, setShowErrors] = useState(false)

  const questions = getPreTestQuestions()
  const answeredCount = Object.keys(answers).filter(k => answers[k]).length

  const handleAnswerChange = useCallback((questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setShowErrors(false)
  }, [])

  const handleSubmit = () => {
    // 检查必答题
    const unanswered = questions.filter(q => q.type !== 'text' && !answers[q.id])
    if (unanswered.length > 0) {
      setShowErrors(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setPreTestAnswers(answers)
    goTo('trackSelect')
    navigate('/select')
  }

  // 已完成则跳转
  if (state.preTestComplete) {
    navigate('/select', { replace: true })
    return null
  }

  return (
    <motion.div
      className="page-container py-4 lg:py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="wait">
        {view === 'intro' ? (
          <IntroView
            key="intro"
            playerName={state.playerName}
            participantId={state.participantId}
            questionCount={questions.length}
            onStart={() => setView('questions')}
            onSkip={() => { goTo('trackSelect'); navigate('/select') }}
          />
        ) : (
          <QuestionsView
            key="questions"
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            answeredCount={answeredCount}
            totalCount={questions.filter(q => q.type !== 'text').length}
            showErrors={showErrors}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============ 引导页 ============

function IntroView({ playerName, participantId, questionCount, onStart, onSkip }: {
  playerName: string
  participantId: string
  questionCount: number
  onStart: () => void
  onSkip: () => void
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-6 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <p className="text-text-muted text-sm mb-1">真相解码局</p>
      <h2 className="text-2xl font-bold text-accent mb-6">🔍 探员入职素养测试</h2>

      <div className="glass-card w-full max-w-md lg:max-w-2xl p-6 mb-6 text-left">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">🕵️</span>
          <div>
            <p className="text-text-primary font-medium mb-1">
              欢迎你，{playerName} 探员！
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              在正式执行任务之前，真相解码局需要了解你当前的<b>信息辨别基础能力</b>，以便为你量身匹配训练强度。
              本测试共 <strong>{questionCount} 题</strong>，预计耗时 <strong>5-8 分钟</strong>。
              请放松心态，按真实情况作答——没有对错，只有了解。
            </p>
          </div>
        </div>

        <div className="bg-gold/10 border border-gold/20 rounded-lg p-3">
          <p className="text-text-muted text-xs leading-relaxed">
            🏷️ <strong>你的探员编号：</strong>
            <span className="text-gold text-lg font-bold ml-1">{participantId}</span>
          </p>
          <p className="text-text-muted text-xs mt-1">
            🔒 编号已自动录入系统，无需手动填写
          </p>
        </div>
      </div>

      <div className="w-full max-w-md lg:max-w-2xl space-y-3">
        <Button variant="primary" className="w-full text-lg" onClick={onStart}>
          📝 开始入职测试
        </Button>
        <button
          className="w-full text-text-muted text-sm underline underline-offset-4 hover:text-accent transition-colors py-2"
          onClick={onSkip}
        >
          跳过测试，直接开始任务（仅供教师预览）
        </button>
      </div>
    </motion.div>
  )
}

// ============ 答题页 ============

function QuestionsView({ questions, answers, onAnswerChange, answeredCount, totalCount, showErrors, onSubmit }: {
  questions: ReturnType<typeof getPreTestQuestions>
  answers: Record<string, string>
  onAnswerChange: (id: string, value: string) => void
  answeredCount: number
  totalCount: number
  showErrors: boolean
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
            📋 前测问卷 · 已回答 {answeredCount}/{totalCount} 题
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

      {/* 提交按钮 */}
      <div className="sticky bottom-0 bg-[#C5E8F8]/90 backdrop-blur-sm rounded-xl p-4 mt-6 shadow-lg">
        <Button variant="primary" className="w-full text-lg" onClick={onSubmit}>
          ✅ 提交问卷，开始游戏
        </Button>
        <p className="text-text-muted text-xs text-center mt-2">
          提交后无法修改，请确认所有题目已作答
        </p>
      </div>
    </motion.div>
  )
}
