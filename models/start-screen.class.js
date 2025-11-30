class StartScreen extends MovableObject {
  IMAGES = [
    "./img/9_intro_outro_screens/start/startscreen_1.png",
    "./img/9_intro_outro_screens/start/startscreen_2.png",
  ];

  constructor() {
    super().loadImage("./img/9_intro_outro_screens/start/startscreen_1.png");
    this.loadImages(this.IMAGES);
    this.height = 200;
    this.width = 100 ;
    
  }
  
}
