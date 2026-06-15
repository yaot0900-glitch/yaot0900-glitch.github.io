import { useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import { getRank, getPlayStyle, calcGenericRadarData } from '../utils/scoring'
import RadarChart from '../components/RadarChart'
import Button from '../components/Button'
import type { Track } from '../context/GameContext'

const TRACK_EMOJI: Record<Track, string> = {
  health: '🏥',
  culture: '🎭',
  politics: '🏛️',
}

const TRACK_SHORT: Record<Track, string> = {
  health: '健康科普',
  culture: '文化娱乐',
  politics: '时政社会',
}

const TRACK_COLORS: Record<Track, string> = {
  health: '#5EEAD4',
  culture: '#C084FC',
  politics: '#60A5FA',
}

export default function ReportPage() {
  const navigate = useNavigate()
  const { state, totalScore, correctRate, totalCorrect } = useGame()
  const totalAnswered = state.answers.length
  const rank = getRank(totalScore)

  // 雷达图（3赛道全部完成）
  const radarData = useMemo(() => {
    return calcGenericRadarData(
      state.answers,
      state.level2Score,
      state.level2Complete,
      3 // 三个赛道必玩
    )
  }, [state.answers, state.level2Score, state.level2Complete])

  // 辨别风格
  const allTimes = state.answers.map(a => 30 - a.remainingSeconds)
  const avgTime = allTimes.length > 0 ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length : 30
  const style = getPlayStyle(avgTime, correctRate)

  // 最弱维度
  const weakestDimension = useMemo(() => {
    if (radarData.length === 0) return null
    return radarData.reduce((prev, curr) => (curr.value < prev.value ? curr : prev))
  }, [radarData])

  // 三赛道成绩
  const tracks: Track[] = ['health', 'culture', 'politics']
  const trackData = useMemo(() => {
    return tracks.map(track => {
      const trackAnswers = state.answers.filter(a => a.track === track)
      const correct = trackAnswers.filter(a => a.isCorrect).length
      const total = trackAnswers.length
      const score = trackAnswers.reduce((sum, a) => sum + a.score, 0)
      return { track, correct, total, score, rate: total > 0 ? correct / total : 0 }
    })
  }, [state.answers])

  // 截图
  const handleScreenshot = useCallback(() => { window.print() }, [])

  // 后测
  const handleGoToPostTest = () => navigate('/post-test')

  return (
    <motion.div
      className="page-container py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标题 */}
      <div className="text-center mb-8">
        <p className="text-text-secondary text-base lg:text-lg mb-1.5">真相解码局 · 媒体素养评估报告</p>
        <h2 className="text-3xl lg:text-4xl font-bold text-accent glow-text">探员档案卡</h2>
      </div>

      {/* 桌面双列：档案卡 + 雷达图 */}
      <div className="w-full lg:flex lg:gap-5 lg:max-w-5xl lg:mx-auto lg:items-stretch">
        {/* 左：档案卡 */}
        <div className="w-full lg:flex-1">
          <motion.div
            className="glass-card p-7 text-center w-full lg:h-full lg:flex lg:flex-col lg:justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-5xl lg:text-6xl mb-2">{rank.badge}</div>
            <h3 className="text-2xl lg:text-3xl font-bold text-accent glow-text">{state.playerName}</h3>
            <p className="text-text-secondary text-base lg:text-lg">{rank.title}</p>
            <div className="flex justify-center gap-1 my-3">
              {Array.from({ length: rank.stars }).map((_, i) => <span key={i} className="text-lg lg:text-xl">⭐</span>)}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-[#E8DDD0]">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-accent glow-text">{totalScore}</p>
                <p className="text-text-muted text-base lg:text-lg">总分</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-correct glow-text">{Math.round(correctRate * 100)}%</p>
                <p className="text-text-muted text-base lg:text-lg">正确率</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-text-primary glow-text">{totalCorrect}/{totalAnswered}</p>
                <p className="text-text-muted text-base lg:text-lg">正确/总题</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 右：雷达图 */}
        <div className="w-full lg:flex-1">
          <motion.div
            className="card-dark text-center w-full lg:h-full lg:flex lg:flex-col lg:justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg lg:text-xl font-bold text-accent mb-4 glow-text">📊 能力雷达图</h4>
            <RadarChart data={radarData} size={260} />
            {!state.level2Complete && !state.level2Skipped && (
              <p className="text-text-secondary text-base lg:text-lg mt-4">🤖 AI辨别力：未考核</p>
            )}
            {state.level2Complete && (
              <p className="text-text-secondary text-base lg:text-lg mt-4">
                🤖 AI辨别力得分：{state.level2Score} 分
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* 三赛道成绩对比 */}
      <motion.div
        className="glass-card p-7 mb-6 w-full lg:max-w-5xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-base font-bold text-center text-accent mb-4">📊 三赛道成绩对比</h4>
        <div className="grid grid-cols-3 gap-3">
          {trackData.map(td => (
            <div
              key={td.track}
              className="bg-[#F1F5F9] rounded-xl p-4 text-center"
            >
              <p className="text-2xl mb-1">{TRACK_EMOJI[td.track]}</p>
              <p className="text-text-primary text-sm font-medium mb-2">{TRACK_SHORT[td.track]}</p>
              <p className="text-xl font-bold" style={{ color: TRACK_COLORS[td.track] }}>
                {td.score}
              </p>
              <p className="text-text-muted text-xs">分</p>
              <p className="text-text-secondary text-sm mt-1">
                {td.correct}/{td.total} 正确
              </p>
              <p className="text-text-muted text-xs">
                {Math.round(td.rate * 100)}%
              </p>
              {td.correct === 5 && (
                <p className="text-gold text-xs mt-1">⭐ 完美</p>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-4 pt-4 border-t border-[#E8DDD0]">
          <p className="text-text-secondary text-sm">
            综合正确率：<span className="text-accent font-bold">{Math.round(correctRate * 100)}%</span>
            {' · '}
            总分：<span className="text-accent font-bold">{totalScore}</span>
          </p>
        </div>
      </motion.div>

      {/* 风格 + 最弱维度 */}
      <div className="w-full lg:flex lg:gap-5 lg:max-w-5xl lg:mx-auto lg:items-stretch">
        <motion.div
          className="glass-card p-7 text-left w-full lg:flex-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h4 className="text-lg lg:text-xl font-bold mb-4">🎯 你的辨别风格</h4>
          <div className="text-5xl lg:text-6xl mb-2">{style.emoji}</div>
          <p className="text-accent font-bold text-lg lg:text-xl">{style.label}</p>
          <p className="text-text-secondary text-base lg:text-lg mt-1.5">{style.description}</p>
          <div className="mt-4 text-base lg:text-lg text-text-muted">
            平均判断时间：{avgTime.toFixed(1)}秒
          </div>
        </motion.div>

        <motion.div
          className="card-dark text-left w-full lg:flex-1"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <h4 className="text-lg lg:text-xl font-bold text-accent mb-4 glow-text">📋 维度详情</h4>
          <div className="space-y-3">
            {radarData.map(d => (
              <div key={d.label} className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-text-secondary text-base lg:text-lg flex-1 text-left">{d.label}</span>
                <span className="text-base lg:text-lg font-bold glow-text" style={{ color: d.color }}>{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 提升建议 */}
      <motion.div
        className="glass-card p-7 mb-6 w-full lg:max-w-5xl mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <h4 className="text-base font-bold text-center mb-4">💡 个性化提升建议</h4>
        <div className="space-y-4">
          {weakestDimension && weakestDimension.value < 50 && (
            <div className="bg-wrong/5 border border-wrong/10 rounded-xl p-4">
              <p className="text-wrong text-base font-medium mb-1.5">⚠️ {weakestDimension.label}需要加强</p>
              <p className="text-text-secondary text-base">
                {weakestDimension.label === '判断准确度' && '每道题仔细对照来源和证据，不要凭感觉下判断。'}
                {weakestDimension.label === '反应敏锐度' && '多看多练，熟悉常见虚假信息套路后反应自然会快。'}
                {weakestDimension.label === '信息警惕性' && '遇到"震惊""惊人"等标题先怀疑，假消息往往包装得很吸引眼球。'}
                {weakestDimension.label === '知识广度' && '多尝试不同赛道的题目，拓宽你的信息辨别领域。'}
                {weakestDimension.label === 'AI辨别力' && '挑战第二关，学习识别AI生成的图片和文字中的破绽。'}
              </p>
            </div>
          )}
          <div className="bg-correct/5 border border-correct/10 rounded-xl p-4">
            <p className="text-correct text-base font-medium mb-1.5">✅ 通用建议</p>
            <p className="text-text-secondary text-base">
              遇到信息先问三个问题：来源是谁？证据在哪里？其他渠道怎么说？养成习惯，辨别力会持续提升。
            </p>
          </div>
        </div>
      </motion.div>

      {/* 宣誓 */}
      <motion.div
        className="glass-card p-7 mb-6 w-full lg:max-w-5xl mx-auto text-center border-accent/20"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h4 className="text-base lg:text-2xl font-bold text-accent mb-4">🫡 真相探员宣誓</h4>
        <p className="text-text-secondary text-base lg:text-2xl leading-relaxed italic">
          "我承诺，在分享任何信息之前，<br />
          先停下，先思考，先核实。<br />
          不传谣、不信谣、不造谣。<br />
          以真相为剑，以理性为盾，<br />
          做信息时代的清醒者。"
        </p>
      </motion.div>

      {/* 按钮 */}
      <div className="w-full lg:max-w-5xl mx-auto space-y-4">
        <Button variant="primary" className="w-full" onClick={handleGoToPostTest}>
          📋 完成后测问卷
        </Button>
        <Button variant="secondary" className="w-full" onClick={handleScreenshot}>
          📸 保存报告图片
        </Button>
        {!state.level2Complete && (
          <Button variant="secondary" className="w-full" onClick={() => navigate('/level2-image')}>
            🔥 挑战AI辨别关卡
          </Button>
        )}
        <button
          className="w-full text-text-muted text-base underline underline-offset-4 hover:text-text-secondary transition-colors py-2"
          onClick={() => navigate('/home')}
        >
          重新开始
        </button>
      </div>
    </motion.div>
  )
}
