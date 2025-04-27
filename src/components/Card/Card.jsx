import coverImg from "../../assets/cover.png"
import "./Card.css"

export default function Card({ card, handleChoice, flipped, disabled }) {
  const handleClick = (e) => {
    e.preventDefault()
    if (!disabled && !card.matched) {
      handleChoice(card)
    }
  }

  return (
    <div className="card-container">
      <div 
        className={`card 
          ${flipped ? 'flipped' : ''} 
          ${card.matched ? 'card-matched' : ''} 
          ${disabled ? 'card-disabled' : ''}`
        }
      >
        <div className="card-face front">
          <img 
            src={card.src} 
            alt="card front"
            draggable="false"
          />
        </div>
        <div 
          className="card-face back"
          onClick={handleClick}
        >
          <img
            src={coverImg}
            alt="card back"
            draggable="false"
          />
        </div>
      </div>
    </div>
  )
} 