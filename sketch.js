var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, trex_down;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var bird, bird_running, bird_collided;

array = [ ] ;




function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_down = loadAnimation("trexdown.png")
  bird_running = loadAnimation("trex_bird.png","trex_bird_2.png");
  bird_collided = loadAnimation("trex_bird.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  //birdImage = loadImage("trex_bird.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameover_t-removebg-preview.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(displayWidth, displayHeight/2);
  
  trex = createSprite(60,100,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("down", trex_down);
  trex.scale = 0.5;
  
  ground = createSprite(displayWidth,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(5.3 + 3*score/500);
  
  gameOver = createSprite(displayWidth/2,80);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,140);
  restart.addImage(restartImg);

  gameOver.scale = 0.3;
  restart.scale = 0.7;
  obstacle1.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  birdGroup = new Group();
  
  score = 0;
}

function draw() {
  trex.debug = false;
  background(255);
  text("Score: "+ score, displayWidth/1.1,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(5.3 + 3*score/500);
  
    if((touches.length > 0 || keyDown("SPACE")) && trex.y >= height-120) {
trex.velocityY = -12;
touches = [];
}
  trex.debug = false;
 
    
  trex.setCollider("circle",0,8,40);
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12; 
     }
    if(ground.isTouching(trex)){
      trex.changeAnimation("running", trex_running)
    } 
    else {
      trex.changeAnimation("collided", trex_collided); 
    }
    if(keyDown("UP") && trex.y >= 159) {
      trex.velocityY = -12; 
     }
    if(ground.isTouching(trex)){
      trex.changeAnimation("running", trex_running)
    }
    else {
      trex.changeAnimation("collided", trex_collided); 
    }
    if(keyDown("DOWN") && trex.y >= 159) { 
      trex.changeAnimation("down", trex_down)
     }
    trex.velocityY = trex.velocityY + 0.8
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
    spawnBirds();
  
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
   
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    birdGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    bird.changeAnimation("collided", bird_collided);

    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
      if(keyDown("space")) {
        reset();
      }
      if(keyDown("UP")) {
        reset();
      }
    
  }
  
  if(gameState === END){
    // bird.changeAnimation("collided", bird_collided);
  
    //bird.pause();
    console.log(1);
   }
  
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth/1.1,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = displayWidth;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnBirds() {
  //write code here to spawn the clouds
  if (frameCount % 120 === 0) {
    var bird = createSprite(displayWidth/1.1,120,40,10);
    bird.y = Math.round(random(60,100));
    bird.addAnimation("running", bird_running);
  //  bird.changeAnimation("collided", bird_collided);
  //  bird.addAnimation("collided", bird_collided);
    bird.scale = 0.3;
    bird.velocityX = -5;
    
     //assign lifetime to the variable
    bird.lifetime = displayWidth;
    
    //adjust the depth
    bird.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    birdGroup.add(bird);
  }
  
}


function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(displayWidth,160,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(5.3 + 3*score/500);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
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
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = displayWidth;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  birdGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  
 
  
  score = 0;
  
}