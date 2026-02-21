class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 60;
  energy = 99;
  world;
  speed = 10;

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

  constructor(world) {
    super().loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALK);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.world = world;
    this.x = 1800;
  }
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
      this.moveLeft();
    }, 300);
  }

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

  moveLeft() {
    this.x -= this.speed;
  }
}
