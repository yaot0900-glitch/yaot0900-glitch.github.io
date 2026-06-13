import { motion } from 'framer-motion'
import MistAiBubble from './MistAiBubble'

interface FeedbackModalProps {
  isCorrect: boolean
  explanation: string        // 辨别依据
  score: number
  onNext: () => void
}

export default function FeedbackModal({ isCorrect, explanation, score, onNext }: FeedbackModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onNext} />

      {/* 弹窗内容 */}
      <motion.div
        className="relative glass-card w-full max-w-lg mx-4 mb-8 sm:mb-0 p-12 overflow-hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {/* 顶部装饰线 */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 ${isCorrect ? 'bg-correct' : 'bg-wrong'}`} />

        {/* 标题 */}
        <div className="text-center mb-6">
          <motion.div
            className="text-6xl mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
          >
            {isCorrect ? '🎉' : '🔍'}
          </motion.div>
          <h3 className={`text-3xl font-bold ${isCorrect ? 'text-correct' : 'text-wrong'}`}>
            {isCorrect ? '真相确认！' : '让我们重新看看'}
          </h3>
        </div>

        {/* 答对：知识巩固 */}
        {isCorrect && (
          <div className="mb-7">
            <div className="bg-correct/5 border border-correct/20 rounded-xl p-7">
              <p className="text-correct text-lg font-medium mb-2">💡 为什么这是真的：</p>
              <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-line">{explanation}</p>
            </div>
            <div className="mt-6 text-center">
              <span className="text-gold font-bold text-2xl">+{score} 分</span>
              <p className="text-text-muted text-base mt-2">继续加油！你的判断力正在提升 ✨</p>
            </div>
          </div>
        )}

        {/* 答错：安抚 + 识别技巧 */}
        {!isCorrect && (
          <div className="mb-7">
            {/* 安抚语 */}
            <motion.p
              className="text-text-secondary text-lg text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              😊 没关系，这条消息确实很有迷惑性
            </motion.p>

            {/* 识破指南 */}
            <div className="bg-wrong/5 border border-wrong/20 rounded-xl p-7">
              <p className="text-wrong text-lg font-medium mb-2">🧐 识破技巧：</p>
              <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-line">{explanation}</p>
            </div>

            {/* 迷雾AI鼓励 */}
            <div className="mt-6">
              <MistAiBubble isCorrect={false} />
            </div>
          </div>
        )}

        {/* 下一题按钮 */}
        <motion.button
          className={`btn-primary w-full ${isCorrect ? '' : '!bg-gradient-to-br !from-wrong !to-amber-400 !text-[#1a1a2e]'}`}
          onClick={onNext}
          whileTap={{ scale: 0.98 }}
        >
          下一题 →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
