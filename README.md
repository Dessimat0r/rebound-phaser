# Rebound Phaser

Rebound Phaser is a browser-based reimagining of **Poing**, the cult-classic Amiga bat-and-ball game. The historical Nintendo DS homebrew implementation is preserved in [`nds_old/`](nds_old) for posterity, but the game you run in this repository is a modern HTML5 rebuild powered by [Phaser 3](https://phaser.io/).

## Features
- Sideways, bat-and-ball action where the real goal is punching through to the back wall.
- Eight-screen sets with a rescue run that slings the ball through earlier screens when you miss.
- Colour-coded brick formations that mix score bricks, bonus bricks, regenerating waves, and concealed power-ups.
- A live side panel showing brick values, back-wall progress, score, bonus multiplier, and remaining lives.
- Built-in self-test autopilot so you can watch the game exercise itself while you debug or demo changes.

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
- **T**: Toggle the self-test autopilot on or off.

## Gameplay overview
- **Punch through to the back wall.** Each screen asks you to carve a channel through the brick formation and tag the far-right wall a set number of times to open the exit.
- **Eight-screen sets.** Screens are grouped into sets of eight. Missing the ball sends it racing back through the previous screens; catch it during the rescue run to resume play from that screen. Miss again on the first screen of the set and you lose a life.
- **Brick diversity.** Colours map to different score and bonus values, some bricks need multiple hits, and marked formations regenerate after being cleared for extra scoring opportunities.
- **Hidden power-ups.** Strike revealed bonus bricks twice to claim rewards such as bonus multipliers, extra lives, or a gentler “Flux” ball.

## Score & bonus panel
- The right-hand HUD lists each brick colour, how many hits it needs, and whether it feeds your score or bonus meter.
- The back-wall tracker shows how many more hits you need before the exit opens.
- Bonus multipliers apply to everything marked as bonus—including back-wall hits—so stack them before cracking the exit for maximum effect.

## Self-test mode
Tap **T** to enable the automated paddle. It will launch the ball, chase it across the playfield, and keep playing indefinitely—perfect for smoke-testing physics tweaks or grabbing footage without juggling the controls.

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
