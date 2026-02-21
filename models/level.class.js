class Level {
  enemies;
  coins;
  bottles;
  clouds;
  backgroundObjects;
  level_end_x = 2000;

  constructor(enemies, coins, bottles, clouds, backgroundObjects) {
    this.enemies = enemies;
    this.coin = coins;
    this.bottles = bottles;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
  }
}
