const LEVEL_DEFINITIONS = [
  [
    '...11112222',
    '...11112222',
    '...33334444',
    '...55556666',
    '...77778888',
  ],
  [
    '...11223344',
    '...22113344',
    '...33221144',
    '...44332211',
    '...55443322',
    '...66554433',
  ],
  [
    '...11111111',
    '..122222221',
    '.1333333331',
    '133444444331',
    '.1333333331',
    '..122222221',
    '...11111111',
  ],
];

const BRICK_COLORS = {
  1: 0x14f1ff,
  2: 0x11c6ff,
  3: 0x0f8bff,
  4: 0xffd02b,
  5: 0xffa928,
  6: 0xff7f32,
  7: 0xf9416c,
  8: 0xc13796,
};

const PADDLE_SPEED = 520;
const BASE_BALL_SPEED = 300;
const BALL_SPEED_INCREMENT = 14;
const MAX_BALL_SPEED = 560;
const PADDLE_X = 72;
const PADDLE_WIDTH = 24;
const PADDLE_HEIGHT = 140;
const BALL_RADIUS = 12;

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');

    this.paddle = null;
    this.ball = null;
    this.bricks = null;
    this.scoreText = null;
    this.livesText = null;
    this.levelText = null;
    this.messageText = null;

    this.cursors = null;
    this.keyW = null;
    this.keyS = null;
    this.launchKey = null;

    this.score = 0;
    this.lives = 3;
    this.levelIndex = 0;
    this.ballLaunched = false;
    this.ballSpeed = BASE_BALL_SPEED;
  }

  init(data) {
    this.score = data?.score ?? 0;
    this.lives = data?.lives ?? 3;
    this.levelIndex = data?.levelIndex ?? 0;
  }

  create() {
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    this.createPaddle();
    this.createBall();
    this.createUI();

    this.bricks = this.physics.add.staticGroup();
    this.loadLevel(this.levelIndex);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.launchKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.input.on('pointermove', (pointer) => {
      this.movePaddleTo(pointer.y);
    });

    this.input.on('pointerdown', () => {
      if (!this.ballLaunched) {
        this.launchBall();
      }
    });

    this.physics.add.collider(
      this.ball,
      this.paddle,
      this.handlePaddleCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.handleBrickHit,
      undefined,
      this,
    );

    this.events.on('wake', () => {
      this.resetBall();
      this.updateUI();
    });
  }

  update(time, delta) {
    this.handleKeyboard(delta);

    if (!this.ballLaunched) {
      this.attachBallToPaddle();
      if (Phaser.Input.Keyboard.JustDown(this.launchKey)) {
        this.launchBall();
      }
    } else {
      this.ensureBallHasVerticalMomentum();
      if (this.ball.x < -BALL_RADIUS * 2) {
        this.loseLife();
      }
    }
  }

  createPaddle() {
    this.paddle = this.add.rectangle(
      PADDLE_X,
      this.scale.height / 2,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      0x28f7a4,
    );
    this.physics.add.existing(this.paddle);
    this.paddle.body.setImmovable(true);
    this.paddle.body.setAllowGravity(false);
    this.paddle.body.setCollideWorldBounds(true);
  }

  createBall() {
    this.ball = this.add.circle(
      PADDLE_X + PADDLE_WIDTH,
      this.paddle.y,
      BALL_RADIUS,
      0xffffff,
    );
    this.physics.add.existing(this.ball);
    this.ball.body.setBounce(1, 1);
    this.ball.body.setCircle(BALL_RADIUS);
    this.ball.body.setAllowGravity(false);
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.onWorldBounds = true;
    this.ball.body.checkCollision.left = false;
    this.ball.body.setMaxVelocity(MAX_BALL_SPEED, MAX_BALL_SPEED);
    this.resetBall();
  }

  createUI() {
    const textStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: '16px',
      color: '#f8f8f8',
      letterSpacing: 1.5,
    };

    this.scoreText = this.add.text(20, 20, '', textStyle);
    this.livesText = this.add.text(20, 48, '', textStyle);
    this.levelText = this.add.text(this.scale.width - 220, 20, '', textStyle);

    this.messageText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, '', {
        ...textStyle,
        fontSize: '20px',
        align: 'center',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.updateUI();
  }

  handleKeyboard(delta) {
    const deltaSeconds = delta / 1000;
    const halfHeight = this.paddle.displayHeight / 2;
    const maxY = this.scale.height - halfHeight;
    const minY = halfHeight;

    let direction = 0;
    if (this.cursors.up.isDown || this.keyW.isDown) {
      direction = -1;
    } else if (this.cursors.down.isDown || this.keyS.isDown) {
      direction = 1;
    }

    if (direction !== 0) {
      this.paddle.y += direction * PADDLE_SPEED * deltaSeconds;
      this.paddle.y = Phaser.Math.Clamp(this.paddle.y, minY, maxY);
      this.paddle.body.updateFromGameObject();
    } else {
      this.paddle.body.setVelocityY(0);
    }
  }

  movePaddleTo(y) {
    const halfHeight = this.paddle.displayHeight / 2;
    this.paddle.y = Phaser.Math.Clamp(
      y,
      halfHeight,
      this.scale.height - halfHeight,
    );
    this.paddle.body.updateFromGameObject();
  }

  attachBallToPaddle() {
    const offset = this.paddle.displayWidth / 2 + BALL_RADIUS + 4;
    this.ball.x = this.paddle.x + offset;
    this.ball.y = this.paddle.y;
    this.ball.body.setVelocity(0, 0);
    this.ball.body.updateFromGameObject();
  }

  launchBall() {
    if (this.ballLaunched) {
      return;
    }

    this.ballLaunched = true;
    this.ballSpeed = BASE_BALL_SPEED;

    const angle = Phaser.Math.DegToRad(Phaser.Math.Between(-35, 35));
    const velocity = new Phaser.Math.Vector2(
      Math.cos(angle),
      Math.sin(angle),
    )
      .normalize()
      .scale(this.ballSpeed);

    velocity.x = Math.abs(velocity.x);
    if (velocity.x < this.ballSpeed * 0.6) {
      velocity.x = this.ballSpeed * 0.6;
    }

    this.ball.body.setVelocity(velocity.x, velocity.y);
  }

  resetBall() {
    this.ballLaunched = false;
    this.ballSpeed = BASE_BALL_SPEED;
    this.attachBallToPaddle();
  }

  ensureBallHasVerticalMomentum() {
    const { velocity } = this.ball.body;
    if (Math.abs(velocity.y) < 60) {
      const sign = velocity.y >= 0 ? 1 : -1;
      velocity.y = sign * 80;
      this.ball.body.setVelocity(velocity.x, velocity.y);
    }
  }

  handlePaddleCollision(ball, paddle) {
    const relativeIntersectY = ball.y - paddle.y;
    const normalized = relativeIntersectY / (paddle.displayHeight / 2);
    const clamped = Phaser.Math.Clamp(normalized, -1, 1);
    const bounceAngle = clamped * Phaser.Math.DegToRad(75);

    const velocity = new Phaser.Math.Vector2(
      Math.cos(bounceAngle),
      Math.sin(bounceAngle),
    )
      .normalize()
      .scale(this.ballSpeed);

    velocity.x = Math.abs(velocity.x);
    this.ball.body.setVelocity(velocity.x, velocity.y);
  }

  handleBrickHit(ball, brick) {
    if (!brick.active) {
      return;
    }

    const remainingHits = (brick.getData('hits') ?? 1) - 1;

    if (remainingHits <= 0) {
      this.score += 50;
      brick.destroy();
    } else {
      brick.setData('hits', remainingHits);
      const color = BRICK_COLORS[remainingHits] ?? 0xffffff;
      brick.setFillStyle(color, 1);
      this.score += 20;
      this.time.delayedCall(0, () => {
        brick.body?.updateFromGameObject?.();
      });
    }

    this.increaseBallSpeed();
    this.updateUI();

    if (this.bricks.countActive(true) === 0) {
      this.onLevelCleared();
    }
  }

  increaseBallSpeed() {
    this.ballSpeed = Phaser.Math.Clamp(
      this.ballSpeed + BALL_SPEED_INCREMENT,
      BASE_BALL_SPEED,
      MAX_BALL_SPEED,
    );

    const currentVelocity = this.ball.body.velocity.clone();
    if (currentVelocity.length() === 0) {
      return;
    }

    const direction = currentVelocity.normalize();
    this.ball.body.setVelocity(
      direction.x * this.ballSpeed,
      direction.y * this.ballSpeed,
    );
  }

  loadLevel(index) {
    this.bricks.clear(true, true);

    const layout = LEVEL_DEFINITIONS[index % LEVEL_DEFINITIONS.length];
    const brickWidth = 48;
    const brickHeight = 24;
    const padding = 12;
    const startX = this.scale.width * 0.45;
    const startY = 80;

    layout.forEach((row, rowIndex) => {
      [...row].forEach((cell, colIndex) => {
        if (cell === '.' || cell === '0') {
          return;
        }

        const brick = this.add
          .rectangle(
            startX + colIndex * (brickWidth + padding),
            startY + rowIndex * (brickHeight + padding),
            brickWidth,
            brickHeight,
            BRICK_COLORS[cell] ?? 0xffffff,
          )
          .setStrokeStyle(2, 0x0c1229, 0.5);

        brick.setData('hits', Number(cell));
        this.physics.add.existing(brick, true);
        this.bricks.add(brick);
      });
    });

    this.levelIndex = index % LEVEL_DEFINITIONS.length;
    this.resetBall();
    this.updateUI();
  }

  onLevelCleared() {
    this.showMessage('Level cleared!');
    this.time.delayedCall(1200, () => {
      this.levelIndex = (this.levelIndex + 1) % LEVEL_DEFINITIONS.length;
      this.loadLevel(this.levelIndex);
    });
  }

  loseLife() {
    if (!this.ballLaunched) {
      return;
    }

    this.lives -= 1;
    this.updateUI();

    if (this.lives <= 0) {
      this.endGame();
    } else {
      this.showMessage('Life lost');
      this.time.delayedCall(800, () => {
        this.resetBall();
      });
    }
  }

  endGame() {
    this.showMessage('Game Over');
    this.time.delayedCall(1500, () => {
      this.scene.restart({
        score: 0,
        lives: 3,
        levelIndex: 0,
      });
    });
  }

  showMessage(text) {
    this.messageText.setText(text);
    this.tweens.killTweensOf(this.messageText);
    this.messageText.setAlpha(1);
    this.tweens.add({
      targets: this.messageText,
      alpha: 0,
      duration: 900,
      ease: 'Sine.easeOut',
      delay: 600,
    });
  }

  updateUI() {
    this.scoreText.setText(`SCORE ${this.score.toString().padStart(6, '0')}`);
    this.livesText.setText(`LIVES ${this.lives}`);
    this.levelText.setText(`LEVEL ${this.levelIndex + 1}`);
  }
}
