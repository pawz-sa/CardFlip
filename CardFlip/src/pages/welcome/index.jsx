import welcomeImg from "../../assets/welcome.png"
import { useNavigate } from "react-router-dom" 
import "./index.css"

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="welcome-container">
      <img 
        src={welcomeImg} 
        alt="Welcome" 
        className="welcome-logo"
      />
      <div className="game-hint">
        Flip 2 cards and find the matching pairs!
      </div>
      <button 
        className="start-button"
        onClick={() => navigate('/CardFlip/difficulty')}
      >
        GET START
      </button>
    </div>
  )
}
