import { motion, AnimatePresence } from 'framer-motion'

interface CredibilityStarsProps {
  current: number   // 0-5
  max?: number
}

export default function CredibilityStars({ current, max = 5 }: CredibilityStarsProps) {
  return (
    <div className="card-credibility text-center">
      {/* ☀️ 跳动太阳图标 */}
      <div className="flex justify-center mb-2">
        <span
          className="text-4xl inline-block"
          style={{ animation: 'sunBeat 2s ease-in-out infinite' }}
        >
          ☀️
        </span>
      </div>

      {/* 大号星星 */}
      <div className="flex items-center justify-center gap-2 mb-2">
        {Array.from({ length: max }).map((_, i) => (
          <AnimatePresence key={i}>
            {i < current ? (
              <motion.span
                className="text-3xl"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 90 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                ⭐
              </motion.span>
            ) : (
              <motion.span
                className="text-3xl opacity-25"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ☆
              </motion.span>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* 数字标注 */}
      <p className="text-text-secondary text-base">
        {current} / {max} 颗
      </p>
    </div>
  )
}
