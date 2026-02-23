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

  IMAGES_JUMPING = [
    "./img/2_character_pepe/3_jump/J-31.png",
    "./img/2_character_pepe/3_jump/J-32.png",
    "./img/2_character_pepe/3_jump/J-33.png",
    "./img/2_character_pepe/3_jump/J-34.png",
    "./img/2_character_pepe/3_jump/J-35.png",
    "./img/2_character_pepe/3_jump/J-36.png",
    "./img/2_character_pepe/3_jump/J-37.png",
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

  /**
   * Creates a new character instance, loads all animations,
   * applies gravity, and starts movement/animation loops.
   */
  constructor() {
    super().loadImage("./img/2_character_pepe/2_walk/W-21.png");
    this.offset = { top: 120, bottom: 0, left: 10, right: 10 };
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
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
    setInterval(() => this.handleMovement(), 1000 / 60);
    setInterval(() => this.handleAnimation(), 50);
  }

  /**
   * Handles character movement based on keyboard input.
   */
  handleMovement() {
    if (!this.world || !this.world.keyboard) return;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
    }

    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
    }

    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }

    this.world.camera_x = -this.x + 100;
  }

  /**
   * Controls the character's animation flow by delegating to
   * death, hurt, or movement animation handlers. The first
   * matching state stops further processing.
   */
  handleAnimation() {
    if (this.handleDeathAnimation()) return;
    if (this.handleHurtAnimation()) return;
    this.handleMovementAnimation();
  }

  /**
   * Handles the death animation.
   * @returns {boolean} Whether the character is dead.
   */
  handleDeathAnimation() {
    if (!this.isDead()) return false;
    this.playAnimation(this.IMAGES_DEAD);
    stopAllSounds();
    return true;
  }

  /**
   * Handles the hurt animation and sound.
   * @returns {boolean} Whether the character is hurt.
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
   * Handles jump or walking animation depending on state.
   */
  handleMovementAnimation() {
    this.isHurtSoundPlayed = false;

    if (this.isAboveGround()) {
      this.playJumpAnimation();
    } else {
      this.playWalkingAnimation();
    }
  }

  /**
   * Plays the correct jump animation frame based on jump height.
   */
  playJumpAnimation() {
    const currentHeight = this.getJumpHeight();
    const frameIndex = this.getJumpFrameIndex(currentHeight);
    this.img = this.imageCache[this.IMAGES_JUMPING[frameIndex]];
  }

  /**
   * Returns the current jump height above ground.
   * @returns {number} Height above ground.
   */
  getJumpHeight() {
    const groundY = 160;
    return groundY - this.y;
  }

  /**
   * Returns the jump animation frame index based on height.
   * @param {number} currentHeight - Current jump height.
   * @returns {number} The resolved frame index.
   */
  getJumpFrameIndex(currentHeight) {
    const maxJumpHeight = 195;
    const frames = this.IMAGES_JUMPING.length;
    const heightPerFrame = maxJumpHeight / frames;
    let index = Math.floor(currentHeight / heightPerFrame);
    return Math.max(0, Math.min(frames - 1, index));
  }

  /**
   * Plays walking animation if movement keys are pressed.
   */
  playWalkingAnimation() {
    if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}
