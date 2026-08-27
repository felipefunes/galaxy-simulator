import './Sidebar.css'

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="sidebar__title">Galaxy Simulator</h1>
      <p className="sidebar__subtitle">
        Simulación interactiva de estructura y cinemática galáctica.
      </p>
      <p className="sidebar__note">
        Los controles de forma, composición y rotación se agregan en un próximo PR.
      </p>
    </aside>
  )
}
