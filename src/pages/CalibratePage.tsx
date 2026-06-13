import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 与 AiImagePage 共享的图片数据（仅路径、标题和当前 flaw 坐标）
interface FlawRef {
  id: string
  x: number
  y: number
  label: string
}

interface ImageRef {
  id: string
  image: string
  title: string
  flaws: FlawRef[]
}

const IMAGE_REFS: ImageRef[] = [
  {
    id: 'img-1', image: '/images/第二关AI图片识别/1.jpg', title: '民国茶馆',
    flaws: [
      { id: 'f1', x: 23.0, y: 37.6, label: '收款码海报' },
      { id: 'f2', x: 41.3, y: 59.7, label: '智能触屏手表①' },
      { id: 'f3', x: 87.5, y: 68.9, label: '怪异轮毂' },
      { id: 'f4', x: 62.5, y: 60.1, label: '智能触屏手表②' },
    ],
  },
  {
    id: 'img-2', image: '/images/第二关AI图片识别/2.jpg', title: '水运码头',
    flaws: [
      { id: 'f1', x: 24.2, y: 68.9, label: '甲板上的手机' },
      { id: 'f2', x: 62.5, y: 55.0, label: '微信收款立牌' },
      { id: 'f3', x: 68.4, y: 22.7, label: '监控摄像头' },
    ],
  },
  {
    id: 'img-3', image: '/images/第二关AI图片识别/3.jpg', title: '公园喂锦鲤',
    flaws: [
      { id: 'f1', x: 43.4, y: 38.3, label: '面包屑悬浮空中' },
      { id: 'f2', x: 28.6, y: 75.4, label: '鱼长了爪子' },
    ],
  },
  {
    id: 'img-4', image: '/images/第二关AI图片识别/4.jpg', title: '十字路口',
    flaws: [
      { id: 'f1', x: 59.4, y: 38.3, label: '红绿灯同时亮' },
      { id: 'f2', x: 82.2, y: 53.5, label: '怪异球形护栏' },
      { id: 'f3', x: 56.9, y: 75.0, label: '路面倒影红灯' },
    ],
  },
  {
    id: 'img-5', image: '/images/第二关AI图片识别/5.jpg', title: '供销社柜台',
    flaws: [
      { id: 'f1', x: 21.2, y: 49.5, label: '口袋里的手机' },
      { id: 'f2', x: 35.7, y: 63.1, label: '美元钞票' },
      { id: 'f3', x: 49.2, y: 72.7, label: '美团外卖标牌' },
      { id: 'f4', x: 66.1, y: 72.0, label: '玻璃罐糖果' },
    ],
  },
  {
    id: 'img-6', image: '/images/第二关AI图片识别/6.jpg', title: '唐代仕女',
    flaws: [
      { id: 'f1', x: 50.5, y: 35.6, label: '蓝牙耳机' },
      { id: 'f2', x: 31.9, y: 48.3, label: '动漫印花团扇' },
    ],
  },
]

interface Mark {
  x: number
  y: number
}

