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
    "./img/4_enemie_boss_chicken/1_walk/G4.png"
  ];

  IMAGES_ALERT = [
    "./img/4_enemie_boss_chicken/2_alert/G5.png",
    "./img/4_enemie_boss_chicken/2_alert/G6.png",
    "./img/4_enemie_boss_chicken/2_alert/G7.png",
    "./img/4_enemie_boss_chicken/2_alert/G8.png",
    "./img/4_enemie_boss_chicken/2_alert/G9.png",
    "./img/4_enemie_boss_chicken/2_alert/G10.png",
    "./img/4_enemie_boss_chicken/2_alert/G11.png",
    "./img/4_enemie_boss_chicken/2_alert/G12.png"
  ];

  IMAGES_ATTACK = [
    "./img/4_enemie_boss_chicken/3_attack/G13.png",
    "./img/4_enemie_boss_chicken/3_attack/G14.png",
    "./img/4_enemie_boss_chicken/3_attack/G15.png",
    "./img/4_enemie_boss_chicken/3_attack/G16.png",
    "./img/4_enemie_boss_chicken/3_attack/G17.png",
    "./img/4_enemie_boss_chicken/3_attack/G18.png",
    "./img/4_enemie_boss_chicken/3_attack/G19.png",
    "./img/4_enemie_boss_chicken/3_attack/G20.png"
  ];

  IMAGES_HURT = [
    "./img/4_enemie_boss_chicken/4_hurt/G21.png",
    "./img/4_enemie_boss_chicken/4_hurt/G22.png",
    "./img/4_enemie_boss_chicken/4_hurt/G23.png"
  ];

  IMAGES_DEAD = [
    "./img/4_enemie_boss_chicken/5_dead/G24.png",
    "./img/4_enemie_boss_chicken/5_dead/G25.png",
    "./img/4_enemie_boss_chicken/5_dead/G26.png"
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
    allSounds.push(this.endbossHurtAudio, this.endbossAlertAudio, this.endbossDeadAudio);
  }

  animate() {
    setInterval(() => {
      if (this.handleDeathOrHurt()) return;
      if (this.handleFirstContact()) return;
      if (this.handleAlertPhase()) return;
      if (this.handleAttackPhase()) return;
      this.playWalkAndFollow();
    }, 300);
  }

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

  handleFirstContact() {
    if (!this.hadFirstContact) {
      if (this.world.character.x <= 1360) return true;
      this.hadFirstContact = true;
      this.alertStartTime = Date.now();
      return true;
    }
    return false;
  }

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

  playWalkAndFollow() {
    this.playAnimation(this.IMAGES_WALK);
    this.followCharacter();
  }

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

  hitEndboss() {
    this.energy -= 33;
    if (this.energy <= 0) {
      this.handleDeath();
      return;
    }
    this.lastHit = Date.now();
  }

  handleDeath() {
    this.energy = 0;
    this.dead = true;
    this.stopAllChickenAudioSystem();
    this.playEndbossDeathSound();

    this.playDeathAnimationFully(() => {
      gameStopped = true;
      this.winGame();
      this.scheduleEndbossRemoval();
    });
  }

  stopAllChickenAudioSystem() {
    stopAllChickenSounds();
    stopAllSounds();
    this.world.level.enemies.forEach(enemy => {
      if (enemy instanceof Chicken) enemy.stopChickenSound();
    });
  }

  playEndbossDeathSound() {
    playSound(this.endbossDeadAudio);
    setTimeout(() => {
      this.endbossDeadAudio.pause();
      this.endbossDeadAudio.currentTime = 0;
    }, 1000);
  }

  scheduleEndbossRemoval() {
    setTimeout(() => {
      this.world.level.enemies = this.world.level.enemies.filter(e => e !== this);
    }, 1500);
  }

  playDeathAnimationFully(callback) {
    let frameIndex = 0;
    const interval = setInterval(() => {
      this.playAnimation(this.IMAGES_DEAD);
      frameIndex++;
      if (frameIndex >= this.IMAGES_DEAD.length) {
        clearInterval(interval);
        callback();
      }
    }, 200);
  }
}