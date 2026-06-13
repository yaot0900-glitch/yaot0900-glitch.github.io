import { useCallback } from 'react'
import { useGameContext, type Track, type Answer } from '../context/GameContext'
import { calcQuestionScore, calcTrackBonus } from '../utils/scoring'

export function useGame() {
  const { state, dispatch } = useGameContext()

  /** 设置玩家昵称 */
  const setName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', payload: name })
  }, [dispatch])

  /** 选择赛道并开始答题 */
  const selectTrack = useCallback((track: Track) => {
    dispatch({ type: 'SELECT_TRACK', payload: track })
  }, [dispatch])

  /** 提交一道题的答案 */
  const submitAnswer = useCallback((
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

    dispatch({ type: 'ANSWER_QUESTION', payload: answer })
    return { isCorrect, score: total }
  }, [dispatch])

  /** 完成当前赛道 */
  const completeTrack = useCallback(() => {
    dispatch({ type: 'COMPLETE_TRACK' })
  }, [dispatch])

  /** 获取当前赛道结算奖励 */
  const getTrackBonus = useCallback(() => {
    if (!state.currentTrack) return { perfectBonus: 0, credibilityBonus: 0, total: 0 }

    const trackAnswers = state.answers.filter(a => a.track === state.currentTrack)
    const correct = trackAnswers.filter(a => a.isCorrect).length
    const total = state.questionsPerTrack

    // 获取当前信誉值（赛道结束时）
    return calcTrackBonus(correct, total, state.credibility)
  }, [state.answers, state.currentTrack, state.credibility, state.questionsPerTrack])

  /** 跳转到指定页面 */
  const goTo = useCallback((phase: 'home' | 'trackSelect' | 'quiz' | 'reward' | 'level2Invite' | 'level2Image' | 'level2Text' | 'skipEnd' | 'report') => {
    dispatch({ type: 'GO_TO_PHASE', payload: phase })
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

  // ---- 后测操作 ----

  /** 开始后测（选择赛道） */
  const startPostTest = useCallback((track: Track) => {
    dispatch({ type: 'START_POST_TEST', payload: track })
  }, [dispatch])

  /** 提交后测答案 */
  const submitPostTestAnswer = useCallback((
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

    dispatch({ type: 'ANSWER_POST_TEST', payload: answer })
    return { isCorrect, score: total }
  }, [dispatch])

  /** 完成后测 */
  const completePostTest = useCallback(() => {
    dispatch({ type: 'COMPLETE_POST_TEST' })
  }, [dispatch])

  /** 跳过后测 */
  const skipPostTest = useCallback(() => {
    dispatch({ type: 'SKIP_POST_TEST' })
  }, [dispatch])

  /** 当前赛道是否全部答完 */
  const isTrackDone = state.currentQuestionIndex >= state.questionsPerTrack

  /** 所有赛道是否完成（3选1：完成1个即达标） */
  const allTracksDone = state.completedTracks.length >= 1

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

  /** 当前是否处于后测答题模式 */
  const isPostTestMode = state.postTestTrack !== null && !state.postTestComplete

  return {
    state,
    setName,
    selectTrack,
    submitAnswer,
    completeTrack,
    getTrackBonus,
    goTo,
    revive,
    skipLevel2,
    completeLevel2,
    addLevel2Score,
    resetGame,
    // 后测
    startPostTest,
    submitPostTestAnswer,
    completePostTest,
    skipPostTest,
    isPostTestMode,
    // 通用
    isTrackDone,
    allTracksDone,
    totalCorrect,
    correctRate,
    totalScore,
  }
}
