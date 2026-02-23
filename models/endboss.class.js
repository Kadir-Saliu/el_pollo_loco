class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  energy = 99;
  world;
  speed = 20;

  IMAGES_WALK = [
    "./img/4_enemie_boss_chicken/1_walk/G1.png",
    "./img/4_enemie_boss_chicken/1_walk/G2.png",
    "./img/4_enemie_boss_chicken/1_walk/G3.png",
    "./img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  IMAGES_ALERT = [
    "./img/4_enemie_boss_chicken/2_alert/G5.png",
    "./img/4_enemie_boss_chicken/2_alert/G6.png",
    "./img/4_enemie_boss_chicken/2_alert/G7.png",
    "./img/4_enemie_boss_chicken/2_alert/G8.png",
    "./img/4_enemie_boss_chicken/2_alert/G9.png",
    "./img/4_enemie_boss_chicken/2_alert/G10.png",
    "./img/4_enemie_boss_chicken/2_alert/G11.png",
    "./img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HURT = [
    "./img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "./img/4_enemie_boss_chicken/5_dead/G24.png",
    "./img/4_enemie_boss_chicken/5_dead/G25.png",
    "./img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  hadFirstContact = false;
  alertOver = false;
  attackRange = 10;

  endbossHurtAudio = new Audio("audio/endboss-hurt.mp3");
  endbossAlertAudio = new Audio("audio/endboss-alert.mp3");
  endbossDeadAudio = new Audio("audio/endboss-dead.mp3");

  constructor(world) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.offset = { top: 120, bottom: 40, left: 60, right: 60 };
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.world = world;
    this.x = 1800;
    allSounds.push(
      this.endbossHurtAudio,
      this.endbossAlertAudio,
      this.endbossDeadAudio,
    );
  }

  /**
   * Starts the endboss behavior loop.
   */
  animate() {
    setInterval(() => {
      if (this.handleDeathOrHurt()) return;
      if (this.handleFirstContact()) return;
      if (this.handleAlertPhase()) return;
      if (this.handleAttackPhase()) return;
      this.playWalkAndFollow();
    }, 300);
  }

  /**
   * Handles death or hurt animation states.
   * @returns {boolean} Whether the boss is dead or hurt.
   */
  handleDeathOrHurt() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
      return true;
    }
    if (this.isHurt()) {
      playSound(this.endbossHurtAudio);
      this.playAnimation(this.IMAGES_HURT);
      return true;
    }
    return false;
  }

  /**
   * Handles the first contact trigger when the player approaches.
   * @returns {boolean} Whether first contact logic was executed.
   */
  handleFirstContact() {
    if (!this.hadFirstContact) {
      if (this.world.character.x <= 1360) return true;
      this.hadFirstContact = true;
      this.alertStartTime = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Handles the alert animation and sound phase.
   * @returns {boolean} Whether the alert phase is active.
   */
  handleAlertPhase() {
    if (Date.now() - this.alertStartTime < 3000) {
      if (!this.alertSoundPlayed) {
        playSound(this.endbossAlertAudio);
        this.alertSoundPlayed = true;
      }
      this.playAnimation(this.IMAGES_ALERT);
      return true;
    }
    return false;
  }

  /**
   * Handles the attack animation phase.
   * @returns {boolean} Whether the attack phase is active.
   */
  handleAttackPhase() {
    if (!this.alertOver) {
      this.alertOver = true;
      this.attackStartTime = Date.now();
      return true;
    }
    if (Date.now() - this.attackStartTime < 1000) {
      this.playAnimation(this.IMAGES_ATTACK);
      return true;
    }
    return false;
  }

  /**
   * Plays walking animation and moves the boss toward the player.
   */
  playWalkAndFollow() {
    this.playAnimation(this.IMAGES_WALK);
    this.followCharacter();
  }

  /**
   * Moves the boss toward the character based on distance.
   */
  followCharacter() {
    const char = this.world.character;
    const distance = this.x - char.x;

    if (distance < 0) {
      this.otherDirection = true;
      this.x += this.speed;
      return;
    }
    if (distance > this.attackRange) {
      this.otherDirection = false;
      this.x -= this.speed;
      return;
    }
    this.playAnimation(this.IMAGES_ATTACK);
  }

  /**
   * Applies damage to the endboss.
   */
  hitEndboss() {
    this.energy -= 33;

    if (this.energy <= 0) {
      this.handleDeath();
      return;
    }

    this.lastHit = Date.now();
  }

  /**
   * Handles the complete death sequence.
   */
  handleDeath() {
    gameStopped = true;
    this.setDeathState();
    this.stopAllChickenAudioSystem();
    this.playEndbossDeathSound();
    this.scheduleWinScreen();
    this.scheduleEndbossRemoval();
  }

  /**
   * Sets the death state.
   */
  setDeathState() {
    this.energy = 0;
    this.dead = true;
  }

  /**
   * Stops all chicken audio systems.
   */
  stopAllChickenAudioSystem() {
    stopAllChickenSounds();
    stopAllSounds();
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Chicken) {
        enemy.stopChickenSound();
      }
    });
  }

  /**
   * Plays and stops the endboss death sound.
   */
  playEndbossDeathSound() {
    playSound(this.endbossDeadAudio);

    setTimeout(() => {
      if (this.endbossDeadAudio) {
        this.endbossDeadAudio.pause();
        this.endbossDeadAudio.currentTime = 0;
      }
    }, 1000);
  }

  /**
   * Schedules the win screen.
   */
  scheduleWinScreen() {
    setTimeout(() => this.winGame(), 1500);
  }

  /**
   * Removes the endboss from the level.
   */
  scheduleEndbossRemoval() {
    setTimeout(() => {
      this.world.level.enemies = this.world.level.enemies.filter(
        (enemy) => enemy !== this,
      );
    }, 1500);
  }
}