export default function CalibratePage() {
  const [imgIndex, setImgIndex] = useState(0)
  const [marks, setMarks] = useState<Mark[]>([])
  const [showCurrent, setShowCurrent] = useState(true)

  const current = IMAGE_REFS[imgIndex]

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = parseFloat((((e.clientX - rect.left) / rect.width) * 100).toFixed(1))
    const y = parseFloat((((e.clientY - rect.top) / rect.height) * 100).toFixed(1))
    setMarks(prev => [...prev, { x, y }])
  }, [])

  const clearMarks = () => setMarks([])
  const undoMark = () => setMarks(prev => prev.slice(0, -1))

  const prevImage = () => {
    setImgIndex(i => (i - 1 + IMAGE_REFS.length) % IMAGE_REFS.length)
    setMarks([])
  }
  const nextImage = () => {
    setImgIndex(i => (i + 1) % IMAGE_REFS.length)
    setMarks([])
  }

  return (
    <div className="page-container py-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">🔧 AI 图片坐标校准</h2>
          <p className="text-text-muted text-sm mt-1">
            点击图片上的错误位置，记录百分比坐标后告诉我
          </p>
        </div>

        {/* 图片切换 */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            className="btn-secondary !min-h-0 !py-2 !px-4 !text-sm"
            onClick={prevImage}
          >
            ← 上一张
          </button>
          <span className="text-text-primary font-medium">
            {imgIndex + 1} / {IMAGE_REFS.length} — {current.title}
          </span>
          <button
            className="btn-secondary !min-h-0 !py-2 !px-4 !text-sm"
            onClick={nextImage}
          >
            下一张 →
          </button>
        </div>

        {/* 图片区域 — 完全复刻 AiImagePage 的渲染条件 */}
        <div className="flex gap-6">
          {/* 左：图片 */}
          <div className="flex-1">
            <div
              className="relative w-full rounded-2xl border-2 border-[rgba(43,75,124,0.15)] overflow-hidden cursor-crosshair bg-black/5"
              style={{ aspectRatio: '4/3' }}
              onClick={handleImageClick}
            >
              <img
                src={current.image}
                alt={current.title}
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />

              {/* 用户点击的标记 */}
              <AnimatePresence>
                {marks.map((mark, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-accent/80 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg"
                    style={{ left: `${mark.x}%`, top: `${mark.y}%` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    {i + 1}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* 当前代码存储的 flaw 坐标（虚线圆圈） */}
              {showCurrent && current.flaws.map(flaw => (
                <div
                  key={flaw.id}
                  className="absolute w-8 h-8 -ml-4 -mt-4 rounded-full border-2 border-dashed border-correct/70 flex items-center justify-center"
                  style={{ left: `${flaw.x}%`, top: `${flaw.y}%` }}
                >
                  <span className="text-correct text-[9px] font-bold bg-black/40 rounded px-0.5">
                    {flaw.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 右：坐标面板 */}
          <div className="w-64 space-y-4 shrink-0">
            {/* 当前代码坐标（参考） */}
            <div className="glass-card !p-4">
              <label className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCurrent}
                  onChange={e => setShowCurrent(e.target.checked)}
                  className="accent-accent"
                />
                <span className="text-text-secondary">显示当前坐标</span>
              </label>
              <p className="text-text-muted text-xs mb-2">当前代码存储的 flaw：</p>
              {current.flaws.map(f => (
                <div key={f.id} className="text-xs text-text-secondary mb-1">
                  <span className="font-medium text-correct">{f.label}</span>
                  <br />
                  <span className="text-text-muted">x: {f.x}% &nbsp; y: {f.y}%</span>
                </div>
              ))}
            </div>

            {/* 用户标记的坐标 */}
            <div className="glass-card !p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-secondary text-sm font-medium">你的标记</p>
                <div className="flex gap-1">
                  <button
                    className="text-xs text-text-muted hover:text-danger transition-colors"
                    onClick={undoMark}
                    disabled={marks.length === 0}
                  >
                    撤销
                  </button>
                  <button
                    className="text-xs text-text-muted hover:text-danger transition-colors ml-1"
                    onClick={clearMarks}
                    disabled={marks.length === 0}
                  >
                    清空
                  </button>
                </div>
              </div>
              {marks.length === 0 ? (
                <p className="text-text-muted text-xs">点击图片开始标记</p>
              ) : (
                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {marks.map((mark, i) => (
                    <div
                      key={i}
                      className="text-xs bg-accent/10 border border-accent/20 rounded-lg px-2 py-1"
                    >
                      <span className="font-bold text-accent">#{i + 1}</span>
                      {' '}x: <span className="font-mono text-text-primary">{mark.x}%</span>
                      {' '}y: <span className="font-mono text-text-primary">{mark.y}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
