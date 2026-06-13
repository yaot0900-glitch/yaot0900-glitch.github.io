import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react'

// ===== 类型定义 =====

export type Track = 'health' | 'culture' | 'politics'
export type Phase = 'home' | 'trackSelect' | 'quiz' | 'reward' | 'level2Invite' | 'level2Image' | 'level2Text' | 'skipEnd' | 'report'

export interface Answer {
  questionId: number
  track: Track
  playerAnswer: boolean      // true=真, false=假
  correctAnswer: boolean
  isCorrect: boolean
  remainingSeconds: number
  score: number
}

export interface GameState {
  playerName: string
  phase: Phase
  currentTrack: Track | null
  currentQuestionIndex: number       // 当前赛道中的题目索引 0-4
  answers: Answer[]
  score: number
  credibility: number                // 5-0
  completedTracks: Track[]
  questionsPerTrack: number          // 每题数（默认5）
  level2Complete: boolean
  level2Skipped: boolean
  level2Score: number
  hasRevived: boolean                // 是否已使用复活
  // 后测
  preTestTrack: Track | null         // 前测所选赛道（用于后测推荐对比）
  postTestTrack: Track | null        // 后测所选赛道
  postTestAnswers: Answer[]
  postTestScore: number
  postTestComplete: boolean
  postTestSkipped: boolean
}

// ===== Actions =====

export type GameAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SELECT_TRACK'; payload: Track }
  | { type: 'ANSWER_QUESTION'; payload: Answer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_TRACK' }
  | { type: 'GO_TO_PHASE'; payload: Phase }
  | { type: 'REVIVE' }
  | { type: 'SET_LEVEL2_SCORE'; payload: number }
  | { type: 'COMPLETE_LEVEL2' }
  | { type: 'SKIP_LEVEL2' }
  | { type: 'RESET_GAME' }
  // 后测
  | { type: 'START_POST_TEST'; payload: Track }
  | { type: 'ANSWER_POST_TEST'; payload: Answer }
  | { type: 'COMPLETE_POST_TEST' }
  | { type: 'SKIP_POST_TEST' }

// ===== 初始状态 =====

const initialState: GameState = {
  playerName: '',
  phase: 'home',
  currentTrack: null,
  currentQuestionIndex: 0,
  answers: [],
  score: 0,
  credibility: 5,
  completedTracks: [],
  questionsPerTrack: 5,
  level2Complete: false,
  level2Skipped: false,
  level2Score: 0,
  hasRevived: false,
  // 后测
  preTestTrack: null,
  postTestTrack: null,
  postTestAnswers: [],
  postTestScore: 0,
  postTestComplete: false,
  postTestSkipped: false,
}

// ===== Reducer =====

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, playerName: action.payload }

    case 'SELECT_TRACK':
      return {
        ...state,
        currentTrack: action.payload,
        currentQuestionIndex: 0,
        phase: 'quiz',
      }

    case 'ANSWER_QUESTION': {
      const answer = action.payload
      const newScore = state.score + answer.score
      const newCredibility = answer.isCorrect ? state.credibility : Math.max(0, state.credibility - 1)

      return {
        ...state,
        answers: [...state.answers, answer],
        score: newScore,
        credibility: newCredibility,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      }
    }

    case 'NEXT_QUESTION':
      return state // 仅触发重渲染，index已在ANSWER_QUESTION中+1

    case 'COMPLETE_TRACK': {
      const track = state.currentTrack
      if (!track) return state
      // 3选1：完成一个赛道即进入奖励
      const isPreTest = !state.preTestTrack
      return {
        ...state,
        completedTracks: [...state.completedTracks, track],
        preTestTrack: isPreTest ? track : state.preTestTrack,
        phase: 'reward',
      }
    }

    case 'GO_TO_PHASE':
      return { ...state, phase: action.payload }

    case 'REVIVE':
      return { ...state, credibility: 2, hasRevived: true }

    case 'SET_LEVEL2_SCORE':
      return { ...state, level2Score: state.level2Score + action.payload }

    case 'COMPLETE_LEVEL2':
      return { ...state, level2Complete: true, postTestSkipped: false, phase: 'report' }

    case 'SKIP_LEVEL2':
      return { ...state, level2Skipped: true, phase: 'skipEnd' }

    // ---- 后测 ----
    case 'START_POST_TEST':
      return {
        ...state,
        postTestTrack: action.payload,
        currentTrack: action.payload,
        currentQuestionIndex: 0,
        phase: 'quiz',
      }

    case 'ANSWER_POST_TEST': {
      const ptAnswer = action.payload
      return {
        ...state,
        postTestAnswers: [...state.postTestAnswers, ptAnswer],
        postTestScore: state.postTestScore + ptAnswer.score,
        currentQuestionIndex: state.currentQuestionIndex + 1,
      }
    }

    case 'COMPLETE_POST_TEST':
      return { ...state, postTestComplete: true, phase: 'report' }

    case 'SKIP_POST_TEST':
      return { ...state, postTestSkipped: true }

    case 'RESET_GAME':
      return { ...initialState, playerName: state.playerName }

    default:
      return state
  }
}

// ===== Context =====

const GameContext = createContext<{
  state: GameState
  dispatch: Dispatch<GameAction>
} | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const ctx = useContext(GameContext)
  if (!ctx) {
    throw new Error('useGameContext must be used inside <GameProvider>')
  }
  return ctx
}
