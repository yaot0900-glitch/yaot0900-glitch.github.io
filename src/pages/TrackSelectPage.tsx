import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import TrackCard from '../components/TrackCard'
import type { Track } from '../context/GameContext'

const TRACKS = [
  {
    track: 'health' as Track,
    title: '🏥 健康科普',
    color: '#5EEAD4',
    tagline: '这些养生谣言，骗了你多少年？',
    tag: '谣言高发区',
    avgCorrect: '47%',
    examples: ['喝柠檬水能杀死癌细胞？', 'WiFi辐射致癌是真的吗？'],
  },
  {
    track: 'culture' as Track,
    title: '🎭 文化娱乐',
    color: '#C084FC',
    tagline: '历史传闻、名人名言……你信的，都是真的吗？',
    tag: '文化求真',
    avgCorrect: '52%',
    examples: ['李白真的说过这句话吗？', '这件"国宝"是真文物吗？'],
  },
  {
    track: 'politics' as Track,
    title: '🏛️ 时政社会',
    color: '#60A5FA',
    tagline: '你看到的，是真相还是精心设计的叙事？',
    tag: '信息深水区',
    avgCorrect: '38%',
    examples: ['突发！某国宣布...', '这张新闻照片是真的吗？'],
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

export default function TrackSelectPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') // 'post' = 后测赛道选择
  const isPostTestMode = mode === 'post'

  const { selectTrack, startPostTest, state } = useGame()

  const handleSelect = (track: Track) => {
    if (isPostTestMode) {
      startPostTest(track)
    } else {
      selectTrack(track)
    }
    navigate('/quiz')
  }

  const doneCount = state.completedTracks.length
  const preTestTrack = state.preTestTrack

  return (
    <motion.div
      className="page-container items-center py-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* 页面标题 */}
      <motion.div className="text-center mb-8" variants={item}>
        <p className="text-text-muted text-sm mb-1">
          {isPostTestMode ? '真相解码局 · 后测挑战' : '真相解码局 · 第一关'}
        </p>
        <h2 className="text-2xl font-bold">
          {isPostTestMode ? '选择后测赛道' : '请选择任务赛道'}
        </h2>

        {isPostTestMode ? (
          <div className="mt-3 space-y-1">
            <p className="text-text-muted text-xs">
              后测与前测赛道保持一致，确保对比准确
            </p>
            {preTestTrack && (
              <p className="text-gold text-xs">
                💡 推荐选择与前测相同的赛道，对比结果更精准
              </p>
            )}
          </div>
        ) : (
          <p className="text-text-muted text-xs mt-2">
            选择一个你感兴趣的赛道，完成 5 题即可过关
          </p>
        )}
      </motion.div>

      {/* 赛道列表 */}
      {isPostTestMode && preTestTrack && (
        <motion.div
          className="w-full max-w-sm mb-4"
          variants={item}
        >
          <div className="bg-gold/5 border border-gold/10 rounded-xl p-3 text-center">
            <p className="text-gold text-sm">
              📌 你前测选择的是「{TRACKS.find(t => t.track === preTestTrack)?.title}」
            </p>
            <p className="text-text-muted text-xs mt-1">
              选择同一赛道：对比更准确 | 选择不同赛道：会标注⚠️偏差提示
            </p>
          </div>
        </motion.div>
      )}

      {/* 三张赛道卡片 — 竖排 */}
      <div className="w-full max-w-sm lg:max-w-lg space-y-7">
        {TRACKS.map((t) => {
          const isDone = state.completedTracks.includes(t.track)
          const isRecommended = isPostTestMode && preTestTrack === t.track

          return (
            <motion.div key={t.track} variants={item}>
              {isDone && !isPostTestMode ? (
                <div className="glass-card w-full p-6 text-center opacity-60">
                  <div className="aspect-[4/3] flex items-center justify-center bg-[#F1F5F9] rounded-xl mb-3">
                    <span className="text-4xl">✅</span>
                  </div>
                  <p className="text-text-muted text-base">{t.title} — 已完成</p>
                  <p className="text-text-muted text-sm mt-1">可继续选择其他赛道</p>
                </div>
              ) : (
                <TrackCard
                  track={t.track}
                  title={t.title}
                  color={t.color}
                  tagline={t.tagline}
                  tag={t.tag}
                  avgCorrect={t.avgCorrect}
                  examples={t.examples}
                  onSelect={handleSelect}
                  recommended={isRecommended}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* 底部提示 */}
      {!isPostTestMode && (
        <motion.p
          className="text-text-muted text-xs text-center mt-6"
          variants={item}
        >
          💡 选一个最感兴趣的赛道开始吧
        </motion.p>
      )}
    </motion.div>
  )
}
