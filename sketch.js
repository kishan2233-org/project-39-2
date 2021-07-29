//declaring global variables


var PLAY = 1;
var END = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var backgroundObject;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var background;
var green;

var congratulation, congratulationImage;

function preload(){
  //loading animation for trex
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  
  //loading image for ground
  groundImage = loadImage("ground2.png");
  backgroundImage = loadImage("sky.png");

  //loading image for cloud
  cloudImage = loadImage("cloud.png");
  
  //loading image for obstacles
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //loading image for restart & game over sprite 
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  ////loading sounds
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

  congratulationImage = loadImage("congratulation8.png")
}

function setup() { 
  createCanvas(displayWidth,displayHeight/2);
  
  //declaring local variables
  var message = "This is a message";
 console.log(message)
  
 green = createSprite(0,350,displayWidth,71);
 green.shapeColor = 'green'

  //create a trex sprite
  trex = createSprite(200,290,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(0,320,displayWidth,1000);
  ground.addImage("ground",groundImage);
  ground.scale = 1;
  
  //create a game over sprite
  gameOver = createSprite(displayWidth/2,180);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.6;
  
   //create a restart sprite
  restart = createSprite(displayWidth/2,220);
  restart.addImage(restartImg);
    restart.scale = 0.6;
  
 //create an invisible ground sprite
  invisibleGround = createSprite(0,320,displayWidth,10);
   invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

 //setting collider area for trex
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false
  
  // assigning initial value to score
  score = 0;
  
}

function draw() {
  stroke(5);
  background(backgroundImage);
  //displaying score
  fill(0);
  textSize(22);
  text("Score: "+ score, 1200,130);

  textSize(40);
  text("INFINITE T-REX RUNNER GAME", 410,50);

  textSize(40);
  text("-----------------------------------------------",400,70);


  fill("red");
  textSize(22)
  text("(Hint: Press Space bar key to jump the Trex)",40,130);
 
  
  text("( Your target: Cross the score of 2000)",970,170);

  green.x=ground.x;
  green.width=ground.width;

  //assigning different behaviour to objects according to game state
  if(gameState === PLAY){

    //making  gameover & restart sprite invisible
    gameOver.visible = false;
    restart.visible = false;
    
    //increasing speed of ground
    ground.velocityX = -(4 + 3* score/100)
    
    //increasing  score
    score = score + Math.round(getFrameRate()/60);
    
    //play sound after every 100 score
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //reset ground to make it infinite
    if (ground.x < 1000){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0); 

    }
  }
   else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
   
   //change the trex animation
    trex.changeAnimation("collided", trex_collided);
  
   
   
    ground.velocityX = 0;
    trex.velocityY = 0
    
   
    //set lifetime of the game objects so that they are never destroyed
  obstaclesGroup.setLifetimeEach(-1);
  cloudsGroup.setLifetimeEach(-1);
   
   obstaclesGroup.setVelocityXEach(0);
   cloudsGroup.setVelocityXEach(0); 
   
 }


  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }

    if(score >= 2000){
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0); 

      obstaclesGroup.destroyEach();
      cloudsGroup.destroyEach();

      ground.velocityX = 0;
      trex.visible=false;

      gameOver.visible = false;
      restart.visible = false;
    
      gameState = END; 

     congratulation=createSprite(displayWidth/2,180);
     congratulation.addImage(congratulationImage);
     
     fill(0);
     textSize(30);
     text("You completed Your target",500,270);
      
     
    }

  drawSprites();
}

function reset(){
 gameState=PLAY; 
  restart.visible=false;
  gameOver.visible=false;
  obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score=0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,305,10,40);
   obstacle.velocityX = -(6 + score/100);
   
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
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);

    camera.velocityX = obstaclesGroup.velocityX;
         
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }

  
}


