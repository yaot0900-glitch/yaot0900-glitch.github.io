import { useCallback } from 'react'
import { useGameContext, type Track, type Answer } from '../context/GameContext'
import { calcQuestionScore, calcTrackBonus } from '../utils/scoring'
import questionBank from '../data/questions.json'

/** 生成唯一参与者编号 */
function generateParticipantId(): string {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ' // 排除 O/0/I/1/L
  let id = ''
  for (let i = 0; i < 4; i++) {
    id += chars[Math.floor(Math.random() * chars.length)]
  }
  return `P-${id}`
}

/** Fisher-Yates 洗牌 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 为所有3个赛道各随机分配5题 */
function assignAllTrackQuestions(): Record<Track, number[]> {
  const tracks: Track[] = ['health', 'culture', 'politics']
  const result: Record<string, number[]> = {}
  for (const track of tracks) {
    const allIds = (questionBank as unknown as Record<string, { questions: { id: number }[] }>)[track]?.questions.map(q => q.id) || []
    result[track] = shuffle(allIds).slice(0, 5)
  }
  return result as Record<Track, number[]>
}

export function useGame() {
  const { state, dispatch } = useGameContext()

  /** 设置玩家昵称 */
  const setName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', payload: name })
  }, [dispatch])

  /** 初始化游戏：生成参与者编号，为3个赛道随机分配题目 */
  const initGame = useCallback(() => {
    const participantId = generateParticipantId()
    const trackQuestionIds = assignAllTrackQuestions()
    dispatch({ type: 'INIT_GAME', payload: { participantId, trackQuestionIds } })
  }, [dispatch])

  /** 选择要玩的赛道 */
  const selectTrack = useCallback((track: Track) => {
    dispatch({ type: 'SELECT_TRACK', payload: track })
  }, [dispatch])

  /** 提交当前赛道的一道题答案 */
  const submitTrackAnswer = useCallback((
    questionId: number,
    track: Track,
    playerAnswer: boolean,
    correctAnswer: boolean,
    remainingSeconds: number
  ) => {
    const isCorrect = playerAnswer === correctAnswer
    const { total } = calcQuestionScore(isCorrect, remainingSeconds)

    const answer: Answer = {
      questionId,
      track,
      playerAnswer,
      correctAnswer,
      isCorrect,
      remainingSeconds,
      score: total,
    }

    dispatch({ type: 'ANSWER_TRACK_QUESTION', payload: answer })
    return { isCorrect, score: total }
  }, [dispatch])

  /** 完成当前赛道，自动进入下一赛道或进入奖励 */
  const completeCurrentTrack = useCallback(() => {
    dispatch({ type: 'COMPLETE_CURRENT_TRACK' })
  }, [dispatch])

  /** 获取当前赛道应展示的题目ID列表 */
  const getCurrentTrackQuestionIds = useCallback((): number[] => {
    if (!state.currentTrack) return []
    return state.trackQuestionIds[state.currentTrack] || []
  }, [state.currentTrack, state.trackQuestionIds])

  /** 获取指定赛道的得分 */
  const getTrackScore = useCallback((track: Track): number => {
    return state.answers
      .filter(a => a.track === track)
      .reduce((sum, a) => sum + a.score, 0)
  }, [state.answers])

  /** 获取指定赛道的正确率 */
  const getTrackStats = useCallback((track: Track) => {
    const trackAnswers = state.answers.filter(a => a.track === track)
    const correct = trackAnswers.filter(a => a.isCorrect).length
    const total = trackAnswers.length
    return { correct, total, rate: total > 0 ? correct / total : 0 }
  }, [state.answers])

  /** 获取当前赛道结算奖励 */
  const getTrackBonus = useCallback(() => {
    if (!state.currentTrack) return { perfectBonus: 0, credibilityBonus: 0, total: 0 }

    const trackAnswers = state.answers.filter(a => a.track === state.currentTrack)
    const correct = trackAnswers.filter(a => a.isCorrect).length
    const total = state.questionsPerTrack

    return calcTrackBonus(correct, total, state.credibility)
  }, [state.answers, state.currentTrack, state.credibility, state.questionsPerTrack])

  /** 跳转到指定页面 */
  const goTo = useCallback((phase: 'home' | 'preTest' | 'trackSelect' | 'quiz' | 'reward' | 'level2Invite' | 'level2Image' | 'level2Text' | 'skipEnd' | 'report' | 'postTest' | 'end') => {
    dispatch({ type: 'GO_TO_PHASE', payload: phase })
  }, [dispatch])

  /** 保存前测答案 */
  const setPreTestAnswers = useCallback((answers: Record<string, string>) => {
    dispatch({ type: 'SET_PRE_TEST_ANSWERS', payload: answers })
  }, [dispatch])

  /** 保存后测答案 */
  const setPostTestAnswers = useCallback((answers: Record<string, string>) => {
    dispatch({ type: 'SET_POST_TEST_ANSWERS', payload: answers })
  }, [dispatch])

  /** 标记数据已提交 */
  const markDataSubmitted = useCallback(() => {
    dispatch({ type: 'MARK_DATA_SUBMITTED' })
  }, [dispatch])

  /** 复活 */
  const revive = useCallback(() => {
    dispatch({ type: 'REVIVE' })
  }, [dispatch])

  /** 第二关操作 */
  const skipLevel2 = useCallback(() => {
    dispatch({ type: 'SKIP_LEVEL2' })
  }, [dispatch])

  const completeLevel2 = useCallback(() => {
    dispatch({ type: 'COMPLETE_LEVEL2' })
  }, [dispatch])

  const addLevel2Score = useCallback((score: number) => {
    dispatch({ type: 'SET_LEVEL2_SCORE', payload: score })
  }, [dispatch])

  /** 重置游戏 */
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [dispatch])

  // ---- 衍生数据 ----

  /** 当前赛道是否全部答完 */
  const isTrackDone = state.currentQuestionIndex >= state.questionsPerTrack

  /** 所有赛道是否完成 */
  const allTracksDone = state.completedTracks.length >= 3

  /** 获取总正确数 */
  const totalCorrect = state.answers.filter(a => a.isCorrect).length

  /** 总正确率 */
  const correctRate = state.answers.length > 0
    ? totalCorrect / state.answers.length
    : 0

  /** 总分（含赛道奖励） */
  const totalScore = (() => {
    let score = state.score
    // 加上已完成的赛道奖励
    for (const track of state.completedTracks) {
      const trackAnswers = state.answers.filter(a => a.track === track)
      const correct = trackAnswers.filter(a => a.isCorrect).length
      const bonus = calcTrackBonus(correct, state.questionsPerTrack, state.credibility)
      score += bonus.total
    }
    return score + state.level2Score
  })()

  return {
    state,
    setName,
    initGame,
    selectTrack,
    submitTrackAnswer,
    completeCurrentTrack,
    getCurrentTrackQuestionIds,
    getTrackScore,
    getTrackStats,
    getTrackBonus,
    goTo,
    revive,
    skipLevel2,
    completeLevel2,
    addLevel2Score,
    resetGame,
    setPreTestAnswers,
    setPostTestAnswers,
    markDataSubmitted,
    // 衍生
    isTrackDone,
    allTracksDone,
    totalCorrect,
    correctRate,
    totalScore,
  }
}
