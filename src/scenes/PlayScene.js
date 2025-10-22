const SCREENS_PER_SET = 8;
const DEFAULT_BACK_WALL_HITS = 10;
const BACK_WALL_BONUS = 80;
const PADDLE_SPEED = 520;
const BASE_BALL_SPEED = 300;
const BALL_SPEED_INCREMENT = 14;
const MAX_BALL_SPEED = 600;
const PADDLE_X = 72;
const PADDLE_WIDTH = 24;
const PADDLE_HEIGHT = 140;
const BALL_RADIUS = 12;

const BRICK_TYPES = {
  A: {
    label: 'Ice',
    color: 0x14f1ff,
    hits: 1,
    score: 60,
    bonus: 0,
    chipScore: 16,
    order: 1,
  },
  B: {
    label: 'Surge',
    color: 0x11c6ff,
    hits: 1,
    score: 80,
    bonus: 0,
    chipScore: 18,
    order: 2,
  },
  C: {
    label: 'Cobalt',
    color: 0x0f8bff,
    hits: 2,
    score: 120,
    bonus: 15,
    chipScore: 18,
    order: 3,
  },
  D: {
    label: 'Amber',
    color: 0xffd02b,
    hits: 2,
    score: 0,
    bonus: 60,
    chipScore: 20,
    regenGroup: 'amber',
    order: 4,
  },
  E: {
    label: 'Solar',
    color: 0xffa928,
    hits: 1,
    score: 0,
    bonus: 90,
    chipScore: 18,
    order: 5,
  },
  F: {
    label: 'Forge',
    color: 0xff7f32,
    hits: 3,
    score: 160,
    bonus: 0,
    chipScore: 22,
    order: 6,
  },
  G: {
    label: 'Pulse',
    color: 0xf9416c,
    hits: 1,
    score: 0,
    bonus: 120,
    chipScore: 22,
    order: 7,
  },
  H: {
    label: 'Nova',
    color: 0xc13796,
    hits: 2,
    score: 220,
    bonus: 0,
    chipScore: 24,
    regenGroup: 'violet',
    order: 8,
  },
  M: {
    label: 'Multiplier',
    color: 0xf4fca5,
    hits: 1,
    score: 0,
    bonus: 0,
    powerUp: 'bonusMultiplier',
    order: 9,
    listInTable: false,
  },
  L: {
    label: 'Extra Life',
    color: 0xa5ffdf,
    hits: 1,
    score: 0,
    bonus: 0,
    powerUp: 'extraLife',
    order: 10,
    listInTable: false,
  },
  S: {
    label: 'Flux',
    color: 0xe4b0ff,
    hits: 1,
    score: 0,
    bonus: 0,
    powerUp: 'slowBall',
    order: 11,
    listInTable: false,
  },
};

