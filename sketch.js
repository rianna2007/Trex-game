var PLAY=1;
var END=0;
var gameState=PLAY;

var trex, trexrunning; 
var ground, groundimage, invisibleground;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, ObstacleGroup;

var gameOver, restart, gameOverimg, restartimg;

var cloudimage, CloudsGroup;

var trexcollided;

var checkpoint, die, jump;

var score=0;

var highscore=0;

function preload () {
  trexrunning=loadAnimation ("trex1.png", "trex3.png", "trex4.png");
  groundimage=loadImage ("ground2.png");
  
  cloudimage=loadImage ("cloud.png");
  
  obstacle1=loadImage ("obstacle1.png");
  obstacle2=loadImage ("obstacle2.png");
  obstacle3=loadImage ("obstacle3.png");
  obstacle4=loadImage ("obstacle4.png");
  obstacle5=loadImage ("obstacle5.png");
  obstacle6=loadImage ("obstacle6.png");
  
  gameOverimg=loadImage ("gameOver.png");
  restartimg=loadImage ("restart.png");
  
  trexcollided=loadAnimation ("trex_collided.png");
  
  jump=loadSound ("jump.mp3");
  checkpoint=loadSound ("checkPoint.mp3");
  die=loadSound ("die.mp3");
}
function setup() {
  createCanvas(600, 200);
  trex=createSprite(50,180,20,50);
  trex.addAnimation ("trex", trexrunning);
  trex.addAnimation ("trexcollided", trexcollided);
  trex.scale=0.5;
  
  ground=createSprite (200,180,400,20);
  ground.addImage (groundimage);
  ground.x = ground.width /2;
  
  invisibleground=createSprite (200, 185, 400, 5);
  invisibleground.visible=false;
  
  CloudsGroup=new Group ();
  ObstacleGroup=new Group ();
  
  gameOver=createSprite (300, 100);
  gameOver.addImage (gameOverimg);
  gameOver.scale=0.5;
  gameOver.visible=false;
  
  restart=createSprite (300, 140);
  restart.addImage (restartimg);
  restart.scale=0.5;
  restart.visible=false;
}

function draw() {
  background(180);
  text("Highscore :" + highscore, 320, 20);
  text ("Score :" + score, 470, 20);
  if (gameState==PLAY) {
    
      ground.velocityX = -2;
    
    score=score+Math.round (getFrameRate()/60);
    
    if (score>0 && score %100==0) {
      checkpoint.play ();
    }
    
    if (keyDown ("space")&& trex.y>=159) {
    trex.velocityY=-12;
      jump.play ();
      
    }
    trex.velocityY = trex.velocityY + 0.8;
    if (ground.x < 0){
    ground.x = ground.width/2;
  }
    spawnClouds ();
    spawnObstacles ();
    
  if(ObstacleGroup.isTouching(trex)){
    gameState = END;
    die.play ();
    
    }
  }
  else if (gameState==END) {
    ground.velocityX=0;
    
  ObstacleGroup.setVelocityXEach(0);
  CloudsGroup.setVelocityXEach(0);

  ObstacleGroup.setLifetimeEach(-1);
  CloudsGroup.setLifetimeEach(-1);
    
  restart.visible=true;
  gameOver.visible=true;
    
  trex.changeAnimation ("trexcollided", trexcollided);
  
  }
  
  if (mousePressedOver(restart)) {
  gameState=PLAY;
  ObstacleGroup.destroyEach();
  CloudsGroup.destroyEach();
  restart.visible=false;
  gameOver.visible=false;
  trex.changeAnimation ("trex", "trexrunning");
  if (highscore<score) {
  highscore=score;
  }
  score=0;
  }
  
  trex.collide(invisibleground);
  


  
  drawSprites ();
}
function spawnClouds () {
  if (World.frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(70,120);
    cloud.addImage("cloud",cloudimage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
    
  }
}

function spawnObstacles () {
  if (World.frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX=-6;
    var rand=Math.round (random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    obstacle.scale=0.5;
    obstacle.lifetime=100;
    ObstacleGroup.add (obstacle);
  }
}