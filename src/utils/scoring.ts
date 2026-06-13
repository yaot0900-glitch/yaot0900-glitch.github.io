/** 评分计算工具 */

/** 单题得分计算 */
export function calcQuestionScore(
  isCorrect: boolean,
  remainingSeconds: number
): { baseScore: number; timeBonus: number; total: number } {
  const baseScore = isCorrect ? 10 : 0
  const timeBonus = isCorrect ? Math.floor(remainingSeconds * 0.5) : 0
  return {
    baseScore,
    timeBonus,
    total: baseScore + timeBonus,
  }
}

/** 赛道结算奖励 */
export function calcTrackBonus(
  trackCorrect: number,
  trackTotal: number,
  credibility: number
): { perfectBonus: number; credibilityBonus: number; total: number } {
  const perfectBonus = trackCorrect === trackTotal ? 20 : 0
  const credibilityBonus = credibility === 5 ? 15 : 0
  return {
    perfectBonus,
    credibilityBonus,
    total: perfectBonus + credibilityBonus,
  }
}

/** 探员评级 */
export type AgentRank = 'legend' | 'senior' | 'detective' | 'learner' | 'apprentice'

export function getRank(totalScore: number): {
  rank: AgentRank
  title: string
  badge: string
  stars: number
  comment: string
} {
  if (totalScore >= 400) {
    return {
      rank: 'legend',
      title: '传奇真相官',
      badge: '🏆',
      stars: 5,
      comment: '迷雾在你面前无所遁形！你是信息辨别的大师。',
    }
  }
  if (totalScore >= 300) {
    return {
      rank: 'senior',
      title: '高级真相侦探',
      badge: '🔮',
      stars: 4,
      comment: '多数虚假信息无法逃过你的眼睛，继续保持！',
    }
  }
  if (totalScore >= 200) {
    return {
      rank: 'detective',
      title: '真相调查员',
      badge: '🔍',
      stars: 3,
      comment: '具备基本的媒体素养，你正在成为高手的路上。',
    }
  }
  if (totalScore >= 100) {
    return {
      rank: 'learner',
      title: '信息素养学员',
      badge: '📚',
      stars: 2,
      comment: '已经入门了！每次练习都让你离真相更近一步。',
    }
  }
  return {
    rank: 'apprentice',
    title: '真相学徒',
    badge: '🌱',
    stars: 1,
    comment: '每一位大师都从这里起步，继续前进吧！',
  }
}

/** 辨别风格判定 */
export type PlayStyle = 'intuitive' | 'fast' | 'analytical' | 'cautious'

export function getPlayStyle(
  avgTime: number,
  correctRate: number
): { style: PlayStyle; label: string; emoji: string; description: string } {
  if (avgTime < 10 && correctRate >= 0.7) {
    return { style: 'intuitive', label: '直觉猎手', emoji: '🦅', description: '你的第一直觉非常准！快速且准确，天生的真相猎手。' }
  }
  if (avgTime < 10 && correctRate < 0.7) {
    return { style: 'fast', label: '闪电快手', emoji: '🐇', description: '你反应很快，但偶尔需要慢下来多看一眼，细节藏在时间里。' }
  }
  if (avgTime >= 10 && correctRate >= 0.7) {
    return { style: 'analytical', label: '审慎分析师', emoji: '🦉', description: '你谨慎思考后做出判断，稳扎稳打，不放过任何疑点。' }
  }
  return { style: 'cautious', label: '谨慎探索者', emoji: '🐢', description: '你在仔细思考每一条信息，再多练习就能找到节奏感。' }
}

/** 雷达图维度计算 */
export function calcRadarDimension(correctRate: number, timeEfficiency: number): number {
  const score = correctRate * 70 + timeEfficiency * 30
  return Math.min(100, Math.round(score))
}

/** 时间效率系数（越快越高，0-1） */
export function calcTimeEfficiency(avgTime: number, timeLimit: number = 30): number {
  if (avgTime >= timeLimit) return 0
  return Math.max(0, 1 - avgTime / timeLimit)
}

// ===== 通用雷达维度（5个，与赛道无关）=====

export interface RadarDimension {
  label: string
  value: number
  color: string
}

/**
 * 计算5个通用雷达维度
 * @param answers 所有前测答题记录
 * @param level2Score 第二关得分（0如果未参与）
 * @param level2Complete 是否完成第二关
 * @param completedTrackCount 已完成赛道数量（1-3）
 */
export function calcGenericRadarData(
  answers: Array<{ isCorrect: boolean; playerAnswer: boolean; correctAnswer: boolean; remainingSeconds: number }>,
  level2Score: number,
  level2Complete: boolean,
  completedTrackCount: number
): RadarDimension[] {
  const total = answers.length
  if (total === 0) return []

  const correctCount = answers.filter(a => a.isCorrect).length
  const accuracy = total > 0 ? correctCount / total : 0

  // 🎯 判断准确度：正确率 × 100
  const accuracyValue = Math.round(accuracy * 100)

  // ⚡ 反应敏锐度：基于平均用时
  const avgTime = answers.reduce((s, a) => s + (30 - a.remainingSeconds), 0) / total
  const timeEff = calcTimeEfficiency(avgTime)
  const speedValue = Math.round(timeEff * 100)

  // 🛡️ 信息警惕性：识别假消息的能力
  // 计算"正确识别假消息"占所有假消息的比例
  const fakeItems = answers.filter(a => !a.correctAnswer)
  const fakeCorrectlyDetected = fakeItems.filter(a => a.isCorrect).length
  const skepticismValue = fakeItems.length > 0
    ? Math.round((fakeCorrectlyDetected / fakeItems.length) * 100)
    : 50 // 没有假消息题目时默认中等

  // 📚 知识广度：基于完成的赛道数
  const breadthValue = Math.round((completedTrackCount / 3) * 100)

  // 🤖 AI辨别力
  const aiValue = level2Complete
    ? Math.min(100, Math.round(level2Score / 2))
    : 0

  return [
    { label: '判断准确度', value: accuracyValue, color: '#4ADE80' },
    { label: '反应敏锐度', value: speedValue, color: '#F0D878' },
    { label: '信息警惕性', value: skepticismValue, color: '#60A5FA' },
    { label: '知识广度', value: breadthValue, color: '#C084FC' },
    { label: 'AI辨别力', value: aiValue, color: aiValue > 0 ? '#7EC8E3' : '#64748B' },
  ]
}
