import PokemonExplorer from './components/PokemonExplorer'

export default function App() {
  return (
    <div className="min-h-screen bg-bg-base selection:bg-brand-green selection:text-black">
      <main>
        <PokemonExplorer />
      </main>
    </div>
  )
}
