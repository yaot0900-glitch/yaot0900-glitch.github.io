import { createContext, useContext, useReducer, type ReactNode, type Dispatch } from 'react'

// ===== 类型定义 =====

export type Track = 'health' | 'culture' | 'politics'
export type Phase = 'home' | 'preTestGuide' | 'trackSelect' | 'quiz' | 'reward' | 'level2Invite' | 'level2Image' | 'level2Text' | 'skipEnd' | 'report' | 'postTestGuide'

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
  participantId: string             // 唯一参与者编号，用于关联问卷数据
  phase: Phase
  currentTrack: Track | null
  currentQuestionIndex: number       // 当前赛道中的题目索引 0-4
  answers: Answer[]                  // 所有赛道的答题记录
  score: number                      // 累计总分
  credibility: number                // 5-0，答错扣1
  completedTracks: Track[]           // 已完成的赛道列表
  questionsPerTrack: number          // 每赛道题数（默认5）
  level2Complete: boolean
  level2Skipped: boolean
  level2Score: number
  hasRevived: boolean
  trackQuestionIds: Record<Track, number[]>  // 每赛道随机分配的5题ID
}

// ===== Actions =====

export type GameAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'INIT_GAME'; payload: { participantId: string; trackQuestionIds: Record<Track, number[]> } }
  | { type: 'SELECT_TRACK'; payload: Track }
  | { type: 'GO_TO_PHASE'; payload: Phase }
  | { type: 'ANSWER_TRACK_QUESTION'; payload: Answer }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_CURRENT_TRACK' }
  | { type: 'REVIVE' }
  | { type: 'SET_LEVEL2_SCORE'; payload: number }
  | { type: 'COMPLETE_LEVEL2' }
  | { type: 'SKIP_LEVEL2' }
  | { type: 'RESET_GAME' }

// ===== 初始状态 =====

const initialTrackQuestionIds: Record<Track, number[]> = {
  health: [],
  culture: [],
  politics: [],
}

const initialState: GameState = {
  playerName: '',
  participantId: '',
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
  trackQuestionIds: initialTrackQuestionIds,
}

// ===== Reducer =====

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, playerName: action.payload }

    case 'INIT_GAME': {
      const { participantId, trackQuestionIds } = action.payload
      return {
        ...state,
        participantId,
        trackQuestionIds,
        currentTrack: null,
        currentQuestionIndex: 0,
        answers: [],
        score: 0,
        credibility: 5,
        completedTracks: [],
        level2Complete: false,
        level2Skipped: false,
        level2Score: 0,
        hasRevived: false,
      }
    }

    case 'SELECT_TRACK': {
      return {
        ...state,
        currentTrack: action.payload,
        currentQuestionIndex: 0,
        phase: 'quiz',
      }
    }

    case 'GO_TO_PHASE':
      return { ...state, phase: action.payload }

    case 'ANSWER_TRACK_QUESTION': {
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
      return state // 仅触发重渲染

    case 'COMPLETE_CURRENT_TRACK': {
      const track = state.currentTrack
      if (!track) return state

      const newCompletedTracks = [...state.completedTracks, track]
      const allDone = newCompletedTracks.length >= 3

      if (allDone) {
        return {
          ...state,
          completedTracks: newCompletedTracks,
          phase: 'reward',
        }
      }

      // 还有赛道未完成 → 回到赛道选择页
      return {
        ...state,
        completedTracks: newCompletedTracks,
        currentTrack: null,
        currentQuestionIndex: 0,
        phase: 'trackSelect',
      }
    }

    case 'REVIVE':
      return { ...state, credibility: 2, hasRevived: true }

    case 'SET_LEVEL2_SCORE':
      return { ...state, level2Score: state.level2Score + action.payload }

    case 'COMPLETE_LEVEL2':
      return { ...state, level2Complete: true, phase: 'report' }

    case 'SKIP_LEVEL2':
      return { ...state, level2Skipped: true, phase: 'skipEnd' }

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
