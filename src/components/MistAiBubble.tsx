import { motion } from 'framer-motion'

const ENCOURAGEMENTS = [
  '别灰心，这条消息当初连我也被骗了。',
  '没事的，每错一次，你就更懂它的套路。',
  '我也曾经分不清真假……但你比我进步快多了。',
  '犯错是学习的一部分，探员。你已经很棒了。',
  '嘿，能走到这里，说明你比大多数人都警觉。',
]

const PRAISES = [
  '厉害！你的判断力越来越强了。',
  '看来这些假消息对你来说太简单了？',
  '干得漂亮！真相在你面前根本藏不住。',
]

interface MistAiBubbleProps {
  isCorrect: boolean
}

export default function MistAiBubble({ isCorrect }: MistAiBubbleProps) {
  const message = isCorrect
    ? PRAISES[Math.floor(Math.random() * PRAISES.length)]
    : ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]

  return (
    <motion.div
      className="flex items-start gap-2"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* 头像 */}
      <div className="w-8 h-8 rounded-full bg-mist/20 border border-mist/30 flex items-center justify-center text-sm flex-shrink-0">
        🌫️
      </div>
      {/* 气泡 */}
      <div className="bg-mist/10 border border-mist/20 rounded-2xl rounded-tl-sm px-3 py-2">
        <p className="text-mist text-xs leading-relaxed">{message}</p>
        <p className="text-text-muted text-[10px] mt-1">—— 迷雾AI</p>
      </div>
    </motion.div>
  )
}
