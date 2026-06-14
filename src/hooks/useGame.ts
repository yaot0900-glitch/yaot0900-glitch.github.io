import { useCallback } from 'react'
import { useGameContext, type Track, type Answer } from '../context/GameContext'
import { calcQuestionScore, calcTrackBonus } from '../utils/scoring'
import questionBank from '../data/questions.json'

/** Fisher-Yates 洗牌 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** 从赛道全题库中随机分配前测5题+后测5题 */
function splitTrackQuestions(track: Track): { pre: number[]; post: number[] } {
  const trackData = (questionBank as unknown as Record<string, { questions: { id: number }[] }>)[track]
  const ids = trackData.questions.map(q => q.id)
  const shuffled = shuffle(ids)
  return { pre: shuffled.slice(0, 5), post: shuffled.slice(5, 10) }
}

export function useGame() {
  const { state, dispatch } = useGameContext()

  /** 设置玩家昵称 */
  const setName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', payload: name })
  }, [dispatch])

  /** 选择赛道并开始答题（随机抽5题作为前测） */
  const selectTrack = useCallback((track: Track) => {
    const split = splitTrackQuestions(track)
    dispatch({ type: 'SET_TRACK_QUESTIONS', payload: { track, pre: split.pre, post: split.post } })
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

  /** 开始后测（选择赛道，使用已分配的后测题目或重新分配） */
  const startPostTest = useCallback((track: Track) => {
    // 如果该赛道已有分配（同赛道后测），使用已存储的；否则重新分配
    if (!state.trackQuestionMap[track]) {
      const split = splitTrackQuestions(track)
      dispatch({ type: 'SET_TRACK_QUESTIONS', payload: { track, pre: split.pre, post: split.post } })
    }
    dispatch({ type: 'START_POST_TEST', payload: track })
  }, [dispatch, state.trackQuestionMap])

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

  /** 获取当前赛道/阶段应展示的题目ID列表 */
  const getCurrentQuestionIds = useCallback((): number[] => {
    if (!state.currentTrack) return []
    const map = state.trackQuestionMap[state.currentTrack]
    if (!map) return []
    return isPostTestMode ? map.post : map.pre
  }, [state.currentTrack, state.trackQuestionMap, isPostTestMode])

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
    getCurrentQuestionIds,
    // 通用
    isTrackDone,
    allTracksDone,
    totalCorrect,
    correctRate,
    totalScore,
  }
}
