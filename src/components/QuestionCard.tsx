import type { Track } from '../context/GameContext'

interface QuestionCardProps {
  image?: string
  text: string
  source: string
  questionNumber: number
  totalQuestions: number
  track?: Track
}

// 占位图配置
const placeholderConfig: Record<Track, { gradient: string; emoji: string; label: string }> = {
  health: {
    gradient: 'from-teal-900/40 via-teal-800/30 to-cyan-900/40',
    emoji: '🏥',
    label: '健康科普',
  },
  culture: {
    gradient: 'from-purple-900/40 via-violet-800/30 to-fuchsia-900/40',
    emoji: '🎭',
    label: '文化娱乐',
  },
  politics: {
    gradient: 'from-blue-900/40 via-sky-800/30 to-indigo-900/40',
    emoji: '🏛️',
    label: '时政社会',
  },
}

export default function QuestionCard({ image, text, source, questionNumber, totalQuestions, track }: QuestionCardProps) {
  return (
    <div className="card-question w-full overflow-hidden p-0">
      {/* 顶部来源栏 */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-[#F5F7FC] border-b border-[rgba(43,75,124,0.10)]">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[rgba(43,75,124,0.08)] flex items-center justify-center text-sm">
            📎
          </span>
          <span className="text-text-muted text-sm truncate max-w-[200px]">
            {source || '未知来源'}
          </span>
        </div>
        <span className="text-text-muted text-sm">
          {questionNumber}/{totalQuestions}
        </span>
      </div>

      {/* 图片区域 */}
      {image ? (
        <div className="w-full bg-black/5 overflow-hidden py-4 flex justify-center">
          <img
            src={image}
            alt="题目配图"
            className="w-3/5 h-auto rounded-xl"
            loading="eager"
          />
        </div>
      ) : track ? (
        <div className={`w-full aspect-[4/3] bg-gradient-to-br ${placeholderConfig[track].gradient} flex items-center justify-center relative overflow-hidden`}>
          {/* 装饰性径向光 */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-white/[0.03] blur-3xl" />
          {/* 赛道 emoji */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <span className="text-5xl opacity-50">{placeholderConfig[track].emoji}</span>
            <span className="text-text-muted text-xs">{placeholderConfig[track].label}</span>
          </div>
          {/* 对角线装饰 */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 11px)`,
            }}
          />
        </div>
      ) : (
        <div className="w-full h-2 bg-gradient-to-r from-white/3 via-white/5 to-white/3" />
      )}

      {/* 文字内容 */}
      <div className="p-6">
        <p className="text-text-primary text-lg leading-relaxed whitespace-pre-line">
          {text}
        </p>
      </div>
    </div>
  )
}
