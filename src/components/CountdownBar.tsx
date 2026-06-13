import { useEffect, useState, useRef } from 'react'

interface CountdownBarProps {
  seconds: number
  onTimeout: () => void
  running: boolean
}

export default function CountdownBar({ seconds, onTimeout, running }: CountdownBarProps) {
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
    <div className="card-countdown text-center">
      {/* 🕐 转动时钟图标 */}
      <div className="flex justify-center mb-2">
        <span
          className="text-4xl inline-block"
          style={{ animation: 'clockSpin 4s linear infinite' }}
        >
          🕐
        </span>
      </div>

      {/* 大号剩余秒数 */}
      <p className={`text-4xl font-bold tabular-nums mb-2 ${isUrgent ? 'text-danger animate-pulse' : 'text-text-primary'}`}>
        {remaining}
      </p>
      <p className="text-text-muted text-sm mb-3">秒</p>

      {/* 粗进度条 */}
      <div className="w-full h-4 bg-[#D0E4F0] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* 百分比 */}
      <p className="text-text-muted text-sm mt-1.5">{Math.round(pct)}%</p>
    </div>
  )
}
