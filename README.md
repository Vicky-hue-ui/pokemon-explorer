# Pokémon Explorer

A responsive Pokémon discovery experience built with React, TypeScript, Vite, Tailwind CSS, and Motion. Explore the original 151 Pokémon, filter by type, search by name, view detailed stats, compare two Pokémon, or discover a random pick.

## Features

- Search Pokémon by name
- Filter the original 151 Pokémon by elemental type
- Refresh live PokéAPI data
- Open a detailed modal with artwork, types, height, weight, abilities, and base stats
- Compare two Pokémon side by side
- Discover a random Pokémon
- Loading, empty, and error states with retry support
- Responsive layouts and accessible controls

## Tech Stack

- React 19
- TypeScript
- Vite 7
- Tailwind CSS 4
- Motion (`motion/react`)
- PokéAPI
- GitHub Pages-ready static build output

## Project Structure

```text
pokemon-explorer/
├── src/
│   ├── components/
│   │   └── PokemonExplorer.tsx  # Search, filters, details, and comparison UI
│   ├── App.tsx                   # Application shell
│   ├── index.css                 # Tailwind theme and global styles
│   └── main.tsx                  # React entry point
├── dist/                         # Generated production build
├── index.html                    # Vite HTML entry
├── vite.config.js                # React and Tailwind plugins
└── package.json                  # Scripts and dependencies
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
git clone https://github.com/Vicky-hue-ui/pokemon-explorer.git
cd pokemon-explorer
npm install
```

### Development

```bash
npm run dev
```

Open the local URL displayed by Vite (typically `http://localhost:5173`).

### Production Build

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Data Source

Pokémon Explorer uses the public [PokéAPI](https://pokeapi.co/) service and official artwork hosted with PokeAPI's sprite resources. An internet connection is required for live Pokémon data and images.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Deployment

The production build is generated in `dist/`. This folder can be deployed to a static hosting service such as GitHub Pages, Netlify, or Vercel.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes
4. Push to your branch
5. Open a pull request

## License

No license has been specified for this project.

## Acknowledgments

- [PokéAPI](https://pokeapi.co/) for the Pokémon data
- PokeAPI's official artwork assets
- React and the Vite community
