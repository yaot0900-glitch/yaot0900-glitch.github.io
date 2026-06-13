import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import CoverPage from './pages/CoverPage'
import HomePage from './pages/HomePage'
import TrackSelectPage from './pages/TrackSelectPage'
import QuizPage from './pages/QuizPage'
import RewardPage from './pages/RewardPage'
import Level2Invite from './pages/Level2Invite'
import AiImagePage from './pages/AiImagePage'
import AiTextPage from './pages/AiTextPage'
import SkipEndPage from './pages/SkipEndPage'
import ReportPage from './pages/ReportPage'
import CalibratePage from './pages/CalibratePage'

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/select" element={<TrackSelectPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/reward" element={<RewardPage />} />
          <Route path="/level2-invite" element={<Level2Invite />} />
          <Route path="/level2-image" element={<AiImagePage />} />
          <Route path="/level2-text" element={<AiTextPage />} />
          <Route path="/skip-end" element={<SkipEndPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/calibrate" element={<CalibratePage />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  )
}

export default App