const LEVEL_SCREENS = [
  {
    id: 'aurora-01',
    title: 'Aurora 1',
    requiredBackWallHits: 10,
    layout: [
      '....AAAABBBB',
      '....AAAABBBB',
      '....CCCCHHHH',
      '....DDDDGGGG',
      '....EEEEFFFF',
      '..........mm',
    ],
  },
  {
    id: 'aurora-02',
    title: 'Aurora 2',
    requiredBackWallHits: 11,
    layout: [
      '..AABBCCDDEE',
      '..AABBCCDDEE',
      '..FFGGHHFFGG',
      '....EEEEEEEE',
      '..HHGGFFHHGG',
      '..mmssllmmss',
    ],
  },
  {
    id: 'aurora-03',
    title: 'Aurora 3',
    requiredBackWallHits: 12,
    layout: [
      '..AAAABBCCDD',
      '..AAAABBCCDD',
      '..EEEFFGGHHH',
      '..EEEFFGGHHH',
      '..HHGGFFGGHH',
      '..mmssllmmss',
    ],
  },
  {
    id: 'aurora-04',
    title: 'Aurora 4',
    requiredBackWallHits: 11,
    layout: [
      '..AA..BB..AA',
      '.CCDDCCDDCC.',
      '.EEFFGGFFEE.',
      '..HHHHHHHH..',
      '..GGFFEEFFGG',
      '..mmssllmm..',
    ],
  },
  {
    id: 'aurora-05',
    title: 'Aurora 5',
    requiredBackWallHits: 12,
    layout: [
      '..AAAAAAA...',
      '.BBCCCCCCB..',
      '.DDDD..DDDD.',
      '.EEFFFFFEE..',
      '.GGGGGGGGGG.',
      '..mmssllmm..',
    ],
  },
  {
    id: 'aurora-06',
    title: 'Aurora 6',
    requiredBackWallHits: 13,
    layout: [
      '..AA..AA..AA',
      '.BBCCDDCCBB.',
      '.EEFFGGFFEE.',
      '.HHHHHHHHHH.',
      '.GGFFEEFFGG.',
      '..mmssllmm..',
    ],
  },
  {
    id: 'aurora-07',
    title: 'Aurora 7',
    requiredBackWallHits: 13,
    layout: [
      '...AAAABB...',
      '..CCCCDDCC..',
      '.EEFFGGFFEE.',
      '.HHHHHHHHHH.',
      '.GGFFEEFFGG.',
      '..mmssllmm..',
    ],
  },
  {
    id: 'aurora-08',
    title: 'Aurora 8',
    requiredBackWallHits: 14,
    layout: [
      '..AAA....AAA',
      '.BBBCCCCCCBB',
      '.DDD....DDDD',
      '.EEEFFFFFEEE',
      '..GGHHHHGG..',
      '..mmssllmm..',
    ],
  },
];

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');

    this.paddle = null;
    this.ball = null;
    this.bricks = null;
    this.backWall = null;
    this.scoreText = null;
    this.bonusText = null;
    this.multiplierText = null;
    this.livesText = null;
    this.levelText = null;
    this.backWallText = null;
    this.testModeText = null;
    this.messageText = null;
    this.pointTableTexts = [];

    this.cursors = null;
    this.keyW = null;
    this.keyS = null;
    this.launchKey = null;
    this.toggleTestKey = null;

    this.score = 0;
    this.bonus = 0;
    this.bonusMultiplier = 1;
    this.lives = 3;
    this.ballLaunched = false;
    this.ballSpeed = BASE_BALL_SPEED;
    this.exitOpen = false;
    this.backWallHits = 0;
    this.requiredBackWallHits = DEFAULT_BACK_WALL_HITS;

    this.currentScreenIndex = 0;
    this.activeScreenIndex = 0;
    this.screenLoop = 0;

    this.regenGroups = new Map();
    this.hiddenBricks = [];
    this.inRescueRun = false;
    this.rescueQueue = [];
    this.rescueTarget = null;
    this.autoPlay = false;
  }

  init(data) {
    this.score = data?.score ?? 0;
    this.bonus = data?.bonus ?? 0;
    this.bonusMultiplier = data?.bonusMultiplier ?? 1;
    this.lives = data?.lives ?? 3;
    this.currentScreenIndex = data?.screenIndex ?? 0;
    this.activeScreenIndex = this.currentScreenIndex;
    this.screenLoop = data?.screenLoop ?? 0;
  }

  create() {
    this.physics.world.setBounds(0, 0, this.scale.width, this.scale.height);

    this.createPaddle();
    this.createBall();
    this.createBackWall();
    this.createUI();

    this.bricks = this.physics.add.staticGroup();
    this.loadScreen(this.currentScreenIndex);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.launchKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.toggleTestKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.T,
    );

    this.input.on('pointermove', (pointer) => {
      if (this.autoPlay) {
        return;
      }
      this.movePaddleTo(pointer.y);
    });

    this.input.on('pointerdown', () => {
      if (!this.ballLaunched && !this.inRescueRun) {
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

    this.physics.add.collider(
      this.ball,
      this.backWall,
      this.handleBackWallHit,
      undefined,
      this,
    );
  }

  update(_, delta) {
    if (Phaser.Input.Keyboard.JustDown(this.toggleTestKey)) {
      this.autoPlay = !this.autoPlay;
      this.showMessage(this.autoPlay ? 'Self-test enabled' : 'Self-test disabled');
      if (this.autoPlay && !this.ballLaunched && !this.inRescueRun) {
        this.launchBall();
      }
      this.updateUI();
    }

    this.handleKeyboard(delta);
    this.handleAutoPlay(delta);

    if (!this.ballLaunched && !this.inRescueRun) {
      this.attachBallToPaddle();
      if (Phaser.Input.Keyboard.JustDown(this.launchKey)) {
        this.launchBall();
      }
    }

    if (this.ballLaunched) {
      this.ensureBallHasVerticalMomentum();
    }

    if (this.ballLaunched && this.ball.x < -BALL_RADIUS * 2) {
      if (this.inRescueRun) {
        this.handleRescueMiss();
      } else {
        this.beginRescueOrLoseLife();
      }
    }

    if (this.exitOpen && this.ball.x > this.scale.width + BALL_RADIUS * 2) {
      this.advanceScreen();
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

  createBackWall() {
    const wallWidth = 14;
    this.backWall = this.add
      .rectangle(
        this.scale.width - wallWidth / 2,
        this.scale.height / 2,
        wallWidth,
        this.scale.height - 80,
        0x1a2144,
        0.7,
      )
      .setOrigin(0.5);
    this.physics.add.existing(this.backWall, true);
  }

  createUI() {
    const textStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: '16px',
      color: '#f8f8f8',
      letterSpacing: 1.5,
    };

    const panelWidth = 220;
    const panelLeft = this.scale.width - panelWidth + 16;
    const panel = this.add.graphics();
    panel.fillStyle(0x0c1329, 0.7);
    panel.fillRoundedRect(panelLeft - 16, 16, panelWidth, this.scale.height - 32, 18);
    panel.lineStyle(2, 0x45d6ff, 0.35);
    panel.strokeRoundedRect(panelLeft - 16, 16, panelWidth, this.scale.height - 32, 18);

    this.scoreText = this.add.text(24, 24, '', textStyle);
    this.bonusText = this.add.text(24, 52, '', textStyle);
    this.multiplierText = this.add.text(24, 80, '', textStyle);
    this.livesText = this.add.text(24, 108, '', textStyle);
    this.levelText = this.add.text(24, 136, '', textStyle);

    this.messageText = this.add
      .text(this.scale.width / 2, this.scale.height / 2, '', {
        ...textStyle,
        fontSize: '20px',
        align: 'center',
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.backWallText = this.add.text(panelLeft, this.scale.height - 112, '', {
      ...textStyle,
      fontSize: '14px',
    });

    this.testModeText = this.add.text(24, this.scale.height - 40, '', {
      ...textStyle,
      fontSize: '14px',
    });

    this.add
      .text(panelLeft, 32, 'POINT TABLE', {
        ...textStyle,
        fontSize: '14px',
        color: '#9ae6ff',
      })
      .setOrigin(0, 0);

    this.createPointTable(panelLeft);

    this.add.text(panelLeft, this.scale.height - 76, 'Power-ups', {
      ...textStyle,
      fontSize: '12px',
      color: '#9ae6ff',
    });

    this.add.text(panelLeft, this.scale.height - 56, 'M  Bonus x2', {
      ...textStyle,
      fontSize: '12px',
    });
    this.add.text(panelLeft, this.scale.height - 40, 'L  +1 Life', {
      ...textStyle,
      fontSize: '12px',
    });
    this.add.text(panelLeft, this.scale.height - 24, 'S  Slow Ball', {
      ...textStyle,
      fontSize: '12px',
    });

    this.updateUI();
  }

  createPointTable(x) {
    const sortedEntries = Object.entries(BRICK_TYPES)
      .filter(([, type]) => type.listInTable !== false)
      .sort((a, b) => a[1].order - b[1].order);

    const textStyle = {
      fontFamily: 'Press Start 2P',
      fontSize: '12px',
      color: '#f0f6ff',
      letterSpacing: 1,
    };

    let offsetY = 64;
    sortedEntries.forEach(([key, type]) => {
      const sample = this.add
        .rectangle(x + 10, offsetY + 6, 18, 18, type.color)
        .setOrigin(0, 0.5)
        .setStrokeStyle(1, 0x0a0f1c, 0.6);

      const parts = [];
      if (type.score) {
        parts.push(`+${type.score} SCORE`);
      }
      if (type.bonus) {
        parts.push(`+${type.bonus} BONUS`);
      }
      if (type.hits > 1) {
        parts.push(`${type.hits} HITS`);
      }
      if (type.regenGroup) {
        parts.push('REGENERATES');
      }

      const text = this.add
        .text(x + 36, offsetY, `${key}  ${type.label.toUpperCase()}  ${parts.join(' · ')}`, textStyle)
        .setOrigin(0, 0);

      this.pointTableTexts.push({ sample, text });
      offsetY += 24;
    });
  }

  handleKeyboard(delta) {
    if (this.autoPlay) {
      this.paddle.body.setVelocityY(0);
      return;
    }

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

  handleAutoPlay(delta) {
    if (!this.autoPlay) {
      return;
    }

    const smoothing = Phaser.Math.Clamp(delta / 160, 0.08, 0.22);
    const targetY = this.ballLaunched ? this.ball.y : this.scale.height / 2;
    const lerped = Phaser.Math.Linear(this.paddle.y, targetY, smoothing);
    this.movePaddleTo(lerped);

    if (!this.ballLaunched && !this.inRescueRun) {
      this.launchBall();
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
    this.ballSpeed = BASE_BALL_SPEED + this.screenLoop * 12;

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
    this.ballSpeed = BASE_BALL_SPEED + this.screenLoop * 12;
    this.exitOpen = false;
    this.backWallHits = 0;
    this.ball.body.checkCollision.right = true;
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
    if (this.inRescueRun) {
      this.endRescueSuccessfully();
    }

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

  handleBrickHit(_, brick) {
    if (!brick) {
      return;
    }

    if (brick.getData('concealed')) {
      return;
    }

    const typeKey = brick.getData('typeKey');
    const type = BRICK_TYPES[typeKey];
    if (!type) {
      return;
    }

    if (brick.getData('powerUpReady')) {
      this.activatePowerUp(brick, type);
      return;
    }

    const remainingHits = (brick.getData('hits') ?? type.hits) - 1;

    if (remainingHits <= 0) {
      if (type.powerUp && !brick.getData('powerUpReady')) {
        this.revealPowerUp(brick, type);
      } else {
        this.applyBrickRewards(type);
        this.handleBrickRemoval(brick, type);
      }
    } else {
      brick.setData('hits', remainingHits);
      this.applyBrickRewards(type, true);
      this.updateBrickVisual(brick, type, remainingHits);
    }

    this.increaseBallSpeed();
    this.updateUI();
  }

  applyBrickRewards(type, partial = false) {
    if (partial) {
      const chip = type.chipScore ?? 12;
      this.score += chip;
      return;
    }

    if (type.score) {
      this.score += type.score;
    }
    if (type.bonus) {
      this.bonus += type.bonus * this.bonusMultiplier;
    }
  }

  updateBrickVisual(brick, type, remainingHits) {
    const baseColor = Phaser.Display.Color.IntegerToColor(type.color);
    const target = Phaser.Display.Color.ValueToColor(0xfdfdfd);
    const mix = Phaser.Display.Color.Interpolate.ColorWithColor(
      baseColor,
      target,
      type.hits,
      type.hits - remainingHits,
    );
    const tint = Phaser.Display.Color.GetColor(mix.r, mix.g, mix.b);
    brick.setFillStyle(tint, 1);
    this.time.delayedCall(0, () => {
      brick.body?.updateFromGameObject?.();
    });
  }

  revealPowerUp(brick, type) {
    brick.setData('powerUpReady', true);
    brick.setData('hits', 1);
    brick.setFillStyle(type.color, 1);
    brick.setStrokeStyle(2, 0x88ffcc, 0.85);
    brick.setAlpha(0.45);
    this.tweens.add({
      targets: brick,
      alpha: { from: 0.2, to: 1 },
      duration: 420,
      yoyo: true,
      repeat: 2,
      onComplete: () => {
        brick.setAlpha(0.85);
      },
    });
    this.showMessage(`${type.label} revealed`);
  }

  activatePowerUp(brick, type) {
    switch (type.powerUp) {
      case 'bonusMultiplier': {
        this.bonusMultiplier = Phaser.Math.Clamp(this.bonusMultiplier + 1, 1, 5);
        this.showMessage(`Bonus x${this.bonusMultiplier}`);
        break;
      }
      case 'extraLife': {
        this.lives = Math.min(this.lives + 1, 9);
        this.showMessage('Extra life!');
        break;
      }
      case 'slowBall': {
        this.ballSpeed = Math.max(BASE_BALL_SPEED, this.ballSpeed - 80);
        const direction = this.ball.body.velocity.clone();
        if (direction.length() > 0) {
          direction.normalize();
          this.ball.body.setVelocity(
            direction.x * this.ballSpeed,
            direction.y * this.ballSpeed,
          );
        }
        this.showMessage('Flux ball engaged');
        break;
      }
      default:
        break;
    }

    this.applyBrickRewards(type);
    this.handleBrickRemoval(brick, type);
    this.updateUI();
  }

  handleBrickRemoval(brick, type) {
    const colIndex = brick.getData('colIndex');
    const rowIndex = brick.getData('rowIndex');
    const regenGroup = brick.getData('regenGroup');

    if (brick.getData('isHidden')) {
      Phaser.Utils.Array.Remove(this.hiddenBricks, brick);
    }

    brick.destroy();
    this.handleCoverRemoval(colIndex, rowIndex);

    if (regenGroup) {
      this.scheduleRegenCheck(regenGroup, type);
    }
  }

  handleCoverRemoval(colIndex, rowIndex) {
    this.hiddenBricks.forEach((hiddenBrick) => {
      if (!hiddenBrick?.getData) {
        return;
      }
      if (hiddenBrick.getData('colIndex') !== colIndex) {
        return;
      }
      if (hiddenBrick.getData('rowIndex') <= rowIndex) {
        return;
      }

      const coverCount = (hiddenBrick.getData('coverCount') ?? 0) - 1;
      hiddenBrick.setData('coverCount', coverCount);
      if (coverCount <= 0 && hiddenBrick.getData('concealed')) {
        this.revealHiddenBrick(hiddenBrick);
      }
    });
  }

  scheduleRegenCheck(groupId) {
    const hasActive = this.bricks.getChildren().some(
      (child) => child.active && child.getData('regenGroup') === groupId,
    );

    if (hasActive) {
      return;
    }

    const group = this.regenGroups.get(groupId);
    if (!group || group.pending) {
      return;
    }

    group.pending = true;
    this.time.delayedCall(1100, () => {
      group.pending = false;
      this.respawnRegenGroup(groupId);
    });
  }

  respawnRegenGroup(groupId) {
    const group = this.regenGroups.get(groupId);
    if (!group) {
      return;
    }

    const stillEmpty = !this.bricks.getChildren().some(
      (child) => child.active && child.getData('regenGroup') === groupId,
    );

    if (!stillEmpty) {
      return;
    }

    group.blueprints.forEach((blueprint) => {
      this.createBrickFromBlueprint({ ...blueprint });
    });

    this.showMessage('Formation regenerated');
  }

  createBrickFromBlueprint(blueprint) {
    const type = BRICK_TYPES[blueprint.typeKey];
    if (!type) {
      return null;
    }

    const brickWidth = 48;
    const brickHeight = 24;

    const brick = this.add
      .rectangle(blueprint.x, blueprint.y, brickWidth, brickHeight, type.color)
      .setStrokeStyle(2, 0x0c1229, 0.5);

    brick.setData('typeKey', blueprint.typeKey);
    brick.setData('hits', type.hits);
    brick.setData('colIndex', blueprint.colIndex);
    brick.setData('rowIndex', blueprint.rowIndex);
    brick.setData('isHidden', blueprint.isHidden);
    brick.setData('coverCount', blueprint.coverCount);
    brick.setData('concealed', blueprint.isHidden && blueprint.coverCount > 0);
    brick.setData('powerUpReady', false);
    brick.setData('powerUp', type.powerUp ?? null);
    brick.setData('regenGroup', type.regenGroup ?? null);

    this.physics.add.existing(brick, true);
    this.bricks.add(brick);

    if (blueprint.isHidden) {
      this.hiddenBricks.push(brick);
      if (blueprint.coverCount > 0) {
        brick.setActive(false);
        brick.setVisible(false);
        brick.body.enable = false;
      } else {
        this.revealHiddenBrick(brick);
      }
    }

    return brick;
  }

  revealHiddenBrick(brick) {
    if (!brick) {
      return;
    }

    brick.setData('concealed', false);
    brick.setActive(true);
    brick.setVisible(true);
    brick.body.enable = true;
    brick.setAlpha(0.8);
    this.tweens.add({
      targets: brick,
      alpha: { from: 0.3, to: 1 },
      duration: 360,
      ease: 'Sine.easeInOut',
      repeat: 1,
      yoyo: true,
    });
  }

  loadScreen(index, options = {}) {
    const { rescue = false } = options;
    const targetIndex = Phaser.Math.Wrap(index, 0, LEVEL_SCREENS.length);
    const screen = LEVEL_SCREENS[targetIndex];

    this.activeScreenIndex = targetIndex;
    if (!rescue) {
      this.currentScreenIndex = targetIndex;
    }

    this.requiredBackWallHits = screen.requiredBackWallHits ?? DEFAULT_BACK_WALL_HITS;
    this.backWallHits = 0;
    this.exitOpen = false;
    this.ball.body.checkCollision.right = true;
    this.backWall.setFillStyle(0x1a2144, 0.7);
    this.backWall.setAlpha(0.7);

    this.bricks.clear(true, true);
    this.hiddenBricks = [];
    this.populateLevel(screen.layout);
    this.resetBall();

    this.updateUI();
  }

  populateLevel(layout) {
    this.regenGroups = new Map();

    const brickWidth = 48;
    const brickHeight = 24;
    const padding = 12;
    const startX = this.scale.width * 0.45;
    const startY = 72;

    const columnCover = new Map();

    layout.forEach((row, rowIndex) => {
      [...row].forEach((symbol, colIndex) => {
        if (symbol === '.') {
          return;
        }

        const typeKey = symbol.toUpperCase();
        const type = BRICK_TYPES[typeKey];
        if (!type) {
          return;
        }

        const coverCount = columnCover.get(colIndex) ?? 0;
        const blueprint = {
          typeKey,
          isHidden: symbol !== typeKey,
          coverCount,
          colIndex,
          rowIndex,
          x: startX + colIndex * (brickWidth + padding),
          y: startY + rowIndex * (brickHeight + padding),
        };

        if (type.regenGroup) {
          const group = this.regenGroups.get(type.regenGroup) ?? { blueprints: [], pending: false };
          group.blueprints.push({ ...blueprint, isHidden: false, coverCount: 0 });
          this.regenGroups.set(type.regenGroup, group);
        }

        this.createBrickFromBlueprint(blueprint);
        columnCover.set(colIndex, coverCount + 1);
      });
    });
  }

  getSetStartIndex(index) {
    return Math.floor(index / SCREENS_PER_SET) * SCREENS_PER_SET;
  }

  beginRescueOrLoseLife() {
    const setStart = this.getSetStartIndex(this.currentScreenIndex);
    if (this.currentScreenIndex > setStart) {
      this.startRescueRun();
    } else {
      this.applyLifeLoss();
    }
  }

  startRescueRun() {
    this.rescueQueue = [];
    const setStart = this.getSetStartIndex(this.currentScreenIndex);
    for (let i = this.currentScreenIndex - 1; i >= setStart; i -= 1) {
      this.rescueQueue.push(i);
    }

    if (this.rescueQueue.length === 0) {
      this.applyLifeLoss();
      return;
    }

    this.inRescueRun = true;
    this.showMessage('Rescue run!');
    this.launchRescueScreen();
  }

  prepareRescueBall() {
    this.ballLaunched = true;
    this.ballSpeed = MAX_BALL_SPEED * 0.82;
    const startY = Phaser.Math.Clamp(
      this.ball.y,
      BALL_RADIUS * 2,
      this.scale.height - BALL_RADIUS * 2,
    );
    this.ball.setPosition(this.scale.width - 60, startY);
    this.ball.body.checkCollision.right = true;
    this.ball.body.setVelocity(
      -this.ballSpeed,
      Phaser.Math.Between(-220, 220),
    );
  }

  launchRescueScreen() {
    if (!this.inRescueRun) {
      return;
    }

    if (this.rescueQueue.length === 0) {
      this.applyLifeLoss();
      return;
    }

    this.rescueTarget = this.rescueQueue.shift();
    this.loadScreen(this.rescueTarget, { rescue: true });
    this.prepareRescueBall();
    this.updateUI();
  }

  handleRescueMiss() {
    if (this.rescueQueue.length > 0) {
      this.launchRescueScreen();
      return;
    }

    this.inRescueRun = false;
    this.rescueTarget = null;
    this.applyLifeLoss();
  }

  endRescueSuccessfully() {
    this.inRescueRun = false;
    this.rescueQueue = [];
    this.rescueTarget = null;
    this.currentScreenIndex = this.activeScreenIndex;
    this.ballSpeed = Math.max(this.ballSpeed, BASE_BALL_SPEED + this.screenLoop * 12);
    this.showMessage('Caught it! Keep pushing!');
    this.updateUI();
  }

  applyLifeLoss() {
    this.ballLaunched = false;
    this.lives -= 1;
    if (this.lives <= 0) {
      this.endGame();
      return;
    }

    this.showMessage('Life lost');
    const setStart = this.getSetStartIndex(this.currentScreenIndex);
    this.currentScreenIndex = setStart;
    this.loadScreen(this.currentScreenIndex);
  }

  advanceScreen() {
    let nextIndex = this.currentScreenIndex + 1;
    if (nextIndex >= LEVEL_SCREENS.length) {
      this.screenLoop += 1;
      nextIndex = 0;
      this.showMessage('Set cleared!');
    }

    this.currentScreenIndex = nextIndex;
    this.loadScreen(nextIndex);
  }

  handleBackWallHit() {
    if (this.exitOpen) {
      return;
    }

    this.backWallHits += 1;
    this.bonus += BACK_WALL_BONUS * this.bonusMultiplier;
    this.backWall.setFillStyle(0x2cf28b, 0.85);
    this.backWall.setAlpha(0.9);
    this.tweens.add({
      targets: this.backWall,
      alpha: { from: 0.9, to: 0.4 },
      duration: 220,
      yoyo: true,
    });

    if (this.backWallHits >= this.requiredBackWallHits) {
      this.openExit();
    }

    this.updateUI();
  }

  openExit() {
    this.exitOpen = true;
    this.ball.body.checkCollision.right = false;
    this.backWall.setFillStyle(0x51f1b6, 0.45);
    this.backWall.setAlpha(0.25);
    this.showMessage('Back wall breached! Dive through!');
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

  updateUI() {
    const setIndex = Math.floor(this.currentScreenIndex / SCREENS_PER_SET) + 1;
    const screenInSet = (this.activeScreenIndex % SCREENS_PER_SET) + 1;
    this.scoreText.setText(`SCORE ${this.score.toString().padStart(6, '0')}`);
    this.bonusText.setText(`BONUS ${Math.floor(this.bonus).toString().padStart(6, '0')}`);
    this.multiplierText.setText(`MULTI x${this.bonusMultiplier}`);
    this.livesText.setText(`LIVES ${this.lives}`);
    this.levelText.setText(`SET ${setIndex} · SCREEN ${screenInSet}`);
    this.backWallText.setText(
      `BACK WALL ${this.backWallHits}/${this.requiredBackWallHits}`,
    );
    this.testModeText.setText(
      this.autoPlay ? 'SELF-TEST: ON (T)' : 'SELF-TEST: OFF (T)',
    );
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

  endGame() {
    this.showMessage('Game Over');
    this.time.delayedCall(1500, () => {
      this.scene.restart({
        score: 0,
        bonus: 0,
        bonusMultiplier: 1,
        lives: 3,
        screenIndex: 0,
        screenLoop: 0,
      });
    });
  }
}
