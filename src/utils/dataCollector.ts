/**
 * Google Sheets 数据提交工具
 *
 * 在 ReportPage 加载完成后自动提交游戏数据到 Google Sheets。
 * 静默提交，不影响游戏体验；URL 未配置时自动跳过。
 */

import { GOOGLE_SCRIPT_URL } from '../config/survey'
import type { Answer } from '../context/GameContext'

export interface TrackReport {
  track: string
  score: number
  correct: number
  total: number
  correctRate: number
  answers: Array<{
    questionId: number
    playerAnswer: boolean
    correctAnswer: boolean
    isCorrect: boolean
    remainingSeconds: number
    score: number
  }>
}

export interface GameDataPayload {
  playerName: string
  participantId: string
  timestamp: string
  tracks: TrackReport[]
  totalScore: number
  totalCorrect: number
  totalAnswered: number
  overallCorrectRate: number
  level2Complete: boolean
  level2Score: number
  credibility: number
  hasRevived: boolean
}

/** 将 Answer 数组转换为提交格式 */
function buildTrackReport(
  track: string,
  answers: Answer[],
  score: number,
  correct: number,
  total: number
): TrackReport {
  return {
    track,
    score,
    correct,
    total,
    correctRate: total > 0 ? correct / total : 0,
    answers: answers.map(a => ({
      questionId: a.questionId,
      playerAnswer: a.playerAnswer,
      correctAnswer: a.correctAnswer,
      isCorrect: a.isCorrect,
      remainingSeconds: a.remainingSeconds,
      score: a.score,
    })),
  }
}

/** 构建完整的游戏数据载荷 */
export function buildGameDataPayload(
  playerName: string,
  participantId: string,
  allAnswers: Answer[],
  totalScore: number,
  totalCorrect: number,
  totalAnswered: number,
  overallCorrectRate: number,
  level2Complete: boolean,
  level2Score: number,
  credibility: number,
  hasRevived: boolean
): GameDataPayload {
  const trackIds = ['health', 'culture', 'politics']
  const trackLabels: Record<string, string> = {
    health: '健康科普',
    culture: '文化娱乐',
    politics: '时政社会',
  }

  const tracks = trackIds.map(track => {
    const trackAnswers = allAnswers.filter(a => a.track === track)
    const correct = trackAnswers.filter(a => a.isCorrect).length
    const score = trackAnswers.reduce((sum, a) => sum + a.score, 0)
    return buildTrackReport(trackLabels[track], trackAnswers, score, correct, trackAnswers.length)
  })

  return {
    playerName,
    participantId,
    timestamp: new Date().toISOString(),
    tracks,
    totalScore,
    totalCorrect,
    totalAnswered,
    overallCorrectRate,
    level2Complete,
    level2Score,
    credibility,
    hasRevived,
  }
}

/** 提交游戏数据到 Google Sheets（静默，不阻塞） */
export async function submitGameData(payload: GameDataPayload): Promise<boolean> {
  if (!GOOGLE_SCRIPT_URL) {
    console.log('[数据收集] 未配置 Google Script URL，跳过提交')
    return false
  }

  try {
    // Google Apps Script 使用 no-cors 模式 + 302 重定向，fetch 无法读取响应
    // 因此使用 navigator.sendBeacon 或简单的 POST
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
    console.log('[数据收集] 提交成功')
    return true
  } catch (err) {
    console.warn('[数据收集] 提交失败（不影响游戏）:', err)
    return false
  }
}
