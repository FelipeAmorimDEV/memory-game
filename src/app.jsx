import { useEffect, useReducer } from "react"
import { Plus, Envelope, Atom, Backpack } from 'phosphor-react'

const cards = [
  { id: 1, element: <Plus size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 1, element: <Plus size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 2, element: <Atom size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 2, element: <Atom size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 3, element: <Envelope size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 3, element: <Envelope size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 4, element: <Backpack size={60} weight="fill" color="#1a1a1a" />, points: 10 },
  { id: 4, element: <Backpack size={60} weight="fill" color="#1a1a1a" />, points: 10 },
]

function shuffler(array) {
  const newArray = [...array]
  let currentIndex = newArray.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex], newArray[currentIndex]];
  }

  return newArray
}

function reducer(state, action) {
  const pointsPerMatch = state.cards[0].points

  if (action.type === "turned_card") {
    return {
      ...state,
      jogadas: [...state.jogadas, action.payload.id],
      jogadasindex: [...state.jogadasindex, action.payload.index],
      tentativas: state.tentativas + 1
    }
  }

  if (action.type === "reset_jogadas") {
    return { ...state, jogadas: [], jogadasindex: [] }
  }

  if (action.type === "matcheted_card") {
    return { ...state, match: [...state.match, state.jogadas[0]], points: state.points + pointsPerMatch }
  }

  if (action.type === "started_game") {
    return { ...state, appStatus: 'ready' }
  }

  if (action.type === "restarted_game") {
    return { cards: shuffler(cards), appStatus: 'menu', points: 0, tentativas: 0, jogadas: [], jogadasindex: [], match: [] }
  }

}

const initialState = { 
    cards: shuffler(cards), 
    tentativas: 0, 
    jogadas: [], 
    jogadasindex: [], 
    match: [], 
    points: 0, 
    appStatus: 'menu' 
  }
  
const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const tentativasEfetuadasParaCombinarAsCartas = Math.floor(state.tentativas / 2)
  const maxPoints = state.cards.reduce((acc, card) => acc += card.points / 2, 0)

  useEffect(() => {
    const primeiraCarta = state.jogadas[0]
    const match = state.jogadas.filter((jogada) => primeiraCarta === jogada).length === 2
    const maxJogada = state.jogadas.length === 2

    if (match) {
      dispatch({ type: 'matcheted_card' })
    }

    if (maxJogada) {
      setTimeout(() => {
        dispatch({ type: 'reset_jogadas' })
      }, 500)
    }


  }, [state.jogadas])

  useEffect(() => {
    if (state.match.length === state.cards.length / 2) {
      setTimeout(() => alert("Parabéns, você encontrou todas as cartas!"), 200)
    }
  }, [state.cards.length, state.match.length])

  function handleTurnCard(index, id) {
    const clicouNoMesmoCard = state.jogadasindex.some(ji => ji === index)
    const aCartaJaFoiVirada = state.match.includes(id)
    if ( aCartaJaFoiVirada ||  clicouNoMesmoCard) {
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
          <h1>Jogo da Memória</h1>
          <button onClick={handleStartGame}>Começar</button>
        </div>
      )}
      {state.appStatus === 'ready' && (
        <>
          <div className="game-status">
            <span>Tentativas: {tentativasEfetuadasParaCombinarAsCartas}</span>
            <span>Pontos: <strong>{state.points}</strong> / {maxPoints}</span>
            <span>Timer: 00:60</span>
          </div>
          <main className="board">
            {state.cards.map((card, index) => (
              <div
                key={index} data-id={card.id}
                className={`flip-card ${state.jogadasindex.includes(index) || state.match.includes(card.id) ? 'hover' : ''}`}
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
            <button className="restart-btn" onClick={handleRestartGame}>Reiniciar</button>
          </main>
        </>
      )}
    </div>
  )
}

export { App }
