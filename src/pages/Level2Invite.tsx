import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import Button from '../components/Button'

type HookPhase = 'glitch' | 'challenge' | 'files' | 'map' | 'choice'

export default function Level2Invite() {
  const navigate = useNavigate()
  const { skipLevel2 } = useGame()
  const [phase, setPhase] = useState<HookPhase>('glitch')

  // 自动推进
  useEffect(() => {
    const timers = [
      { from: 'glitch', to: 'challenge', delay: 2500 },
      { from: 'challenge', to: 'files', delay: 5000 },
      { from: 'files', to: 'map', delay: 5000 },
    ]
    for (const t of timers) {
      if (phase === t.from) {
        const timer = setTimeout(() => setPhase(t.to as HookPhase), t.delay)
        return () => clearTimeout(timer)
      }
    }
    if (phase === 'map') {
      const timer = setTimeout(() => setPhase('choice'), 3500)
      return () => clearTimeout(timer)
    }
  }, [phase])

  const handleAccept = () => {
    navigate('/level2-image')
  }

  const handleSkip = () => {
    skipLevel2()
    navigate('/skip-end')
  }

  return (
    <div className="page-container items-center justify-center text-center min-h-[100dvh] relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* 第一层：信号干扰 */}
        {phase === 'glitch' && (
          <motion.div
            key="glitch"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ x: [0, -4, 6, -3, 0], opacity: [1, 0.7, 1, 0.8, 1] }}
              transition={{ duration: 0.3, repeat: 3 }}
            >
              ⚡
            </motion.div>
            <motion.p
              className="text-wrong font-bold text-lg mb-2"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 0.2, repeat: 5 }}
            >
              警告：检测到异常加密信号
            </motion.p>
            <div className="w-full max-w-xs mx-auto bg-black/40 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-wrong"
                initial={{ width: '0%' }}
                animate={{ width: ['0%', '47%', '78%', '100%'] }}
                transition={{ duration: 2, times: [0, 0.4, 0.7, 1] }}
              />
            </div>
            <p className="text-text-muted text-xs mt-2">解码中...</p>
          </motion.div>
        )}

        {/* 第二层：迷雾AI挑衅 */}
        {phase === 'challenge' && (
          <motion.div
            key="challenge"
            className="w-full max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="p-7 bg-[#0F1B2D] border border-[#8B5CF6]/30 rounded-2xl text-left font-mono">
              <div className="flex items-center gap-2 mb-4 text-mist text-sm">
                <span className="w-2 h-2 rounded-full bg-mist animate-pulse" />
                <span>迷雾AI · 加密频道</span>
              </div>
              <p className="text-correct text-base mb-2">&gt; 不错嘛，探员。</p>
              <p className="text-correct text-base mb-2">&gt; 那些低级假消息确实难不倒你。</p>
              <p className="text-correct text-base mb-2">&gt; 但是……</p>
              <motion.p
                className="text-mist text-base mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                &gt; 你以为这就结束了？
              </motion.p>
              <motion.p
                className="text-mist text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                &gt; 我真正的作品，你根本分辨不出来 😈
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* 第三层：机密档案解锁 */}
        {phase === 'files' && (
          <motion.div
            key="files"
            className="w-full max-w-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass-card p-7 border-gold/20">
              <motion.div
                className="text-center mb-4"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <span className="text-5xl">🔒</span>
                <motion.span
                  className="text-5xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  → 🔓
                </motion.span>
              </motion.div>
              <p className="text-gold text-base font-bold mb-3 tracking-wider">TOP SECRET / 绝密</p>
              <div className="text-left space-y-1.5 text-text-secondary text-sm">
                <p>📁 迷雾AI核心威胁评估</p>
                <p>📁 AI生成内容识别指南</p>
                <p>📁 高级探员认证考核</p>
              </div>
              <p className="text-gold text-sm mt-4">
                "完成考核的探员，将获得高级媒体素养认证徽章"
              </p>
            </div>
          </motion.div>
        )}

        {/* 第四层：城市地图 */}
        {phase === 'map' && (
          <motion.div
            key="map"
            className="w-full max-w-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-5xl mb-3">🏙️</div>
            <motion.div
              className="w-16 h-16 mx-auto rounded-full bg-mist/20 border border-mist/40 flex items-center justify-center text-2xl mb-3"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ❓
            </motion.div>
            <p className="text-text-secondary text-base">
              城市迷雾已经清除……但城中心的AI数据中心仍在散发紫色迷雾。
            </p>
            <p className="text-mist text-sm mt-3">
              「AI 核心 — 需要高级探员权限」
            </p>
          </motion.div>
        )}

        {/* 第五层：选择 */}
        {phase === 'choice' && (
          <motion.div
            key="choice"
            className="w-full max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-text-secondary text-base mb-8">
              探员，迷雾AI的核心就在眼前。接受AI辨别特训吗？
            </p>
            <div className="space-y-4">
              <Button variant="primary" className="w-full text-lg" onClick={handleAccept}>
                🔥 接受挑战
              </Button>
              <button
                className="text-text-muted text-base underline underline-offset-4 hover:text-text-secondary transition-colors"
                onClick={handleSkip}
              >
                暂时跳过，先看报告
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
