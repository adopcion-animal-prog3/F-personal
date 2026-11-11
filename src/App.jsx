import './App.css'

function App() {
  return (
    <main className="app-shell">
      <section className="app-card" aria-label="Estado de la aplicación">
        <p className="eyebrow">F-personal</p>
        <h1>Aplicación base React + Vite</h1>
        <p>
          La capa de renderizado funciona correctamente y la estructura inicial quedó lista
          para continuar con las siguientes issues del proyecto.
        </p>
        <ul>
          <li>React está montado en la raíz del repositorio.</li>
          <li>La API queda centralizada en <code>src/services/api.js</code>.</li>
          <li>Vite, ESLint y tests quedaron configurados para empezar.</li>
        </ul>
      </section>
    </main>
  )
}

export default App
