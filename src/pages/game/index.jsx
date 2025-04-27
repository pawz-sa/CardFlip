import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import CloseIcon from '@mui/icons-material/Close'
import cardImages from "../../data/cards"
import Card from "../../components/Card/Card"
import "./index.css"

const DIFFICULTY_SETTINGS = {
  easy: { pairs: 7, flipBackTime: 1000  },
  medium: { pairs: 9, flipBackTime: 500 },
  hard: { pairs: 14, flipBackTime: 450 },
}

function GamePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const difficulty = location.state?.difficulty || 'easy'
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [firstChoice, setFirstChoice] = useState(null)
  const [secondChoice, setSecondChoice] = useState(null)
  const [moves, setMoves] = useState(0)
  const [timer, setTimer] = useState(0)
  const [timerInterval, setTimerInterval] = useState(null)
  const [gameState, setGameState] = useState("playing")
  const [disabled, setDisabled] = useState(false)
  const [showRestartConfirm, setShowRestartConfirm] = useState(false)
  const [toastMessages, setToastMessages] = useState([])


  const shuffleCards = (difficulty) => {
    const settings = DIFFICULTY_SETTINGS[difficulty]
    const selectedCards = cardImages.slice(0, settings.pairs)
    const shuffled = [...selectedCards, ...selectedCards]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random(), matched: false }))
    
    setFlippedCards([])
    setFirstChoice(null)
    setSecondChoice(null)
    setCards(shuffled)
    setMoves(0)
    setTimer(0)
    setGameState("playing")
    setDisabled(false)
    
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
    }
  }

  const startTimer = () => {
    if (!timerInterval) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
      setTimerInterval(interval)
    }
  }

  const addToast = (message) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToastMessages(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToastMessages(prev => prev.filter(toast => toast.id !== id))
    }, 2000)
  }

  const pauseGame = () => {
    if (timerInterval) {
      clearInterval(timerInterval)
      setTimerInterval(null)
      addToast("Game paused")
    }
    setGameState("paused")
  }

  const resumeGame = () => {
    setGameState("playing")
    startTimer()
    addToast("Game resumed")
  }

  // easy mode
  const handleEasyModeChoice = (card) => {
    // if click on already flipped card, return
    if (flippedCards.includes(card.id)) return

    setFlippedCards(prev => [...prev, card.id])
    setMoves(prev => prev + 1)

    // check match
    if (flippedCards.length > 0) {
      const lastCard = cards.find(c => c.id === flippedCards[flippedCards.length - 1])
      
      if (lastCard.src === card.src) {
        // match success
        setCards(prevCards => {
          return prevCards.map(c => {
            if (c.src === card.src) {
              return { ...c, matched: true }
            }
            return c
          })
        })
        setFlippedCards([])
      } else if (flippedCards.length === 2) {
        // if there are two cards and they don't match, keep the last card as the new first card
        setFlippedCards([card.id])
      }
    }
  }

  const handleNormalModeChoice = (card) => {
    if (!firstChoice) {
      setFirstChoice(card)
    } else if (!secondChoice && card.id !== firstChoice.id) {
      setSecondChoice(card)
      setDisabled(true)
      setMoves(prev => prev + 1)
    }
  }

  const handleChoice = (card) => {
    if (gameState !== "playing" || disabled) return
    // when first click, start timer
    if (!timerInterval) {
      startTimer()
    }
    if (difficulty === 'easy') {
      handleEasyModeChoice(card)
    } else {
      handleNormalModeChoice(card)
    }
  }

  // compare two cards (only for Medium/Hard mode)
  useEffect(() => {
    if (firstChoice && secondChoice) {
      if (firstChoice.src === secondChoice.src) {
        // match success
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.src === firstChoice.src) {
              return { ...card, matched: true }
            }
            return card
          })
        })
        resetTurn()
      } else {
        const timer = setTimeout(() => {
          resetTurn()
        }, DIFFICULTY_SETTINGS[difficulty].flipBackTime)
        return () => clearTimeout(timer)
      }
    }
  }, [firstChoice, secondChoice, difficulty, DIFFICULTY_SETTINGS])

  const resetTurn = () => {
    setFirstChoice(null)
    setSecondChoice(null)
    setDisabled(false)
  }

  // check if game is completed
  useEffect(() => {
    if (cards.length > 0 && gameState === "playing") {
      const allMatched = cards.every((card) => card.matched)
      if (allMatched) {
        if (timerInterval) {
          clearInterval(timerInterval)
          setTimerInterval(null)
        }
        setGameState("completed")
      }
    }
  }, [cards, gameState])

  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval)
      }
    }
  }, [timerInterval])

  useEffect(() => {
    shuffleCards(difficulty)
  }, [difficulty])

  const handleCloseModal = () => {
    setGameState("finished")
  }

  const handleRestartClick = () => {
    setShowRestartConfirm(true)
  }

  const handleRestartConfirm = () => {
    setShowRestartConfirm(false)
    shuffleCards(difficulty)
  }

  const handleRestartCancel = () => {
    setShowRestartConfirm(false)
  }

  return (
    <div className="game-page">
      <button className="back-button" onClick={() => navigate('/difficulty')}>
        <ArrowBackIosOutlinedIcon /> BACK
      </button>
      <div className="game-container">
        <div className="game-info">
          <div className="difficulty-display">
            <div className="emoji-icon">
              {difficulty === "easy" ? "😊" : difficulty === "medium" ? "🤔" : "😰"}
            </div>
            <div className="difficulty-text">
              {difficulty === "easy" ? "EASY" : difficulty === "medium" ? "MEDIUM" : "HARD"}
            </div>
          </div>
          <div className="difficulty-text">Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
          <div className="difficulty-text">Moves: {moves}</div>
        </div>

        <div className="game-controls">
          {gameState === "playing" && (
            <button onClick={pauseGame}>
              <StopCircleOutlinedIcon /> 
            </button>
          )}
          {gameState === "paused" && (
            <button onClick={resumeGame}>
              <ArrowRightOutlinedIcon /> 
            </button>
          )}
          <button onClick={handleRestartClick}>
            <RestartAltOutlinedIcon />
          </button>
        </div>

        {toastMessages.map(toast => (
          <div key={toast.id} className="toast-message">
            {toast.message}
          </div>
        ))}

        <div className="card-grid">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              handleChoice={handleChoice}
              flipped={
                difficulty === 'easy'
                  ? flippedCards.includes(card.id) || card.matched
                  : card === firstChoice || card === secondChoice || card.matched
              }
              disabled={disabled || gameState !== "playing"}
            />
          ))}
        </div>

        {gameState === "completed" && (
          <div className="modal">
            <div className="modal-content">
              <button 
                className="close-button" 
                onClick={handleCloseModal}>
                <CloseIcon />
              </button>
              <h2>CONGRATULATIONS!</h2>
              <p>Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
              <p>Moves: {moves}</p>
              <button className="again-button" onClick={() => shuffleCards(difficulty)}>
                TRY AGAIN
              </button>
            </div>
          </div>
        )}

        {showRestartConfirm && (
          <div className="modal">
            <div className="modal-content">
              <h2>Restart game?</h2>
              <p>You will lose all your progress!</p>
              <div className="modal-buttons">
                <button className="cancel-button" onClick={handleRestartCancel}>
                  CANCEL
                </button>
                <button className="restart-button" onClick={handleRestartConfirm}>
                  RESTART
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GamePage