import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Track } from '../context/GameContext'

interface TrackCardProps {
  track: Track
  title: string
  color: string
  tagline: string
  tag: string
  avgCorrect: string
  examples: string[]
  onSelect: (track: Track) => void
  /** 是否推荐（后测模式下用于标记推荐相同赛道） */
  recommended?: boolean
}

// 每个赛道的封面图片
const trackCovers: Record<Track, string> = {
  health: '/images/cover-health.jpg',
  culture: '/images/cover-culture.jpg',
  politics: '/images/cover-politics.jpg',
}

// 每个赛道的动画
function HealthAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-12 h-12 mx-auto">
      <motion.div
        className="text-3xl"
        animate={isActive ? { rotate: [0, -15, 15, -10, 0], scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.8, repeat: isActive ? Infinity : 0, repeatDelay: 1.5 }}
      >
        💊
      </motion.div>
      {isActive && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 text-xl text-gold font-bold"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        >
          ？
        </motion.div>
      )}
    </div>
  )
}

function CultureAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-12 h-12 mx-auto">
      <motion.div
        className="text-3xl"
        animate={isActive ? { rotate: [0, 180, 360] } : {}}
        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
      >
        🎭
      </motion.div>
      {isActive && (
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 text-xl text-gold font-bold"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
        >
          ？
        </motion.div>
      )}
    </div>
  )
}

function PoliticsAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative w-12 h-12 mx-auto">
      <motion.div
        className="text-3xl"
        animate={isActive ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 1, repeat: isActive ? Infinity : 0, repeatDelay: 1.5 }}
      >
        🛡️
      </motion.div>
      {isActive && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.3, 0.5, 0.8, 1] }}
        >
          <div className="text-gold font-bold text-xs tracking-wider"
            style={{ textShadow: '0 0 8px rgba(212,168,67,0.8)' }}>
            真相
          </div>
        </motion.div>
      )}
    </div>
  )
}

const trackConfig = {
  health: { Animation: HealthAnimation, border: 'border-teal-500/30', glow: 'shadow-[0_0_30px_rgba(94,234,212,0.15)]' },
  culture: { Animation: CultureAnimation, border: 'border-purple-500/30', glow: 'shadow-[0_0_30px_rgba(192,132,252,0.15)]' },
  politics: { Animation: PoliticsAnimation, border: 'border-blue-500/30', glow: 'shadow-[0_0_30px_rgba(96,165,250,0.15)]' },
}

export default function TrackCard({ track, title, color, tagline, tag, avgCorrect, examples, onSelect, recommended }: TrackCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isTapped, setIsTapped] = useState(false)
  const config = trackConfig[track]
  const coverSrc = trackCovers[track]
  const Animation = config.Animation
  const isActive = isHovered || isTapped

  const handleClick = () => {
    setIsTapped(true)
    setTimeout(() => {
      setIsTapped(false)
      onSelect(track)
    }, 600)
  }

  return (
    <motion.button
      className={`glass-card w-full text-left cursor-pointer touch-manipulation overflow-hidden
        border ${config.border}
        transition-all duration-300
        ${isActive ? `${config.glow} shadow-[0_0_36px_rgba(212,168,67,0.25)] scale-[1.02] -translate-y-1` : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
    >
      {/* 顶部封面图区域 */}
      <div className="relative aspect-video overflow-hidden">
        {/* 封面图片 */}
        <img
          src={coverSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* 悬浮时的动画叠加 */}
        {isActive && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Animation isActive={isActive} />
          </motion.div>
        )}

        {/* 推荐标签 */}
        {recommended && (
          <div className="absolute top-2 left-2 bg-gold/90 text-[#0A1628] text-[10px] font-bold px-2 py-0.5 rounded-full">
            ✅ 推荐
          </div>
        )}

        {/* 难度标签 */}
        <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white/70 text-[10px] px-2 py-0.5 rounded-full">
          {avgCorrect} 平均正确率
        </div>
      </div>

      {/* 卡片信息 */}
      <div className="p-5">
        {/* 标题 */}
        <h3 className="text-lg font-bold mb-1" style={{ color }}>
          {title}
        </h3>
        <p className="text-text-muted text-sm mb-2">{tagline}</p>

        {/* 示例 */}
        <div className="text-text-muted text-sm space-y-0.5 mb-3">
          {examples.map((ex, i) => (
            <p key={i} className="truncate opacity-70">"{ex}"</p>
          ))}
        </div>

        {/* 底部标签 */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
          <span className="text-sm px-2.5 py-1 rounded-full bg-[#F1F5F9]" style={{ color }}>
            🏷️ {tag}
          </span>
          <AnimatePresence>
            {isActive && (
              <motion.span
                className="text-gold text-sm font-medium"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                进入 →
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.button>
  )
}
