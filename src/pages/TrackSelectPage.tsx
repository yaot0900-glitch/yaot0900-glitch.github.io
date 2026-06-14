import { useNavigate } from 'react-router-dom'
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
  const { selectTrack, state } = useGame()

  const handleSelect = (track: Track) => {
    if (state.completedTracks.includes(track)) return
    selectTrack(track)
    navigate('/quiz')
  }

  const remainingTracks = TRACKS.filter(t => !state.completedTracks.includes(t.track))
  const completedTracks = TRACKS.filter(t => state.completedTracks.includes(t.track))
  const doneCount = state.completedTracks.length

  return (
    <motion.div
      className="page-container items-center py-8"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* 页面标题 */}
      <motion.div className="text-center mb-8" variants={item}>
        <p className="text-text-muted text-sm mb-1">真相解码局 · 第一关</p>
        <h2 className="text-2xl font-bold">
          {doneCount === 0
            ? '请选择任务赛道'
            : `已完成 ${doneCount}/3 赛道 · 继续选择`}
        </h2>
        <p className="text-text-muted text-xs mt-2">
          {doneCount === 0
            ? '选择一个你感兴趣的赛道开始吧。完成全部3个赛道即可通关。'
            : doneCount === 2
              ? '还剩最后一个赛道，加油！'
              : `还有 ${3 - doneCount} 个赛道等待你的挑战`}
        </p>
      </motion.div>

      {/* 进度条 */}
      <motion.div className="w-full max-w-sm lg:max-w-lg mb-6" variants={item}>
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`flex-1 h-2 rounded-full transition-colors ${
                i < doneCount ? 'bg-accent' : 'bg-[#E8DDD0]'
              }`}
            />
          ))}
        </div>
      </motion.div>

      {/* 已完成赛道 */}
      {completedTracks.length > 0 && (
        <motion.div className="w-full max-w-sm lg:max-w-lg mb-6" variants={item}>
          <p className="text-text-muted text-xs mb-3 text-center">✅ 已完成</p>
          <div className="space-y-3">
            {completedTracks.map(t => (
              <div
                key={t.track}
                className="glass-card w-full p-4 text-center opacity-60"
              >
                <div className="flex items-center gap-3 justify-center">
                  <span className="text-xl">{t.title.split(' ')[0]}</span>
                  <span className="text-text-muted text-base">{t.title.split(' ')[1]}</span>
                  <span className="text-correct text-sm">已完成</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 可选赛道 */}
      <div className="w-full max-w-sm lg:max-w-lg space-y-7">
        {TRACKS.filter(t => !state.completedTracks.includes(t.track)).map((t) => (
          <motion.div key={t.track} variants={item}>
            <TrackCard
              track={t.track}
              title={t.title}
              color={t.color}
              tagline={t.tagline}
              tag={t.tag}
              avgCorrect={t.avgCorrect}
              examples={t.examples}
              onSelect={handleSelect}
              recommended={remainingTracks.length === 1}
            />
          </motion.div>
        ))}
      </div>

      {/* 底部提示 */}
      <motion.p
        className="text-text-muted text-xs text-center mt-6"
        variants={item}
      >
        {remainingTracks.length > 1
          ? '💡 选择一个赛道开始吧，顺序由你决定'
          : '💡 最后一关，加油！'}
      </motion.p>
    </motion.div>
  )
}
