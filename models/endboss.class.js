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
      if (this.world.character.x > 1360) {
        this.hadFirstContact = true;

        this.playAnimation(this.IMAGES_ALERT);

        setTimeout(() => {
          this.alertOver = true;
        }, 3000);

        this.playAnimation(this.IMAGES_ATTACK);

        if (this.hadFirstContact && this.alertOver) {
          this.playAnimation(this.IMAGES_WALK);
          this.moveLeft();
        }
      }
    }, 500);

  

    setInterval(() => {
      if (this.isDead()) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      }
    }, 50);
  }

  hitEndboss() {
    this.energy -= 33;
    if (this.energy <= 0) {
      this.energy = 0;
      this.dead = true;
      // trigger win screen then allow death animation to play, then remove endboss from level
      try {
        this.winGame();
      } catch (e) {}
      setTimeout(() => {
        if (this.world && this.world.level && this.world.level.enemies) {
          this.world.level.enemies = this.world.level.enemies.filter(
            (e) => e !== this
          );
        }
      }, 1000);
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  moveLeft() {
    this.x -= this.speed;
  }
}
