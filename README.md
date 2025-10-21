# Rebound Phaser

Rebound Phaser is a browser-based reimagining of **Poing**, the cult-classic Amiga bat-and-ball game. The historical Nintendo DS homebrew implementation is preserved in [`nds_old/`](nds_old) for posterity, but the game you run in this repository is a modern HTML5 rebuild powered by [Phaser 3](https://phaser.io/).

## Features
- Fast-paced, physics-driven paddle-and-ball gameplay inspired by Poing.
- Progressive levels with different brick layouts and speed ramps.
- Mouse/touch controls alongside keyboard support for the paddle.
- Lightweight codebase composed of vanilla ES modules—no bundler required.

## Getting started
1. Install [Node.js](https://nodejs.org/) 18 or newer.
2. Start the local development server:
   ```bash
   npm start
   ```
3. Open your browser to `http://localhost:8080`.

If you prefer to use another static file server, run one from the repository root (for example `python -m http.server 8080`).

## Controls
- **Mouse / Touch**: Move the paddle vertically by dragging or moving the pointer.
- **Keyboard**: Use **W / S** or the **Up / Down arrow keys** to slide the paddle.
- **Space**: Launch the ball when it is resting on the paddle.

## Project structure
```
├── README.md           – Project overview and instructions
├── AGENTS.md           – Contribution guidance for this repository
├── index.html          – Entry point that loads Phaser and the game code
├── package.json        – Development server script definition
├── scripts
│   └── serve.mjs       – Lightweight static file server used by `npm start`
├── src
│   ├── main.js         – Game bootstrap and Phaser configuration
│   └── scenes
│       └── PlayScene.js – Core gameplay scene
├── styles.css          – Global presentation styles
└── nds_old             – Archived Nintendo DS homebrew source
```

## Development notes
- The game code intentionally avoids transpilers and bundlers to stay approachable.
- Phaser is loaded from a CDN to keep the repository lightweight.
- Feel free to extend the level definitions in `src/scenes/PlayScene.js` to add more variety.

## License
The new Phaser implementation is released under the MIT License. Refer to `nds_old/readme.txt` for the original DS project licensing information.
