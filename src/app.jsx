const App = () => {
  return (
    <div className="app">
      <div className="game-status"><span>Status: Jogando</span> <span>Tentativas: 0</span></div>
      <main className="board">
        {Array.from({ length: 12 }).map((card, index) => (
          <div className="flip-card" key={index}>
            <div className="flip-card-inner">
              <div className="flip-card-front"></div>
              <div className="flip-card-back">
                <h1>Felipe</h1>
              </div>
            </div>
          </div>
        ))}

      </main>
    </div>
  )
}

export { App }
