import PlayScene from './scenes/PlayScene.js';

const GAME_WIDTH = 960;
const GAME_HEIGHT = 540;

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0b0b19',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [PlayScene],
};

const game = new Phaser.Game(config);

if (typeof window !== 'undefined') {
  window.__PHASER_GAME__ = game;
}
