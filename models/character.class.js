class Character extends MovableObject {
  height = 280;
  y = 160;
  speed = 10;

  IMAGES_WALKING = [
    "./img/2_character_pepe/2_walk/W-21.png",
    "./img/2_character_pepe/2_walk/W-22.png",
    "./img/2_character_pepe/2_walk/W-23.png",
    "./img/2_character_pepe/2_walk/W-24.png",
    "./img/2_character_pepe/2_walk/W-25.png",
    "./img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMP_UP = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
  ];

  IMAGES_JUMP_FALL = ["./img/2_character_pepe/3_jump/J-37.png"];

  IMAGES_JUMP_LAND = [
    "./img/2_character_pepe/3_jump/J-38.png",
    "./img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_DEAD = [
    "./img/2_character_pepe/5_dead/D-51.png",
    "./img/2_character_pepe/5_dead/D-52.png",
    "./img/2_character_pepe/5_dead/D-53.png",
    "./img/2_character_pepe/5_dead/D-54.png",
    "./img/2_character_pepe/5_dead/D-55.png",
    "./img/2_character_pepe/5_dead/D-56.png",
  ];

  IMAGES_HURT = [
    "./img/2_character_pepe/4_hurt/H-41.png",
    "./img/2_character_pepe/4_hurt/H-42.png",
    "./img/2_character_pepe/4_hurt/H-43.png",
  ];

  jumpAudio = new Audio("audio/jump-soundeffect-37532.mp3");
  coinAudio = new Audio("audio/get-coin-351945.mp3");
  characterHurtAudio = new Audio("audio/character-hurt.mp3");

  isHurtSoundPlayed = false;
  world;
  justLanded = false;

  /**
   * Creates the character, loads animations and starts movement loops.
   */
  constructor() {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");
    this.offset = { top: 120, bottom: 0, left: 10, right: 10 };
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMP_UP);
    this.loadImages(this.IMAGES_JUMP_FALL);
    this.loadImages(this.IMAGES_JUMP_LAND);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.applyGravity();
    this.animate();
    allSounds.push(this.jumpAudio, this.coinAudio, this.characterHurtAudio);
  }

  /**
   * Starts movement and animation loops.
   */
  animate() {
    setInterval(() => {
      if (!gameStopped) this.handleMovement();
    }, 1000 / 60);

    setInterval(() => {
      if (!gameStopped) this.handleAnimation();
    }, 100);
  }

  /**
   * Handles movement based on keyboard input.
   */
  handleMovement() {
    if (!this.world || !this.world.keyboard) return;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x)
      this.moveRight();

    if (this.world.keyboard.LEFT && this.x > 0) this.moveLeft();

    if (this.world.keyboard.SPACE && !this.isAboveGround()) this.jump();

    this.world.camera_x = -this.x + 100;
  }

  /**
   * Controls animation flow: death, hurt or movement.
   */
  handleAnimation() {
    if (this.handleDeathAnimation()) return;
    if (this.handleHurtAnimation()) return;
    this.handleMovementAnimation();
  }

  /**
   * Plays death animation.
   * @returns {boolean}
   */
  handleDeathAnimation() {
    if (!this.isDead()) return false;
    this.playAnimation(this.IMAGES_DEAD);
    stopAllSounds();
    return true;
  }

  /**
   * Plays hurt animation and sound.
   * @returns {boolean}
   */
  handleHurtAnimation() {
    if (!this.isHurt()) return false;

    this.playAnimation(this.IMAGES_HURT);

    if (!this.isHurtSoundPlayed) {
      playSound(this.characterHurtAudio);
      this.isHurtSoundPlayed = true;
    }

    return true;
  }

  /**
   * Plays jump, landing or walking animation.
   */
  handleMovementAnimation() {
    this.isHurtSoundPlayed = false;

    if (this.isAboveGround()) {
      this.justLanded = false;
      this.playJumpAnimation();
    } else {
      if (!this.justLanded) this.playLandingAnimation();
      else this.playWalkingAnimation();
    }
  }

  /**
   * Plays jump-up or fall animation.
   */
  playJumpAnimation() {
    if (this.speedY > 0) this.playAnimation(this.IMAGES_JUMP_UP);
    else if (this.speedY < 0) this.playAnimation(this.IMAGES_JUMP_FALL);
  }

  /**
   * Plays landing animation once.
   */
  playLandingAnimation() {
    if (this.justLanded) return;
    this.justLanded = true;
    this.playAnimation(this.IMAGES_JUMP_LAND);
  }

  /**
   * Plays walking animation.
   */
  playWalkingAnimation() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
      this.playAnimation(this.IMAGES_WALKING);
  }

  /**
   * Makes the character jump.
   */
  jump() {
    this.speedY = 30;
    this.justLanded = false;
    playSound(this.jumpAudio);
  }

  /**
   * Applies damage and knockback.
   * @param {number} damage
   */
  hitCharacter(damage) {
    this.energy -= damage;
    this.x += this.otherDirection ? 20 : -20;
    if (this.y > 160) this.y = 160;

    if (this.energy < 0) {
      this.energy = 0;
      this.stopGame();
    } else {
      this.lastHit = new Date().getTime();
    }
  }
}
