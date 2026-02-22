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

  constructor(world) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.offset = {
      top: 120,
      bottom: 40,
      left: 60,
      right: 60,
    };
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.world = world;
    this.x = 1800;
  }
  /**
   * Runs the endboss behavior loop, switching animations and movement
   * based on its current state and timing phases.
   */
  animate() {
    setInterval(() => {
      if (this.isDead()) return this.playAnimation(this.IMAGES_DEAD);
      if (this.isHurt()) return this.playAnimation(this.IMAGES_HURT);
      if (!this.hadFirstContact) {
        if (this.world.character.x <= 1360) return;
        this.hadFirstContact = true;
        this.alertStartTime = Date.now();
      }
      if (Date.now() - this.alertStartTime < 3000)
        return this.playAnimation(this.IMAGES_ALERT);
      if (!this.alertOver) {
        this.alertOver = true;
        this.attackStartTime = Date.now();
      }
      if (Date.now() - this.attackStartTime < 1000)
        return this.playAnimation(this.IMAGES_ATTACK);
      this.playAnimation(this.IMAGES_WALK);
      this.followCharacter();
    }, 300);
  }

  /**
   * Determines the Endboss movement based on the player's position.
   *
   * - Moves right if the character is positioned to the right.
   * - Moves left if the character is positioned to the left and outside attack range.
   * - Plays the attack animation when the character is within attack range.
   *
   * @method followCharacter
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
   * Applies damage to the endboss and triggers death logic when energy reaches zero.
   *
   * @param {number} amount - The damage amount (fixed at 33 in this case).
   */
  hitEndboss() {
    this.energy -= 33;
    if (this.energy <= 0) {
      this.energy = 0;
      this.dead = true;
      setTimeout(() => this.winGame(), 1500);
      setTimeout(() => {
        this.world.level.enemies = this.world.level.enemies.filter(
          (e) => e !== this,
        );
      }, 1500);
      return;
    }
    this.lastHit = Date.now();
  }
}
