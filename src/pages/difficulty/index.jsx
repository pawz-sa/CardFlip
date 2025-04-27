import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined' 
import "./index.css"
import classNames from 'classnames';

export default function DifficultyPage() {
  const navigate = useNavigate()
  const [activeDifficulty, setActiveDifficulty] = useState('easy')
  const [showToast, setShowToast] = useState(false)

  const goToGame = (difficulty) => {
    if (difficulty) { 
      navigate('/game', { state: { difficulty } })
    }
  }

  const handleVsRobotClick = () => {
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 2000)
  }

  return (
    <div className="difficulty-page">
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowBackIosOutlinedIcon /> BACK
      </button>
      
      <div className="difficulty-container">
        <h2 className="difficulty-title">CHOOSE GAME MODE</h2>
        <div className="difficulty-options">
          <div 
            className={classNames(
              'difficulty-easy-section',
              {'active': activeDifficulty === 'easy'}
            )}
            onClick={() => setActiveDifficulty('easy')}
          >
            <div className="difficulty-icon">😊</div>
            <div className="difficulty-text">EASY</div>
          </div>
          <div 
            className={classNames(
              'difficulty-medium-section',
              {'active': activeDifficulty === 'medium'}
            )}
            onClick={() => setActiveDifficulty('medium')}
          >
            <div className="difficulty-icon">🤔</div>
            <div className="difficulty-text">MEDIUM</div>
          </div>
          
          <div 
            className={classNames(
              'difficulty-hard-section',
              {'active': activeDifficulty === 'hard'}
            )}
            onClick={() => setActiveDifficulty('hard')}
          >
            <div className="difficulty-icon">😰</div>
            <div className="difficulty-text">HARD</div>
          </div>
        </div>
        
        <button className="just-me-button" onClick={() => goToGame(activeDifficulty)}>
          <PersonIcon /> JUST ME
        </button>
        <button className="vs-robot-button" onClick={handleVsRobotClick}>
          <SmartToyIcon /> vs. ROBOT
        </button>
        {/* <button className="vs-friend-button">
          <GroupIcon /> vs. FRIEND
        </button> */}

        {showToast && (
          <div className="toast-message">
            Coming Soon
          </div>
        )}
      </div>
    </div>
  )
}
