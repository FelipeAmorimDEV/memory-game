import { useEffect, useReducer } from "react"
import { Plus, Envelope, Atom, Backpack } from 'phosphor-react'

const cards = [
  { id: 1, element: <Plus size={60} weight="fill" color="#1a1a1a" /> },
  { id: 1, element: <Plus size={60} weight="fill" color="#1a1a1a" /> },
  { id: 2, element: <Atom size={60} weight="fill" color="#1a1a1a" /> },
  { id: 2, element: <Atom size={60} weight="fill" color="#1a1a1a" /> },
  { id: 3, element: <Envelope size={60} weight="fill" color="#1a1a1a" /> },
  { id: 3, element: <Envelope size={60} weight="fill" color="#1a1a1a" /> },
  { id: 4, element: <Backpack size={60} weight="fill" color="#1a1a1a" /> },
  { id: 4, element: <Backpack size={60} weight="fill" color="#1a1a1a" /> },
]

const App = () => {
  const [state, dispatch] = useReducer((state, action) => {
    if (action.type === "turned_card") {
      return { 
        ...state, 
        jogadas: [...state.jogadas, action.payload.id], 
        jogadasindex: [...state.jogadasindex, action.payload.index] 
      }
    }
  }, { cards, tentativas: 0, jogadas: [], jogadasindex: [] })

  function handleTurnCard(index, id) {
    dispatch({ type: 'turned_card', payload: { index, id } })
  }


  return (
    <div className="app">
      <div className="game-status"><span>Status: Jogando</span> <span>Tentativas: 0</span></div>
      <main className="board">
        {state.cards.map((card, index) => (
          <div
            key={index} data-id={card.id}
            className={`flip-card ${state.jogadasindex.includes(index) ? 'hover' : ''}`}
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

      </main>
    </div>
  )
}

export { App }
