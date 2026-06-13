interface RadarChartProps {
  data: { label: string; value: number; color: string }[]
  size?: number
}

export default function RadarChart({ data, size = 200 }: RadarChartProps) {
  const cx = size / 2
  const cy = size / 2
  const radius = size * 0.35
  const levels = 5
  const angleStep = (2 * Math.PI) / data.length
  const startAngle = -Math.PI / 2 // 从顶部开始

  // 生成多边形点
  const getPolygonPoints = (values: number[]) => {
    return values.map((v, i) => {
      const angle = startAngle + i * angleStep
      const r = (v / 100) * radius
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
    }).join(' ')
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* 背景网格 */}
      {Array.from({ length: levels }).map((_, level) => {
        const r = ((level + 1) / levels) * radius
        const pts = data.map((_, i) => {
          const angle = startAngle + i * angleStep
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
        }).join(' ')
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        )
      })}

      {/* 轴线 */}
      {data.map((_, i) => {
        const angle = startAngle + i * angleStep
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + radius * Math.cos(angle)}
            y2={cy + radius * Math.sin(angle)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        )
      })}

      {/* 数据多边形 */}
      <polygon
        points={getPolygonPoints(data.map(d => d.value))}
        fill="rgba(212,168,67,0.15)"
        stroke="rgba(212,168,67,0.5)"
        strokeWidth="2"
      />

      {/* 数据点 */}
      {data.map((d, i) => {
        const angle = startAngle + i * angleStep
        const r = (d.value / 100) * radius
        return (
          <circle
            key={i}
            cx={cx + r * Math.cos(angle)}
            cy={cy + r * Math.sin(angle)}
            r="4"
            fill={d.color}
            stroke="#D4A843"
            strokeWidth="1"
          />
        )
      })}

      {/* 标签 */}
      {data.map((d, i) => {
        const angle = startAngle + i * angleStep
        const labelR = radius + 22
        const x = cx + labelR * Math.cos(angle)
        const y = cy + labelR * Math.sin(angle)
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill={d.color}
            fontSize="11"
            fontWeight="500"
          >
            {d.label}
          </text>
        )
      })}
    </svg>
  )
}
