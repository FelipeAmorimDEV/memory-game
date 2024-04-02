import { useEffect, useReducer } from "react"
import { Plus, Envelope, Atom, Backpack } from 'phosphor-react'

const initialCards = [
  { id: 1, element: <Plus size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 1, element: <Plus size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 2, element: <Atom size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 2, element: <Atom size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 3, element: <Envelope size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 3, element: <Envelope size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 4, element: <Backpack size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 4, element: <Backpack size={60} weight="fill" color="#1a1a1a" />, points: 10 },
]

function shuffleArray(array) {
  const newArray = [...array]
  let currentIndex = newArray.length;

  while (currentIndex !== 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }

  return newArray
}

function reducer(state, action) {
  const pointsPerMatch = state.cards[0].points

  if (action.type === "turned_card") {
    return {
      ...state,
      moves: [...state.moves, action.payload.id],
      movesIndex: [...state.movesIndex, action.payload.index],
      attempts: state.attempts + 1
    }
  }

  if (action.type === "reset_moves") {
    return { ...state, moves: [], movesIndex: [] }
  }

  if (action.type === "matched_card") {
    return { ...state, match: [...state.match, state.moves[0]], points: state.points + pointsPerMatch }
  }

  if (action.type === "started_game") {
    return { ...state, appStatus: 'ready' }
  }

  if (action.type === "restarted_game") {
    return { cards: shuffleArray(initialCards), appStatus: 'menu', points: 0, attempts: 0, moves: [], movesIndex: [], match: [] }
  }

}

const initialState = { 
  cards: initialCards, 
  attempts: 0, 
  moves: [], 
  movesIndex: [], 
  match: [], 
  points: 0, 
  appStatus: 'menu' 
}
  
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const attemptsToMatchCards = Math.floor(state.attempts / 2)
  const maxPoints = state.cards.reduce((acc, card) => acc += card.points / 2, 0)

  useEffect(() => {
    const firstCard = state.moves[0]
    const isMatch = state.moves.filter((move) => firstCard === move).length === 2
    const maxMoves = state.moves.length === 2

    if (isMatch) {
      dispatch({ type: 'matched_card' })
    }

    if (maxMoves) {
      setTimeout(() => {
        dispatch({ type: 'reset_moves' })
      }, 500)
    }


  }, [state.moves])

  useEffect(() => {
    if (state.match.length === state.cards.length / 2) {
      setTimeout(() => alert("Congratulations, you've matched all the cards!"), 200)
    }
  }, [state.cards.length, state.match.length])

  function handleTurnCard(index, id) {
    const clickedSameCard = state.movesIndex.some(mi => mi === index)
    const cardAlreadyTurned = state.match.includes(id)
    const alreadyTwoTurnedCards = state.movesIndex.length === 2
    if (cardAlreadyTurned || clickedSameCard || alreadyTwoTurnedCards) {
      return
    }
    dispatch({ type: 'turned_card', payload: { index, id } })
  }

  function handleStartGame() {
    dispatch({ type: 'started_game' })
  }

  function handleRestartGame() {
    dispatch({ type: 'restarted_game' })
  }

  return (
    <div className="app">
      {state.appStatus === 'menu' && (
        <div className="menu">
          <h1>Memory Game</h1>
          <button onClick={handleStartGame}>Start</button>
        </div>
      )}
      {state.appStatus === 'ready' && (
        <>
          <div className="game-status">
            <span>Attempts: {attemptsToMatchCards}</span>
            <span>Points: <strong>{state.points}</strong> / {maxPoints}</span>
            <span>Timer: 00:60</span>
          </div>
          <main className="board">
            {state.cards.map((card, index) => (
              <div
                key={index} data-id={card.id}
                className={`flip-card ${state.movesIndex.includes(index) || state.match.includes(card.id) ? 'hover' : ''}`}
                onClick={() => handleTurnCard(index, card.id)}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front"></div>
                  <div className="flip-card-back">
                    {card.element}
                  </div>
                </div>
              </div>
            ))}
            <button className="restart-btn" onClick={handleRestartGame}>Restart</button>
          </main>
        </>
      )}
    </div>
  )
}

export { App }