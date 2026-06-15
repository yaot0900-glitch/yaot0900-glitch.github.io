import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../hooks/useGame'

const STORY_LINES = [
  '2046 年，代号「迷雾」的超级 AI 失控了。',
  '它每天生成数百万条以假乱真的虚假信息——',
  '伪造的新闻、AI 假照片、似是而非的谣言……',
  '这些「信息病毒」正在社交媒体上疯狂扩散。',
  '',
  '为了对抗这场信息灾难，',
  '国际社会秘密成立了——',
  '',
  '🕵️  真 相 解 码 局  🕵️',
  '',
  '而你，就是今天新报到的真相探员。',
]

export default function HomePage() {
  const navigate = useNavigate()
  const { setName, initGame, state } = useGame()
  const [displayedLines, setDisplayedLines] = useState(0)
  const [nameInput, setNameInput] = useState(state.playerName || '')
  const [showInput, setShowInput] = useState(false)
  const [error, setError] = useState('')

  // 逐行显示故事
  useEffect(() => {
    if (displayedLines < STORY_LINES.length) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => prev + 1)
      }, displayedLines === 0 ? 600 : 400)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => setShowInput(true), 500)
      return () => clearTimeout(timer)
    }
  }, [displayedLines])

  const handleStart = useCallback(() => {
    const trimmed = nameInput.trim()
    if (!trimmed) {
      setError('请输入你的探员代号')
      return
    }
    if (trimmed.length > 10) {
      setError('代号不要超过10个字哦')
      return
    }
    setError('')
    setName(trimmed)
    initGame()
    navigate('/pre-test')
  }, [nameInput, setName, initGame, navigate])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleStart()
  }

  return (
    <motion.div
      className="page-container items-center justify-center text-center min-h-[100dvh] relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 背景装饰 — 微弱粒子 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-gold/30 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* 机密档案标识 */}
      <motion.div
        className="mb-8 lg:mb-16"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <div className="inline-block border border-gold/30 rounded-lg px-4 py-2 mb-2">
          <span className="text-gold text-sm lg:text-2xl tracking-[0.3em] font-medium">TOP SECRET</span>
        </div>
        <div className="text-text-muted text-sm lg:text-2xl tracking-wider">机密档案 · 探员入职文件</div>
      </motion.div>

      {/* 故事文字 */}
      <div className="glass-card w-full max-w-sm lg:max-w-3xl lg:px-16 p-8 mb-12 lg:mb-24 min-h-[300px] text-left">
        {STORY_LINES.slice(0, displayedLines).map((line, i) => (
          <motion.p
            key={i}
            className={`mb-1.5 leading-relaxed ${
              line.includes('真相解码局') || line.includes('🕵️')
                ? 'text-gold text-3xl font-bold text-center my-4'
                : line === ''
                  ? 'h-6'
                  : 'text-text-secondary text-xl'
            }`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {line || ' '}
          </motion.p>
        ))}
        {displayedLines < STORY_LINES.length && (
          <span className="inline-block w-2 h-4 bg-gold/60 animate-pulse ml-0.5 align-middle" />
        )}
      </div>

      {/* 输入区域 */}
      {showInput && (
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <label className="block text-text-secondary text-base lg:text-2xl mb-2">
            请输入你的探员代号
          </label>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => { setNameInput(e.target.value); setError('') }}
            onKeyDown={handleKeyDown}
            placeholder="例如：真相猎手"
            maxLength={10}
            autoFocus
            className="w-full bg-white/60 border border-[#D4C8B0] rounded-2xl px-5 py-4 text-center text-text-primary text-lg lg:text-2xl placeholder:text-text-muted focus:outline-none focus:border-primary/60 focus:bg-white/80 focus:shadow-[0_0_20px_rgba(212,168,67,0.2)] transition-all"
          />
          {error && (
            <p className="text-wrong text-sm mt-2">{error}</p>
          )}
          <button
            className="btn-primary w-full mt-6 text-xl lg:text-2xl"
            onClick={handleStart}
          >
            接受任务
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
