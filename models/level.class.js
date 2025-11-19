class Level {
    enemies;
    coins;
    clouds;
    backgroundObjects;
    level_end_x = 2000;

    constructor(enemies,coins, clouds, backgroundObjects){
        this.enemies = enemies;
        this.coin = coins
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}