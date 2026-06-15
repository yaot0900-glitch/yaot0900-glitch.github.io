/**
 * Google Sheets 数据提交工具
 *
 * 在 PostTestPage 提交后测时一次性提交全部实验数据（前测+游戏+后测）。
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
  // 问卷数据
  preTestAnswers: Record<string, string>
  postTestAnswers: Record<string, string>
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
    preTestAnswers: {},
    postTestAnswers: {},
  }
}

/** 构建完整实验数据载荷（前测 + 游戏 + 后测） */
export function buildFullDataPayload(
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
  hasRevived: boolean,
  preTestAnswers: Record<string, string>,
  postTestAnswers: Record<string, string>,
): GameDataPayload {
  const gamePayload = buildGameDataPayload(
    playerName, participantId, allAnswers, totalScore, totalCorrect,
    totalAnswered, overallCorrectRate, level2Complete, level2Score, credibility, hasRevived,
  )

  return {
    ...gamePayload,
    preTestAnswers,
    postTestAnswers,
  }
}

/** 提交游戏数据到 Google Sheets（静默，不阻塞） */
export async function submitGameData(payload: GameDataPayload): Promise<boolean> {
  if (!GOOGLE_SCRIPT_URL) {
    console.log('[数据收集] 未配置 Google Script URL，跳过提交')
    return false
  }

  const jsonBody = JSON.stringify(payload)
  console.log('[数据收集] 准备提交，数据大小:', jsonBody.length, 'bytes')
  console.log('[数据收集] 目标:', GOOGLE_SCRIPT_URL)

  // 方案1：navigator.sendBeacon（最可靠，专为数据上报设计）
  try {
    const blob = new Blob([jsonBody], { type: 'text/plain;charset=utf-8' })
    const sent = navigator.sendBeacon(GOOGLE_SCRIPT_URL, blob)
    if (sent) {
      console.log('[数据收集] sendBeacon 提交成功')
      return true
    }
    console.warn('[数据收集] sendBeacon 未成功排队，尝试 fetch...')
  } catch (err) {
    console.warn('[数据收集] sendBeacon 失败:', err)
  }

  // 方案2：fetch POST（备用）
  try {
    const formData = new URLSearchParams()
    formData.append('payload', jsonBody)

    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      body: formData.toString(),
    })
    console.log('[数据收集] fetch 提交完成')
    return true
  } catch (err) {
    console.warn('[数据收集] 提交失败（不影响游戏）:', err)
    return false
  }
}
