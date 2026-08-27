import './App.css'
import { GalaxyCanvas } from './components/GalaxyCanvas/GalaxyCanvas'
import { Sidebar } from './components/Sidebar/Sidebar'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="canvas-container">
        <GalaxyCanvas />
      </main>
    </div>
  )
}

export default App
