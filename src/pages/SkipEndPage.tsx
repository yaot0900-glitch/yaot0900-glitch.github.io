import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import Button from '../components/Button'

export default function SkipEndPage() {
  const navigate = useNavigate()
  const { state, totalScore, correctRate } = useGame()

  return (
    <motion.div
      className="page-container items-center justify-center text-center py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 迷雾渐散 */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 2 }}
      >
        <div className="absolute inset-0 bg-mist/15 backdrop-blur-[1px]" />
      </motion.div>

      {/* 徽章 */}
      <motion.div
        className="text-6xl mb-4"
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.3 }}
      >
        🏅
      </motion.div>

      <motion.h2
        className="text-2xl font-bold text-gold mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        初级真相探员
      </motion.h2>

      <motion.p
        className="text-text-secondary text-base mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {state.playerName}，你已完成基础训练任务。
      </motion.p>

      {/* 得分概览 */}
      <motion.div
        className="glass-card w-full max-w-sm p-6 mb-8 grid grid-cols-2 gap-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="text-center">
          <p className="text-3xl font-bold text-gold">{totalScore}</p>
          <p className="text-text-muted text-sm">总分</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-correct">{Math.round(correctRate * 100)}%</p>
          <p className="text-text-muted text-sm">正确率</p>
        </div>
      </motion.div>

      {/* 迷雾AI寄语 */}
      <motion.div
        className="glass-card w-full max-w-sm p-6 mb-8 text-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="flex items-start gap-4">
          <span className="text-3xl">🌫️</span>
          <div>
            <p className="text-mist text-sm mb-2">迷雾AI的寄语</p>
            <p className="text-text-secondary text-base leading-relaxed">
              "嗨，我是迷雾。当你准备好时，我随时在这里等你。记住：辨别真假不是天赋，是每个人都能学会的能力。你已经迈出了最重要的第一步。"
            </p>
          </div>
        </div>
      </motion.div>

      {/* 小贴士 */}
      <motion.div
        className="glass-card w-full max-w-sm p-6 mb-8 bg-mist/5 border-mist/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <p className="text-mist text-sm mb-2">🎁 获得「AI识别小贴士」</p>
        <p className="text-text-secondary text-base">
          💡 看手指：AI经常画错手指数量，这是最快的识别方法
        </p>
      </motion.div>

      {/* 按钮组 */}
      <motion.div
        className="w-full max-w-sm space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <Button
          variant="primary"
          className="w-full"
          onClick={() => navigate('/report')}
        >
          📊 查看我的报告
        </Button>
        <button
          className="text-text-muted text-base underline underline-offset-4 hover:text-text-secondary transition-colors"
          onClick={() => navigate('/level2-image')}
        >
          我还是想挑战AI！
        </button>
      </motion.div>
    </motion.div>
  )
}
