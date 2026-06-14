import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '../hooks/useGame'
import { PRE_TEST_URL, PRE_TEST_QR } from '../config/survey'
import Button from '../components/Button'

export default function PreTestGuidePage() {
  const navigate = useNavigate()
  const { state, goTo } = useGame()

  const handleContinue = () => {
    goTo('trackSelect')
    navigate('/select')
  }

  return (
    <motion.div
      className="page-container items-center justify-center text-center py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标题 */}
      <motion.div
        className="mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-text-muted text-sm mb-1">真相解码局 · 实验前测</p>
        <h2 className="text-2xl font-bold text-accent">📋 前测问卷</h2>
      </motion.div>

      {/* 说明卡片 */}
      <motion.div
        className="glass-card w-full max-w-md lg:max-w-2xl p-6 mb-6 text-left"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl">👋</span>
          <div>
            <p className="text-text-primary font-medium mb-1">
              你好，{state.playerName}探员！
            </p>
            <p className="text-text-secondary text-sm leading-relaxed">
              在开始任务之前，请先完成一份简短的媒介素养前测问卷。
              这份问卷帮助我们了解你的初始水平，预计耗时 <strong>3分钟</strong>。
            </p>
          </div>
        </div>

        <div className="bg-gold/10 border border-gold/20 rounded-lg p-3 mb-3">
          <p className="text-text-muted text-xs leading-relaxed">
            🏷️ <strong>你的参与者编号：</strong>
            <span className="text-gold text-lg font-bold ml-1">{state.participantId}</span>
          </p>
          <p className="text-text-muted text-xs mt-1">
            ⚠️ 请在问卷中<strong>「参与者编号」</strong>一栏填写此编号
          </p>
        </div>
        <div className="bg-accent/5 border border-accent/10 rounded-lg p-3">
          <p className="text-text-muted text-xs leading-relaxed">
            💡 <strong>提示：</strong>问卷数据仅用于学术研究，请放心如实作答。
            完成后点击下方按钮进入游戏。
          </p>
        </div>
      </motion.div>

      {/* 问卷链接 + 二维码 */}
      <motion.div
        className="w-full max-w-md lg:max-w-2xl space-y-4 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* 二维码（电脑端显示） */}
        <div className="hidden lg:flex lg:flex-col lg:items-center glass-card p-6">
          <p className="text-text-secondary text-base mb-4">📱 扫描二维码打开问卷</p>
          {PRE_TEST_QR ? (
            <img
              src={PRE_TEST_QR}
              alt="前测问卷二维码"
              className="w-48 h-48 lg:w-56 lg:h-56 rounded-lg border border-[#E8DDD0]"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-lg border-2 border-dashed border-[#E8DDD0] flex items-center justify-center">
              <p className="text-text-muted text-xs px-2">请配置二维码图片</p>
            </div>
          )}
        </div>

        {/* 链接按钮 */}
        <a
          href={PRE_TEST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button variant="secondary" className="w-full" onClick={() => {}}>
            🔗 打开前测问卷
          </Button>
        </a>
        <p className="text-text-muted text-xs">
          {/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
            ? '点击上方按钮，在新页面中完成问卷后返回'
            : '点击上方按钮在新标签页打开，完成后回到此页面'}
        </p>
      </motion.div>

      {/* 继续按钮 */}
      <motion.div
        className="w-full max-w-md lg:max-w-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button variant="primary" className="w-full text-lg" onClick={handleContinue}>
          ✅ 已完成问卷，开始游戏
        </Button>
        <p className="text-text-muted text-xs mt-2">
          即将进入赛道选择
        </p>
      </motion.div>
    </motion.div>
  )
}
