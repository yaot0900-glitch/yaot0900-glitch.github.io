import { useEffect, useState, useRef } from 'react'

interface MobileStatusBarProps {
  seconds: number
  running: boolean
  onTimeout: () => void
  credibility: number
  maxCredibility?: number
}

export default function MobileStatusBar({ seconds, running, onTimeout, credibility, maxCredibility = 5 }: MobileStatusBarProps) {
  const [remaining, setRemaining] = useState(seconds)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timedOutRef = useRef(false)

  useEffect(() => {
    setRemaining(seconds)
    timedOutRef.current = false
  }, [seconds])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            if (!timedOutRef.current) {
              timedOutRef.current = true
              setTimeout(() => onTimeout(), 0)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, onTimeout])

  const pct = (remaining / seconds) * 100
  const barColor =
    pct > 60 ? 'bg-correct' :
    pct > 25 ? 'bg-wrong' :
    'bg-danger'
  const isUrgent = remaining <= 5 && remaining > 0

  return (
    <div className="flex rounded-2xl overflow-hidden border-2 border-white shadow-md">
      {/* 左：倒计时（深海蓝） */}
      <div className="flex-1 bg-navy text-white px-3 py-2.5 flex items-center gap-2">
        <span className="text-xl flex-shrink-0" style={{ animation: 'clockSpin 4s linear infinite' }}>🕐</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-bold tabular-nums ${isUrgent ? 'text-danger animate-pulse' : ''}`}>
              {remaining}
            </span>
            <span className="text-xs text-white/60">秒</span>
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mt-0.5">
            <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div className="w-[2px] bg-white/40 flex-shrink-0" />

      {/* 右：信誉度（活力橙） */}
      <div className="bg-orange text-white px-3 py-2.5 flex items-center gap-2 flex-shrink-0">
        <span className="text-xl" style={{ animation: 'sunBeat 2s ease-in-out infinite' }}>☀️</span>
        <div>
          <div className="flex gap-0.5">
            {Array.from({ length: maxCredibility }).map((_, i) => (
              <span key={i} className={`text-sm ${i < credibility ? '' : 'opacity-30'}`}>
                {i < credibility ? '⭐' : '☆'}
              </span>
            ))}
          </div>
          <p className="text-xs text-white/65 text-center mt-0.5">{credibility}/{maxCredibility}</p>
        </div>
      </div>
    </div>
  )
}
