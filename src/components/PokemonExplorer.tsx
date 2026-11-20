import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const API = 'https://pokeapi.co/api/v2'
const art = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

const TYPES = ['fire', 'water', 'grass', 'electric', 'psychic', 'ghost', 'dragon', 'bug', 'normal', 'fighting', 'poison', 'ground']

type Entry = { id: number; name: string }
type Detail = {
  id: number
  name: string
  height: number
  weight: number
  types: { type: { name: string } }[]
  abilities: { ability: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')

async function fetchPokemonDetail(id: number): Promise<Detail> {
  const response = await fetch(`${API}/pokemon/${id}`)
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

function Loading({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-zinc-600" role="status">
      <span className="w-5 h-5 border-2 border-zinc-300 border-t-black rounded-full animate-spin" />
      {label}
    </div>
  )
}

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-white border border-red-200 rounded-md p-6 text-center">
      <p className="text-red-700 mb-3">{message}</p>
      <button onClick={onRetry} className="bg-black text-white rounded-full px-5 py-2 text-sm">
        Try again
      </button>
    </div>
  )
}

function PokemonCard({ p, onOpen }: { p: Entry; onOpen: (p: Entry) => void }) {
  return (
    <button
      onClick={() => onOpen(p)}
      className="group bg-white/70 backdrop-blur border border-black/5 rounded-xl p-4 text-left hover:bg-white hover:-translate-y-1 transition focus-visible:outline-2 focus-visible:outline-black"
    >
      <span className="text-xs text-zinc-500">#{String(p.id).padStart(3, '0')}</span>
      <img src={art(p.id)} alt={p.name} loading="lazy" className="w-full aspect-square object-contain" />
      <span className="font-display text-lg">{cap(p.name)}</span>
    </button>
  )
}

function StatBar({ name, value }: { name: string; value: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-28 text-zinc-600">{cap(name)}</span>
      <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-green"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (value / 160) * 100)}%` }}
        />
      </div>
      <span className="w-8 text-right">{value}</span>
    </div>
  )
}

function DetailModal({ entry, onClose }: { entry: Entry; onClose: () => void }) {
  const [data, setData] = useState<Detail | null>(null)
  const [error, setError] = useState('')
  const [tries, setTries] = useState(0)

  useEffect(() => {
    let live = true
    setData(null)
    setError('')
    fetchPokemonDetail(entry.id)
      .then((detail) => live && setData(detail))
      .catch(() => live && setError(`Couldn't load ${cap(entry.name)}. Check your connection and try again.`))
    return () => {
      live = false
    }
  }, [entry, tries])

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-bg-base rounded-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-label={cap(entry.name)}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-display text-3xl">{cap(entry.name)}</h3>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-black text-white">×</button>
        </div>
        <img src={art(entry.id)} alt={entry.name} className="w-48 h-48 object-contain mx-auto" />
        {error ? (
          <ErrorBox message={error} onRetry={() => setTries(tries + 1)} />
        ) : !data ? (
          <Loading label="Loading details…" />
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {data.types.map((t) => (
                <span key={t.type.name} className="bg-black text-white rounded-full px-3 py-1 text-xs">
                  {cap(t.type.name)}
                </span>
              ))}
            </div>
            <p className="text-sm text-zinc-700">
              Height {data.height / 10} m · Weight {data.weight / 10} kg
            </p>
            <p className="text-sm text-zinc-700">
              Abilities: {data.abilities.map((a) => cap(a.ability.name)).join(', ')}
            </p>
            <div className="space-y-2">
              {data.stats.map((s) => (
                <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

function ComparePanel({
  entries,
  ids,
  onSelect,
  comparison,
  loading,
  error,
  onCompare,
}: {
  entries: Entry[]
  ids: [string, string]
  onSelect: (slot: 0 | 1, id: string) => void
  comparison: [Detail, Detail] | null
  loading: boolean
  error: string
  onCompare: () => void
}) {
  const disabled = loading || !ids[0] || !ids[1] || ids[0] === ids[1]

  return (
    <div className="mt-5 rounded-xl border border-black/10 bg-white/55 p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {([0, 1] as const).map((slot) => (
          <label key={slot} className="flex-1 text-xs font-medium text-zinc-600">
            {slot === 0 ? 'First Pokémon' : 'Second Pokémon'}
            <select
              value={ids[slot]}
              onChange={(event) => onSelect(slot, event.target.value)}
              disabled={loading}
              className="mt-2 w-full rounded-md border border-black/10 bg-white px-3 py-3 text-sm text-zinc-900 outline-none focus:border-black/40"
            >
              <option value="">Choose a Pokémon…</option>
              {entries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  #{String(entry.id).padStart(3, '0')} · {cap(entry.name)}
                </option>
              ))}
            </select>
          </label>
        ))}
        <button
          onClick={onCompare}
          disabled={disabled}
          className="rounded-full bg-black px-5 py-3 text-sm text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? 'Comparing…' : 'Compare'}
        </button>
      </div>
      {ids[0] && ids[0] === ids[1] && (
        <p className="mt-2 text-xs text-zinc-500">Choose two different Pokémon to compare.</p>
      )}
      {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      {comparison && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5" aria-label="Pokémon comparison">
          {comparison.map((pokemon) => (
            <article key={pokemon.id} className="min-w-0 rounded-lg border border-black/5 bg-white p-3 sm:p-5">
              <div className="flex flex-col items-center text-center">
                <img
                  src={art(pokemon.id)}
                  alt={cap(pokemon.name)}
                  className="h-20 w-20 object-contain sm:h-28 sm:w-28"
                />
                <h3 className="font-display text-base font-medium sm:text-xl">{cap(pokemon.name)}</h3>
                <div className="mt-2 flex flex-wrap justify-center gap-1">
                  {pokemon.types.map(({ type: pokemonType }) => (
                    <span key={pokemonType.name} className="rounded-full bg-zinc-100 px-2 py-1 text-[10px] text-zinc-600">
                      {cap(pokemonType.name)}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-zinc-500 sm:text-xs">
                  {pokemon.height / 10} m · {pokemon.weight / 10} kg
                </p>
              </div>
              <div className="mt-4 space-y-2.5">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="mb-1 flex justify-between gap-1 text-[10px] text-zinc-600">
                      <span className="truncate">{cap(stat.stat.name)}</span>
                      <span className="font-medium text-zinc-900">{stat.base_stat}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <motion.div
                        className="h-full rounded-full bg-brand-green"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (stat.base_stat / 160) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default function PokemonExplorer() {
  const [list, setList] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reload, setReload] = useState(0)
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [typeNames, setTypeNames] = useState<Set<string> | null>(null)
  const [typeLoading, setTypeLoading] = useState(false)
  const [selected, setSelected] = useState<Entry | null>(null)
  const [compareIds, setCompareIds] = useState<[string, string]>(['', ''])
  const [comparison, setComparison] = useState<[Detail, Detail] | null>(null)
  const [compareLoading, setCompareLoading] = useState(false)
  const [compareError, setCompareError] = useState('')

  const discoverRandom = () => {
    const candidates = list.filter((entry) => entry.id !== selected?.id)
    const pool = candidates.length > 0 ? candidates : list
    if (pool.length > 0) setSelected(pool[Math.floor(Math.random() * pool.length)])
  }

  const compareSelected = async () => {
    if (!compareIds[0] || !compareIds[1] || compareIds[0] === compareIds[1]) return
    setCompareLoading(true)
    setCompareError('')
    setComparison(null)
    try {
      const [first, second] = await Promise.all([
        fetchPokemonDetail(Number(compareIds[0])),
        fetchPokemonDetail(Number(compareIds[1])),
      ])
      setComparison([first, second])
    } catch {
      setCompareError("Couldn't load comparison data. Check your connection and try again.")
    } finally {
      setCompareLoading(false)
    }
  }

  // useEffect: fetch the first generation when the component loads (and on Refresh)
  useEffect(() => {
    let live = true
    setLoading(true)
    setError('')
    fetch(`${API}/pokemon?limit=151`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((d: { results: { name: string; url: string }[] }) => {
        if (!live) return
        setList(d.results.map((r) => ({ name: r.name, id: Number(r.url.split('/').filter(Boolean).pop()) })))
      })
      .catch(() => live && setError("Couldn't reach PokéAPI. Check your connection and try again."))
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
  }, [reload])

  // category filter: fetch the members of the chosen type
  useEffect(() => {
    if (type === 'all') {
      setTypeNames(null)
      return
    }
    let live = true
    setTypeLoading(true)
    fetch(`${API}/type/${type}`)
      .then((r) => r.json())
      .then((d: { pokemon: { pokemon: { name: string } }[] }) => {
        if (live) setTypeNames(new Set(d.pokemon.map((p) => p.pokemon.name)))
      })
      .catch(() => live && setTypeNames(new Set()))
      .finally(() => live && setTypeLoading(false))
    return () => {
      live = false
    }
  }, [type])

  const shown = useMemo(
    () =>
      list.filter(
        (p) => p.name.includes(query.trim().toLowerCase()) && (!typeNames || typeNames.has(p.name)),
      ),
    [list, query, typeNames],
  )

  return (
    <section id="explorer" className="relative z-10 bg-bg-base px-8 md:px-16 lg:px-20 py-24">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight">Pokémon Explorer</h2>
        <p className="mt-3 text-zinc-600 max-w-xl">Live data from PokéAPI. Search, filter, compare stats side by side, or discover a random Pokémon.</p>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Pokémon by name…"
            aria-label="Search Pokémon"
            className="flex-1 bg-white rounded-[6px] border border-black/5 px-4 py-3 text-sm outline-none focus:border-black/30"
          />
          <button
            onClick={() => setReload(reload + 1)}
            disabled={loading}
            className="rounded-full bg-[#1a1a1a] px-6 py-3 text-sm text-white disabled:opacity-50"
          >
            Refresh
          </button>
          <button
            onClick={discoverRandom}
            disabled={loading || list.length === 0}
            className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-50"
            aria-label="Discover a random Pokémon"
          >
            Surprise me 🎲
          </button>
        </div>

        <ComparePanel
          entries={list}
          ids={compareIds}
          onSelect={(slot, id) => {
            setCompareIds((current) => {
              const next: [string, string] = [current[0], current[1]]
              next[slot] = id
              return next
            })
            setComparison(null)
            setCompareError('')
          }}
          comparison={comparison}
          loading={compareLoading}
          error={compareError}
          onCompare={() => void compareSelected()}
        />

        <div className="mt-4 flex gap-2 flex-wrap" role="group" aria-label="Filter by type">
          {['all', ...TYPES].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={`rounded-full px-4 py-1.5 text-sm border transition ${
                type === t ? 'bg-brand-green border-black text-black' : 'bg-white/60 border-black/10 hover:bg-white'
              }`}
            >
              {cap(t)}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {loading ? (
            <Loading label="Loading Pokémon…" />
          ) : error ? (
            <ErrorBox message={error} onRetry={() => setReload(reload + 1)} />
          ) : typeLoading ? (
            <Loading label="Filtering by type…" />
          ) : shown.length === 0 ? (
            <p className="py-16 text-center text-zinc-600">No Pokémon match. Clear the search or pick another type.</p>
          ) : (
            <>
              <p className="mb-4 text-sm text-zinc-500">{shown.length} Pokémon</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {shown.map((p) => (
                  <PokemonCard key={p.id} p={p} onOpen={setSelected} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>{selected && <DetailModal entry={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </section>
  )
}
