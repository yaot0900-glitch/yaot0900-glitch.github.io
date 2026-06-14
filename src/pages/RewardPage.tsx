import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import { getRank } from '../utils/scoring'
import Button from '../components/Button'
import type { Track } from '../context/GameContext'

const TRACK_LABELS: Record<Track, string> = {
  health: '健康科普',
  culture: '文化娱乐',
  politics: '时政社会',
}

const TRACK_EMOJI: Record<Track, string> = {
  health: '🏥',
  culture: '🎭',
  politics: '🏛️',
}

export default function RewardPage() {
  const navigate = useNavigate()
  const { state, totalScore, correctRate, totalCorrect, getTrackStats, getTrackScore } = useGame()
  const rank = getRank(totalScore)
  const totalAnswered = state.answers.length

  // 三个赛道的统计数据
  const tracks: Track[] = ['health', 'culture', 'politics']
  const trackData = tracks.map(track => ({
    track,
    label: TRACK_LABELS[track],
    emoji: TRACK_EMOJI[track],
    stats: getTrackStats(track),
    score: getTrackScore(track),
  }))

  const handleChallenge = () => {
    navigate('/level2-invite')
  }

  const handleReport = () => {
    navigate('/report')
  }

  return (
    <motion.div
      className="page-container items-center justify-center text-center py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 迷雾退散效果 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-mist/20 backdrop-blur-[2px]" />
      </motion.div>

      {/* 徽章 */}
      <motion.div
        className="text-7xl mb-4"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
      >
        {rank.badge}
      </motion.div>

      {/* 称号 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gold mb-1.5">{rank.title}</h2>
        <div className="flex justify-center gap-1 mb-3">
          {Array.from({ length: rank.stars }).map((_, i) => (
            <motion.span
              key={i}
              className="text-2xl"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.2, type: 'spring' }}
            >
              ⭐
            </motion.span>
          ))}
        </div>
        <p className="text-text-secondary text-base mb-8">{rank.comment}</p>
      </motion.div>

      {/* 三赛道成绩卡片 */}
      <motion.div
        className="glass-card w-full max-w-sm p-5 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-base font-bold text-accent mb-4">📊 赛道成绩总览</h3>
        <div className="space-y-3">
          {trackData.map((td, i) => (
            <motion.div
              key={td.track}
              className="flex items-center gap-3 bg-[#F1F5F9] rounded-xl p-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.15 }}
            >
              <span className="text-xl">{td.emoji}</span>
              <div className="flex-1 text-left">
                <p className="text-text-primary text-sm font-medium">{td.label}</p>
                <p className="text-text-muted text-xs">
                  {td.stats.correct}/{td.stats.total} 正确
                  {td.stats.correct === 5 && <span className="text-gold ml-1">⭐完美</span>}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-accent">{td.score}</p>
                <p className="text-text-muted text-xs">分</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 总计 */}
        <div className="border-t border-[#E8DDD0] mt-4 pt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-gold">{totalScore}</p>
            <p className="text-text-muted text-xs">总分</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-correct">{Math.round(correctRate * 100)}%</p>
            <p className="text-text-muted text-xs">正确率</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-text-primary">{totalCorrect}/{totalAnswered}</p>
            <p className="text-text-muted text-xs">正确/总题</p>
          </div>
        </div>
      </motion.div>

      {/* 局长评语 */}
      <motion.div
        className="glass-card w-full max-w-sm p-6 mb-8 text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl">👨‍💼</span>
          <div>
            <p className="text-text-muted text-sm mb-1.5">局长的评价</p>
            <p className="text-text-secondary text-base leading-relaxed">
              {correctRate >= 0.9
                ? '出色的表现，探员！你展现出了非凡的洞察力，三个赛道都难不倒你。'
                : correctRate >= 0.7
                  ? '表现不错！你已经有了一双识别真相的眼睛，继续磨练会更出色。'
                  : correctRate >= 0.5
                    ? '良好的开端！辨别真假是一项需要练习的技能，你正在进步。'
                    : '每一位伟大的探员都从基础开始。今天的每一道题，都让你更接近真相。'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 双按钮 */}
      <motion.div
        className="w-full max-w-sm space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <Button variant="primary" className="w-full text-lg" onClick={handleChallenge}>
          🔥 接受AI挑战
        </Button>
        <p className="text-text-muted text-sm">进入第二关，挑战AI生成的图片和消息</p>

        <div className="pt-3">
          <Button variant="secondary" className="w-full" onClick={handleReport}>
            📊 查看报告并退出
          </Button>
          <p className="text-text-muted text-sm mt-1.5">查看你的媒体素养评估报告</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
