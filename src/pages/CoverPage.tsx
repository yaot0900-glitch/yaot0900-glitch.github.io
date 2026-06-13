import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const MOON_X = 50   // 月亮在背景图中的水平位置（百分比）
const MOON_Y = 28   // 月亮在背景图中的垂直位置（百分比）

// 随机漂浮光点
function useParticles(count: number) {
  return useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: 15 + Math.random() * 70,
      size: 2 + Math.random() * 4,
      duration: 4 + Math.random() * 8,
      delay: Math.random() * 6,
      drift: (Math.random() - 0.5) * 40,
    })), [count])
}

// 扫描线
function useScanLines(count: number) {
  return useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: (i / count) * 100,
      opacity: 0.012 + Math.random() * 0.02,
    })), [count])
}

export default function CoverPage() {
  const navigate = useNavigate()
  const [showContent, setShowContent] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const particles = useParticles(20)
  const scanLines = useScanLines(30)

  useEffect(() => {
    const t1 = setTimeout(() => setShowContent(true), 500)
    const t2 = setTimeout(() => setShowButton(true), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const handleEnter = useCallback(() => {
    navigate('/home')
  }, [navigate])

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0B1A30]">
      {/* ===== 背景图层 ===== */}
      {/* 深色底层 */}
      <div className="absolute inset-0 bg-[#0B1A30]" />

      {/* 用户封面图 */}
      <img
        src="/images/cover-bg.jpg"
        alt="真相解码局封面"
        onLoad={() => setImgLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: imgLoaded ? 1 : 0 }}
      />

      {/* 图片未加载时的占位渐变 */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#A8C8D8] via-[#B0D0E0] to-[#B8D8E8]" />
      )}

      {/* ===== 月亮发光脉冲（CSS滤镜叠加层） ===== */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${MOON_X}%`,
          top: `${MOON_Y}%`,
          width: '260px',
          height: '260px',
          transform: 'translate(-50%, -50%)',
          animation: 'moonPulse 3.5s ease-in-out infinite',
          background: 'radial-gradient(circle, rgba(255,220,150,0.25) 0%, rgba(255,200,100,0.08) 40%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* ===== 光束 — 从月亮向下照射，左右摆动 ===== */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${MOON_X}%`,
          top: `${MOON_Y + 2}%`,
          width: '380px',
          height: '550px',
          transformOrigin: 'top center',
          animation: 'beamSwing 6s ease-in-out infinite',
          background: `
            linear-gradient(
              180deg,
              rgba(255, 220, 150, 0.22) 0%,
              rgba(255, 200, 120, 0.10) 25%,
              rgba(255, 180, 100, 0.04) 50%,
              transparent 80%
            )
          `,
          clipPath: 'polygon(47% 0%, 53% 0%, 92% 100%, 8% 100%)',
        }}
      />

      {/* 次要光束（更宽更淡，错开相位） */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${MOON_X}%`,
          top: `${MOON_Y + 2}%`,
          width: '540px',
          height: '650px',
          transformOrigin: 'top center',
          animation: 'beamSwing 8s ease-in-out infinite',
          animationDelay: '-1.5s',
          background: `
            linear-gradient(
              180deg,
              rgba(255, 220, 150, 0.06) 0%,
              rgba(255, 200, 120, 0.02) 30%,
              transparent 70%
            )
          `,
          clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* ===== 金色漂浮光点 ===== */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.left}%`,
            bottom: '15%',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `radial-gradient(circle, rgba(255,220,140,0.8) 0%, rgba(255,180,80,0.3) 40%, transparent 70%)`,
            boxShadow: '0 0 6px rgba(255,200,100,0.5)',
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            '--drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* ===== 扫描线 ===== */}
      {scanLines.map(line => (
        <div
          key={line.id}
          className="absolute left-0 right-0 h-px bg-white pointer-events-none"
          style={{ top: `${line.top}%`, opacity: line.opacity }}
        />
      ))}

      {/* ===== 底部渐变遮罩（让文字更清晰） ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0B1A30]/80 to-transparent pointer-events-none" />

      {/* ===== 标题和按钮（屏幕居中） ===== */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100dvh] px-6">
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* 机密标识 */}
              <motion.div
                className="mb-4"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-[#D4A843]/60 text-sm tracking-[0.4em] font-medium">
                  TOP SECRET · 机密档案
                </span>
              </motion.div>

              {/* 标题 — 逐字浮现 */}
              <div className="text-center mb-2">
                {['真', '相', '解', '码', '局'].map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block text-6xl sm:text-7xl font-black text-[#F0D878] leading-relaxed"
                    style={{ textShadow: '0 0 50px rgba(240,216,120,0.4), 0 0 100px rgba(212,168,67,0.2)' }}
                    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: 'easeOut' }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* 副标题 */}
              <motion.p
                className="text-[#94A3B8] text-base lg:text-2xl tracking-[0.25em] mb-3 lg:mb-5 lg:leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
              >
                —— 迷雾危机 ——
              </motion.p>

              {/* 金线 */}
              <motion.div
                className="w-36 h-px bg-gradient-to-r from-transparent via-[#D4A843]/60 to-transparent mb-6"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 1.7, duration: 0.8 }}
              />

              {/* 标语 */}
              <motion.p
                className="text-[#94A3B8]/70 text-sm lg:text-xl tracking-wider mb-10 lg:mb-14 lg:leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0, duration: 0.6 }}
              >
                信息迷雾中，真相由你守护
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 开始按钮 */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* 脉冲光环 */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-[#D4A843]/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl bg-[#D4A843]/15"
                animate={{ scale: [1, 1.9, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
              />

              <button
                onClick={handleEnter}
                className="relative bg-gradient-to-br from-[#D4A843] to-[#F0D878] text-[#051020] font-bold text-lg px-12 py-4 rounded-xl shadow-lg hover:shadow-[#D4A843]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                style={{ boxShadow: '0 0 50px rgba(212,168,67,0.4), 0 0 100px rgba(212,168,67,0.15)' }}
              >
                <span className="mr-2">🔍</span>
                开始调查
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 角落标识 */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 pointer-events-none">
        <p className="text-white/20 text-[10px] tracking-widest">
          © 真相解码局 · 国际信息安全联合会
        </p>
      </div>
    </div>
  )
}
