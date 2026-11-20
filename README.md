# mėntality + Pokémon Explorer

React (Vite) + Tailwind CSS v4 + motion/react. The mėntality landing page (Navbar + Hero) is unchanged;
the "Build Your Own API" challenge lives in `src/components/PokemonExplorer.tsx` below the hero.

## Run
    npm install
    npm run dev

## Challenge checklist (PokéAPI)
- useState: list, search, type filter, selected Pokémon, loading/error state
- useEffect: fetches data on load, on Refresh, on type change, and when a card opens
- Fetch API: /pokemon?limit=151, /type/{type}, /pokemon/{id}
- Loading state + error handling with retry
- Reusable components: PokemonCard, StatBar, DetailModal, Loading, ErrorBox
- Bonus: search, Refresh button, type-based filtering
