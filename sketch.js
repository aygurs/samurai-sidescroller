//////Final Game Project//////

//Font//
var customFont;

// Character Object//
var character;

// Scenery Object//
var scenery;

//Game Mechanics//
var gameStatePaused;
var mechanics;

//Sprites//
/*Index 0-3 Running Left Sprites
Index 4-7 Running Right Sprites
Index 8-11 Idle Sprites
Index 12-15 Jump Right Sprites
Index 16-19 Jump left Sprites */
let samuraiAni = [];
let enemyAni = [];
//Only contains 4 sprites
let coinAni = [];
let secretAni = [];

//Sounds//
let bgMusic;
let coinSound;
let jumpSound;
let hurtSound;
let checkpointSound;
let gameoverSound;
let canyonSound;
let winSound;

//CREDITS//

/* Samurai Sprite
Made by LynigDesign
Link: https://lyniadesign.itch.io/tiny-2d-pixel-samurai
Accessed: 24/08/24 */

/* Enemy Sprite (Nightbourne Warrior)
Made by CreativeKind
Link: https://creativekind.itch.io/nightborne-warrior
Accessed: 25/08/24 */

/*Background Music
Made by Wolfgang_
Link: https://opengameart.org/content/8-bit-forest-theme
Accessed: 25/08/24 */

/* Jump, hurt, checkpoint, gameover, canyon and coin sounds
Made by phoenix1291
Link: https://opengameart.org/content/sound-effects-mini-pack15
Accessed: 25/08/24 */

/* Win sound effect
Made by Listener
Link: https://opengameart.org/content/win-sound-effect
Accessed: 25/08/24 */

/*Coin Sprite
Made by morgan3d
Link: https://opengameart.org/content/spinning-gold-coin
Accessed: 27/08/24 */

/*Secret monster sprite
Made by dogchicken
Link: https://opengameart.org/content/cute-monster-sprite-sheet
Accessed: 27/08/24 */

function preload(){
	//Font
	customFont = loadFont('assets/Jersey10-Regular.ttf');

	//Sounds
	bgMusic = loadSound('assets/sounds/TheForest.wav');
	coinSound = loadSound('assets/sounds/coin.mp3');
	jumpSound = loadSound('assets/sounds/jump.mp3');
	hurtSound = loadSound('assets/sounds/hurt.mp3');
	checkpointSound = loadSound('assets/sounds/checkpoint.mp3');
	gameoverSound = loadSound('assets/sounds/gameover.mp3');
	canyonSound = loadSound('assets/sounds/canyon.mp3');
	winSound = loadSound('assets/sounds/win.wav');

	//SAMURAI
	//Running left
	for (let i = 1; i <= 4; i++) {
		samuraiAni.push(loadImage(`assets/samurai/run${i}-left.png`));
	  };
	//Running right
	for (let i = 1; i <= 4; i++) {
		samuraiAni.push(loadImage(`assets/samurai/run${i}.png`));
	  };
	//Idle
	for (let i = 1; i <= 4; i++) {
		samuraiAni.push(loadImage(`assets/samurai/idle${i}.png`));
	  };
	//Jump right
	for (let i = 1; i <= 4; i++) {
		samuraiAni.push(loadImage(`assets/samurai/jump${i}.png`));
	  };
	//Jump left
	for (let i = 1; i <= 4; i++) {
		samuraiAni.push(loadImage(`assets/samurai/jump${i}-left.png`));
	  };

	//ENEMY
	//Running left
	for (let i = 1; i <= 4; i++) {
		enemyAni.push(loadImage(`assets/enemy/run${i}-left.png`));
	  };
	//Running right
	for (let i = 1; i <= 4; i++) {
		enemyAni.push(loadImage(`assets/enemy/run${i}.png`));
	  };

	//COIN
	for (let i = 1; i <= 4; i++) {
		coinAni.push(loadImage(`assets/coin/coin${i}.png`));
	  };

	//SECRET MONSTER
	for (let i = 1; i <= 4; i++) {
		secretAni.push(loadImage(`assets/secret/secret${i}.png`));
	  };
};

function setup()
{	
	//Creates initial canvas
	createCanvas(1024, 576);
	
	//Scenery Object Initialisation
	scenery = {
		//Floor Position Y
		floorPos_y: height * 3/4,
		//SKY Function
		drawSky: function(){
			background(21, 85, 138)
			//Stars
			for(let i = 0; i < this.stars.arr.length; i++){
				fill(242, 242, 242);
				ellipse(this.stars.arr[i].x_pos, this.stars.arr[i].y_pos, this.stars.arr[i].size, this.stars.arr[i].size);
			};

			//Moon
			//Sin ranges between 50 and -50 when multiplied by 50 (how much it expands)
			//frameCount * 0.02 controls speed of pulsing
			pulseAmount = sin(frameCount * 0.02) * 50;
			noStroke();
			fill(242, 242, 242);
			ellipse(1000, 20, 200, 200);
			fill(242, 242, 242, 20);
			//Outer rays
			//Multiplying width and height by pulseAmount increases and decreases them over time
			ellipse(1000, 20, 400 + pulseAmount, 400 + pulseAmount);
			fill(242, 242, 242, 10);
			ellipse(1000, 20, 600 + pulseAmount*2, 600 + pulseAmount*2);
		},
		//STARS Object
		stars: {
			arr: [],
			//Decide number of stars you want in the sky and pushes them to array
			numberOfStars: function(number){
				for(let i = 0; i < number; i++){
					this.arr.push({
						x_pos: random(10, width-10),
						y_pos: random(10, 400),
						size: 5
					});
				};
			}
		},
		//GROUND Function
		drawGround: function(){
			noStroke();
			//Mud floor
			fill(135, 106, 83);
			rect(0, scenery.floorPos_y+40, width, 200);
			fill(108, 85, 66);
			rect(0, scenery.floorPos_y+60, width, 200);
			fill(86, 68, 53);
			rect(0, scenery.floorPos_y+80, width, 200);
			fill(108, 85, 66);
			rect(0, scenery.floorPos_y+100, width, 200);
			fill(135, 106, 83);
			rect(0, scenery.floorPos_y+120, width, 200);
			//Blossom floor
			fill(217, 186, 207);
			rect(0, scenery.floorPos_y, width, 40);
		},
		//CLOUD Object
		cloud: {
			//Empty array to hold clouds
			arr: [],
			//Function to create multiple clouds based off of 'number' and pushes to array
			numberOfClouds: function(number){
				for(let i = 0; i < number; i++)
				{
					this.arr.push({
						x_pos: random(50, 1100),
						y_pos: random(50, 300),
						size: random(0.6, 1.5)
					});
				};
			},
			//Draws the clouds that are held in the array 'arr'
			drawClouds: function(){
				for(let i = 0; i < this.arr.length; i++)
				{
					//Moves clouds to left
					this.arr[i].x_pos -= 0.2;

					// Checks if a cloud x pos is off the left side of screen
					if(Math.round(this.arr[i].x_pos) <= mechanics.newBegin-130)
					{	
						// If yes, new x pos is right most side of screen + 80px (so you don't see it appear)
						this.arr[i].x_pos = mechanics.newEnd+80;
						// Changes y pos each time so same pattern isn't repeated
						this.arr[i].y_pos = random(50, 300);
					};
			
					// Checks if a cloud x pos is off the right side of screen
					/* The number added to newEnd in this if statement has to be larger than the
					number added to newEnd in the first if statement so they don't conflict */
					if(Math.round(this.arr[i].x_pos) >= mechanics.newEnd+100)
					{	
						// If yes, new x pos is left most side of screen - 130px (so you don't see it appear)
						this.arr[i].x_pos = mechanics.newBegin-130;
						this.arr[i].y_pos = random(50, 300);
					};

					//Draw cloud
					noStroke();
					fill(255, 255, 255, 220);
					ellipse(this.arr[i].x_pos+1*this.arr[i].size, this.arr[i].y_pos, 60*this.arr[i].size, 60*this.arr[i].size);
					ellipse(this.arr[i].x_pos+40*this.arr[i].size, this.arr[i].y_pos-20, 80*this.arr[i].size, 80*this.arr[i].size);
					ellipse(this.arr[i].x_pos+30*this.arr[i].size, this.arr[i].y_pos, 70*this.arr[i].size, 70*this.arr[i].size);
					ellipse(this.arr[i].x_pos+70*this.arr[i].size, this.arr[i].y_pos, 60*this.arr[i].size, 60*this.arr[i].size);
					ellipse(this.arr[i].x_pos+100*this.arr[i].size, this.arr[i].y_pos, 30*this.arr[i].size, 30*this.arr[i].size);
				};
			}
		},
		//MOUNTAIN Object
		mountain: {
			arr: [{x_pos:50, y_pos:430, size:1.2},{x_pos:400, y_pos:430, size:0.7},{x_pos:1950, y_pos:430, size:0.8},{x_pos:2200, y_pos:430, size:1.2},{x_pos:3800, y_pos:430, size:1},{x_pos:4100, y_pos:430, size:1}],
			drawMountains: function(){
				for(let i = 0; i < this.arr.length; i++)
				{
					noStroke();
					//Biggest mountain
					fill(130, 130, 130);
					triangle(scenery.mountain.arr[i].x_pos+1*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2, scenery.mountain.arr[i].x_pos+150*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-230, scenery.mountain.arr[i].x_pos+300*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2);
					//Shadow
					fill(65, 65, 65);
					triangle(scenery.mountain.arr[i].x_pos+190*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2, scenery.mountain.arr[i].x_pos+150*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-230, scenery.mountain.arr[i].x_pos+300*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2);
					
					//Second biggest mountain
					fill(130, 130, 130);
					triangle(scenery.mountain.arr[i].x_pos+150*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2, scenery.mountain.arr[i].x_pos+230*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-150, scenery.mountain.arr[i].x_pos+330*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2);
					//Shadow
					fill(65, 65, 65);
					triangle(scenery.mountain.arr[i].x_pos+270*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2, scenery.mountain.arr[i].x_pos+230*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-150, scenery.mountain.arr[i].x_pos+330*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2);
					
					//Left most smallest mountain
					fill(130, 130, 130);
					triangle(scenery.mountain.arr[i].x_pos-40*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2, scenery.mountain.arr[i].x_pos+30*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-80, scenery.mountain.arr[i].x_pos+150*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2);
					
					//Tip of mountain (on biggest mountain)
					fill(255);
					triangle(scenery.mountain.arr[i].x_pos+123*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-190, scenery.mountain.arr[i].x_pos+150*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-230, scenery.mountain.arr[i].x_pos+177*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-190);
					//Shadow
					fill(179, 179, 179)
					triangle(scenery.mountain.arr[i].x_pos+157*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-190, scenery.mountain.arr[i].x_pos+150*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-230, scenery.mountain.arr[i].x_pos+177*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-190);

					//Bottom of mountain
					fill(87, 87, 87);
					beginShape();
					vertex(scenery.mountain.arr[i].x_pos-100*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2);
					vertex(scenery.mountain.arr[i].x_pos-70*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-30);
					vertex(scenery.mountain.arr[i].x_pos-20*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-10);
					vertex(scenery.mountain.arr[i].x_pos+80*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-50);
					vertex(scenery.mountain.arr[i].x_pos+130*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-10);
					vertex(scenery.mountain.arr[i].x_pos+170*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-30);
					vertex(scenery.mountain.arr[i].x_pos+240*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-10);
					vertex(scenery.mountain.arr[i].x_pos+250*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-20);
					vertex(scenery.mountain.arr[i].x_pos+290*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-8);
					vertex(scenery.mountain.arr[i].x_pos+310*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos-40);
					vertex(scenery.mountain.arr[i].x_pos+370*scenery.mountain.arr[i].size, scenery.mountain.arr[i].y_pos+2);
					endShape(CLOSE);
				};
			}
		},
		//TREE Object
		tree: {
			arr: [{x_pos:100, y_pos:(height/2)-6, blossom_y1: (height/2)-7, blossom_y2: (height/2)-7, blossom_y3: (height/2)-7}, {x_pos:600, y_pos:(height/2)-6, blossom_y1: (height/2)-7, blossom_y2: (height/2)-7, blossom_y3: (height/2)-7}, {x_pos:950, y_pos:(height/2)-6, blossom_y1: (height/2)-7, blossom_y2: (height/2)-7, blossom_y3: (height/2)-7},{x_pos:2000, y_pos:(height/2)-6, blossom_y1: (height/2)-7, blossom_y2: (height/2)-7, blossom_y3: (height/2)-7},{x_pos:2500, y_pos:(height/2)-6, blossom_y1: (height/2)-7, blossom_y2: (height/2)-7, blossom_y3: (height/2)-7}, {x_pos:3450, y_pos:(height/2)-6, blossom_y1: (height/2)-7, blossom_y2: (height/2)-7, blossom_y3: (height/2)-7}, {x_pos:4300, y_pos:(height/2)-6, blossom_y1: (height/2)-7, blossom_y2: (height/2)-7, blossom_y3: (height/2)-7}],
			//Draws the trees that are held in the array 'arr'
			drawTrees: function(){
				for(let i = 0; i < this.arr.length; i++)
				{
					//Draw tree
					//Trunk
					noStroke();
					fill(107, 85, 66);
					rect(this.arr[i].x_pos, this.arr[i].y_pos, 50, 150);
					//Shadow
					fill(83, 71, 62);
					rect(this.arr[i].x_pos+37, this.arr[i].y_pos,13, 150);

					//Filled ellipses
					noStroke();
					fill(217, 186, 207);
					ellipse(this.arr[i].x_pos-50, this.arr[i].y_pos-70, 110, 90);
					ellipse(this.arr[i].x_pos+30, this.arr[i].y_pos-20, 150, 100);
					ellipse(this.arr[i].x_pos+10, this.arr[i].y_pos-80, 100, 100);
					ellipse(this.arr[i].x_pos+70, this.arr[i].y_pos-60, 90, 80);
					ellipse(this.arr[i].x_pos-80, this.arr[i].y_pos-30, 90, 90);
					ellipse(this.arr[i].x_pos-40, this.arr[i].y_pos, 70, 70);

					//Falling blossom
					for(let j = 0; j < 3; j++)
					{
						let blossomOpacity = 140
						// Each loop, draw the blossom
						fill(217, 186, 207, blossomOpacity);
						ellipse(this.arr[i].x_pos-50, this.arr[i].blossom_y1, 10, 15);
						fill(217, 186, 207, blossomOpacity);
						ellipse(this.arr[i].x_pos-90, this.arr[i].blossom_y2, 10, 15);
						fill(217, 186, 207, blossomOpacity);
						ellipse(this.arr[i].x_pos-110, this.arr[i].blossom_y3, 10, 15);
						// Increase each blossom y pos by an amount (they all fall at different speeds)
						this.arr[i].blossom_y1 += 0.01;
						this.arr[i].blossom_y2 += 0.03;
						this.arr[i].blossom_y3 += 0.02;
						// If a blossom hits the ground, reset the position
						if(this.arr[i].blossom_y1 >= scenery.floorPos_y+20)
						{	
							this.arr[i].blossom_y1 = (height/2)-7;
						}
						else if(this.arr[i].blossom_y2 >= scenery.floorPos_y+20)
						{
							this.arr[i].blossom_y2 = (height/2)-7;
						}
						else if(this.arr[i].blossom_y3 >= scenery.floorPos_y+20)
						{
							this.arr[i].blossom_y3 = (height/2)-7;
						};
					};
				};
			}
		},
		//CANYON Object
		canyon: {
			arr: [{x_pos:700, width:90}, {x_pos:1100, width:90}, {x_pos:1500, width:300}, {x_pos:2700, width:90}, {x_pos:3000, width:300}, {x_pos:3500, width:90}],
			canyonSoundPlayed: false,
			drawCanyons: function(){
				for(let i = 0; i < this.arr.length; i++)
				{
					//Draw canyon
					//Main shape
					noStroke();
					fill(21, 85, 138);
					rect(this.arr[i].x_pos, scenery.floorPos_y, this.arr[i].width, height);
					//Draws the blossom blocks that make the floor look like its overlapping
					fill(217, 186, 207);
					rect(this.arr[i].x_pos-10, scenery.floorPos_y, 20, 40, 20);
					rect(this.arr[i].x_pos+this.arr[i].width-10, scenery.floorPos_y, 20, 40, 20);
				};
			},
			//Iterates over each canyon and checks if player is above one or not
			checkCanyon: function(){
				//Only moves the character if the game state is not paused
				//If this isn't here, character will continue to fall after game over
				if(!gameStatePaused){
					for(let i = 0; i < this.arr.length; i++)
					{
						//Checks if character is above canyon
						if(character.gameChar_x > this.arr[i].x_pos+20 && character.gameChar_x < this.arr[i].x_pos+this.arr[i].width) {
							//Checks if character is on the floor
							if(character.gameChar_y >= scenery.floorPos_y){
								//Ensures canyon sound is only played once
								if(!this.canyonSoundPlayed){
									canyonSound.play();
									this.canyonSoundPlayed = true;
								}
								character.gameChar_x = this.arr[i].x_pos+(this.arr[i].width/2)+15;
								//Plummeting is true
								character.isPlummeting = true;
							};
						};
						//Controls speed of character when falling
						if(character.isPlummeting == true) {
						character.gameChar_y += 1;
						};
					};
				};
			}
		},
		//COLLECTABLE Object
		collectable: {
			arr: [{x_pos:50, y_pos:414, size:35, isFound:false},{x_pos:200, y_pos:414, size:35, isFound:false}, {x_pos:600, y_pos:414, size:35, isFound:false}, {x_pos:1220, y_pos:414, size:35, isFound:false}, {x_pos:1490, y_pos:414, size:35, isFound:false}, {x_pos:2000, y_pos:414, size:35, isFound:false}, {x_pos:2310, y_pos:414, size:35, isFound:false}, {x_pos:2700, y_pos:414, size:35, isFound:false}, {x_pos:2900, y_pos:414, size:35, isFound:false}, {x_pos:3400, y_pos:414, size:35, isFound:false}, {x_pos:3700, y_pos:414, size:35, isFound:false}],
			coinObjectiveComplete: false,
			//Iterates over each collectable and checks if character is above one or not
			checkCollectable: function(){
				for(let i = 0; i < this.arr.length; i++)
				{
					//If player is on collectable
					if(dist(!this.arr[i].isFound && character.gameChar_x, character.gameChar_y, this.arr[i].x_pos, this.arr[i].y_pos) < 35)
					{
						this.arr[i].isFound = true;
						this.arr[i].lastCollectionPoint = character.gameChar_x;
						coinSound.play();
						mechanics.game_score += 1;
					};
				};
			},
			//Draws the collectables that are held in the array 'arr'
			drawCollectable: function(){
				for(let i = 0; i < this.arr.length; i++)
				{
					//This runs if the collectible hasn't been collected
					if(this.arr[i].isFound == false) 
					{
						let fourFrames = floor(frameCount / 15) % 4;

						if(fourFrames === 0){
							image(coinAni[0], this.arr[i].x_pos-35, this.arr[i].y_pos-20, 44.8, 44.8);
						}
						else if(fourFrames === 1)
						{
							image(coinAni[1], this.arr[i].x_pos-35, this.arr[i].y_pos-20, 44.8, 44.8);
						}
						else if(fourFrames === 2){
							image(coinAni[2], this.arr[i].x_pos-35, this.arr[i].y_pos-20, 44.8, 44.8);
						}
						else{
							image(coinAni[3], this.arr[i].x_pos-35, this.arr[i].y_pos-20, 44.8, 44.8);
						}
						
						//Checks if player is above collectable ONLY when collectable is NOT found
						this.checkCollectable(this.arr[i]);
					};
				};
			},
			//Ensures all collectables are not found on game restart
			resetCollectables: function(){
				for(i = 0; i < this.arr.length; i++){
					this.arr[i].isFound = false;
				};
			},
			//Checks if all collectables have been collected
			checkCollectablesCollected: function(){
				if(mechanics.game_score === this.arr.length){
					mechanics.allCoinsCollected = 'COMPLETE!';
					//This ensures 1 is only added once to score
					if(!this.coinObjectiveComplete){
						this.coinObjectiveComplete = true;
						mechanics.objectivesCompleted += 1;
					};
				};
			}
		},
		//FLAGPOLE Object
		flagpole: {
			x_pos: 4100,
			isReached: false,
			winSoundPlayed: false,
			noDeathsObjectiveComplete: false,
			//Draws the flagpole
			drawFlagpole: function(){
				push();
				//Pole
				stroke(214, 184, 150);
				strokeWeight(5);
				line(this.x_pos, scenery.floorPos_y, this.x_pos, scenery.floorPos_y-250);
				fill(214, 184, 150);
				ellipse(this.x_pos, scenery.floorPos_y-250, 10, 10);
				pop();
			
				if(this.isReached)
				{
					//Ensures win sound is only played once
					bgMusic.stop();
					if(!this.winSoundPlayed){
						winSound.play();
						this.winSoundPlayed = true;
					};
					//Banner
					push();
					stroke(214, 184, 150);
					strokeWeight(5);
					line(this.x_pos, scenery.floorPos_y-230, this.x_pos-70, scenery.floorPos_y-230);
					fill(255,0,0);
					strokeWeight(0);
					rect(this.x_pos-70, scenery.floorPos_y-228, 68, 140);
					fill(255);
					ellipse(this.x_pos-35, scenery.floorPos_y-160, 30, 30)
					noFill();
					stroke(255);
					strokeWeight(1);
					rect(this.x_pos-66, scenery.floorPos_y-223, 60, 130);
					pop();
				};
			},
			//Checks player location in comparison to flagpole and marks as true when reached
			checkFlagpole: function(){
				if(!scenery.flagpole.isReached && (abs(character.gameChar_x - scenery.flagpole.x_pos) < 15))
				{
					scenery.flagpole.isReached = true;
				};
			},
			//Checks if flagpole has been reached and if yes displays complete screen
			isFlagpoleReached: function(){
				if(scenery.flagpole.isReached === true)
				{
					//Stops character moving
					character.isLeft = false;
					character.isRight = false;
					if(mechanics.lives.livesCount.length === 3 && !this.noDeathsObjectiveComplete){
						mechanics.objectivesCompleted += 1;
						this.noDeathsObjectiveComplete = true;
					};

					//Draws complete screen
					push();
					strokeWeight(4);
					stroke(0);
					fill(255);
					textFont(customFont);
					textSize(40);
					text("Level complete!", width/2-80, height/2);
					textSize(20);
					strokeWeight(3);
					text(`You completed ${mechanics.objectivesCompleted} objectives!`, width/2-72, height/2+50);
					text("Press SPACE to continue", width/2-60, height/2+80);
					pop();

					//Game is paused
					gameStatePaused = true;
					return;
				};
			}
		},
		//CHECKPOINT Object
		checkpoint: {
			//Holds checkpoints
			arr: [{x_pos: 1850, y_pos: 432-50, checkpointReached: false}, {x_pos: 2900, y_pos: 432-50, checkpointReached: false}],
			//Variable used to reset player position when new checkpoint is reached
			//Default is spawn point
			previousCheckpoint: 512,
			drawCheckpoints: function(){
				for(let i = 0; i < this.arr.length; i++){
					noStroke();
					fill(214, 184, 150);
					rect(this.arr[i].x_pos, this.arr[i].y_pos, 5, 50);
				};
			},
			checkCheckpoint: function(){
				for(let i = 0; i < this.arr.length; i++){
					let d = this.arr[i].x_pos - character.gameChar_x;
					if(d > -50 && d < 20 && character.gameChar_y > 382 && character.gameChar_y === 432){
						//This if statement ensures the checkpoint sound is only played once
						if (!this.arr[i].checkpointReached) {
							checkpointSound.play();
							this.arr[i].checkpointReached = true;
							this.previousCheckpoint = this.arr[i].x_pos;
						};
					};
					//When checkpoint is reached, flag moves up
					if(this.arr[i].checkpointReached){
						noStroke();
						fill(255,0,0);
						triangle(this.arr[i].x_pos+5, this.arr[i].y_pos, this.arr[i].x_pos+38, this.arr[i].y_pos+12.5, this.arr[i].x_pos+5, this.arr[i].y_pos+25);
						stroke(0);
						textFont(customFont);
						fill(255);
						text('C', this.arr[i].x_pos+13, this.arr[i].y_pos+15);
					}
					//Flag default position is down
					else{
						noStroke();
						fill(255,0,0);
						triangle(this.arr[i].x_pos+5, this.arr[i].y_pos+20, this.arr[i].x_pos+38, this.arr[i].y_pos+32.5, this.arr[i].x_pos+5, this.arr[i].y_pos+45);
						stroke(0);
						textFont(customFont);
						fill(255);
						text('C', this.arr[i].x_pos+13, this.arr[i].y_pos+35);
					};
				};
			},
			//Resets checkpoints so they aren't marked as obtained after new game
			resetCheckpoints: function(){
				for(let i = 0; i < scenery.checkpoint.arr.length; i++){
					scenery.checkpoint.arr[i].checkpointReached = false;
				};
			}
		},
		//PLATFORM Object
		platform: {
			//Empty array to hold platforms pushed
			arr: [],
			secretObjectiveComplete: false,
			//Factory pattern
			createPlatforms: function(x, y, length){
				var p = {
					x: x,
					y: y,
					length: length,
					//Platform draw code
					draw: function(){
						//Secret platform
						if(this.x === 2390){
							noStroke();
							fill(217, 186, 207, 100)
							stroke(245, 196, 240, 100);
							strokeWeight(1);
							rect(this.x, this.y, this.length, 15, 20);
						}
						//Every other platform
						else{
							noStroke();
							fill(74, 54, 42);
							rect(this.x+6, this.y+10, this.length-12, 15);
							fill(217, 186, 207);
							rect(this.x, this.y, this.length, 15, 20);
						};
					},
					//Checks if player is above platform
					checkContact: function(gc_x, gc_y){
						if(gc_x > this.x && gc_x < (this.x+this.length)+20) {
							//Checks distance between player y and platform y
							var d = this.y - gc_y;
							if(d >= 0 && d < 2){
								return true;
							};
							//Checks if secret platform is found
							if((gc_x > 2390) && (gc_x < 2390+this.length+20) && (gc_y <= 240)){
								mechanics.secretFound = 'COMPLETE!';
								//If this is true, the secret monster is drawn
								scenery.secret.onSecretPlatform = true;
								if(!scenery.platform.secretObjectiveComplete){
									//If this is true, 1 point is added to the objectives completed
									scenery.platform.secretObjectiveComplete = true;
									mechanics.objectivesCompleted += 1;
								};
							};
						};
						//If player is not on any platform, it returns false
						return false;
					}
				}
				return p;
			},
			//Calls draw
			drawPlatforms: function(){
				for(var i = 0; i < scenery.platform.arr.length; i++){
					scenery.platform.arr[i].draw();
				}
			}
		},
		//ENEMIES Object
		enemies: {
			arr: [],
			//Tracks when player is out of lives and dies to enemy
			dead: false,
			noDeathObjectiveFailed: false,
			//Constructor
			Enemy: function(x, y, range){
				this.x = x-47;
				this.y = y-37;
				this.range = range;
				this.currentX = x;
				this.inc = 1;

				//Updates position of enemy
				//Changes direction once end of range is met
				this.update = function(){
					this.currentX += this.inc;
					//Walk right
					if(this.currentX >= this.x+this.range) {
						this.inc = -1;
					}
					//Walk left
					else if(this.currentX < this.x){
						this.inc = 1;
					};
				};

				//Enemy draw code
				this.draw = function() {
					//Cycles through 0-4 every 30 seconds at 60fps
					let fourFrames = floor(frameCount / 7.5) % 4;
					//Updates enemy position
					this.update();
					//Enemy walking right sprites
					if(this.inc === 1){
						if(fourFrames === 0){
							image(enemyAni[4], this.currentX, this.y, 77, 51);
						}
						else if(fourFrames === 1)
						{
							image(enemyAni[5], this.currentX, this.y, 77, 51);
						}
						else if(fourFrames === 2){
							image(enemyAni[6], this.currentX, this.y, 77, 51);
						}
						else{
							image(enemyAni[7], this.currentX, this.y, 77, 51);
						};
					}
					//Enemy walking left sprites
					else{
						if(fourFrames === 0){
							image(enemyAni[0], this.currentX, this.y, 77, 51);
						}
						else if(fourFrames === 1)
						{
							image(enemyAni[1], this.currentX, this.y, 77, 51);
						}
						else if(fourFrames === 2){
							image(enemyAni[2], this.currentX, this.y, 77, 51);
						}
						else{
							image(enemyAni[3], this.currentX, this.y, 77, 51);
						};
					};
				};

				//Checks if distance from player to enemy is less than 20 pixels
				this.checkContact = function(gc_x, gc_y){
					var d = dist(gc_x, gc_y, this.currentX+47, this.y+37);
					if(d < 30){
						return true;
					};
					return false;
				};
			},
			//Calls draw and checks if contact has been made with player
			drawEnemies: function(){
				for(let i = 0; i < this.arr.length; i++){
					this.arr[i].draw();
					var isContact = this.arr[i].checkContact(character.gameChar_x, character.gameChar_y);

					//Player always loses a life if they come in contact with enemy
					if(isContact){
						//If player has lives remaining, character is just reset
						if(mechanics.lives.livesCount.length >= 2)
						{
							hurtSound.play();
							mechanics.lives.livesCount.pop();
							mechanics.noDeaths = 'FAILED';
							//This ensures only 1 point is taken away from objectives count
							/*The player automatically starts with 1 point from this objective 
							as no enemies have been hit yet*/
							if(!scenery.enemies.noDeathObjectiveFailed){
								scenery.enemies.noDeathObjectiveFailed = true;
								mechanics.objectivesCompleted -= 1;
							}
							mechanics.resetCharacter();
						}
						//If out of lives, dead is true
						//checkPlayerBounds function then ends the game
						/*If this logic wasn't here, game over screen would 
						only show when enemy is in contact with character*/
						else
						{
							mechanics.lives.livesCount.pop();
							this.dead = true;
						};
					};
				};
			}
		},
		//PARTICLES Object
		particles: {
			//HOW TO USE//
			//Create new emitter in restartGame() (new Emitter pushed to emitter)
			//Using for loop:
			//Add particles to emitter (using scenery.particles.emitters[i].addParticlesToEmitter())
			//Draw particles to screen (using scenery.particles.emitters[i].drawParticlesToScreen())
			canyonEmitters: [],
			//Particles for the enemies
			enemyEmitters: [],
			//Particle constructor function
			Particle: function(x, y, xSpeed, ySpeed, size, colour, colour2, colourChanging){
				this.x = x;
				this.y = y;
				this.xSpeed = xSpeed;
				this.ySpeed = ySpeed;
				this.size = size;
				this.colour = colour;
				this.age = 0;
				this.colour2 = colour2;
				this.colourChanging = colourChanging;

				this.drawParticle = function(){
					noStroke();
					fill(this.colour);
					square(this.x, this.y, this.size);
				};

				this.updateParticle = function(){
					this.x += this.xSpeed;
					this.y += this.ySpeed
					this.age++;
				};

				//Allows particles to contain two colours if colourChanging = true
				if(colourChanging){
					this.colour = random([this.colour, this.colour2]);
				};
			},
			//Emitter constructor function
			Emitter: function(x, y, xSpeed, ySpeed, size, colour, colour2, colourChanging){
				this.x = x;
				this.y = y;
				this.xSpeed = xSpeed;
				this.ySpeed = ySpeed;
				this.size = size;
				this.colour = colour;
				this.colour2 = colour2;
				this.colourChanging = colourChanging;
				this.startParticles = 0;
				this.lifetime = 0;
				this.particles = [];

				//Particle constructor used here to create a new particle
				this.newParticle = function(){
					let p = new scenery.particles.Particle(
						random(this.x-10, this.x+10), 
						random(this.y-10, this.y+10), 
						random(this.xSpeed-1, this.xSpeed+1), 
						random(this.ySpeed-1, this.ySpeed+1), 
						random(this.size-4, this.size+4), 
						this.colour,
						this.colour2,
						this.colourChanging);

					return p;
				};

				//Decides number of particles to use and how long they last
				this.addParticlesToEmitter = function(startParticles, lifetime){
					this.startParticles = startParticles;
					this.lifetime = lifetime;

					//Pushes these particles to the particle array which is then used by drawParticlesToScreen()
					for(let i = 0; i < startParticles; i++){
						this.particles.push(this.newParticle());
					};
				};

				this.drawParticlesToScreen = function(){
					//iterate through particles array and draw to the screen
					//Iterate through list backwards so splice doesn't skip over elements
					let deadParticles = 0;
					for(i = this.particles.length-1; i >= 0; i--){
						//Each particle has drawParticle() and updateParticle() built in
						this.particles[i].drawParticle();
						this.particles[i].updateParticle();

						//When particle age gets larger than lifetime, remove particle
						if(this.particles[i].age > random(0,this.lifetime)){
							this.particles.splice(i, 1);
							deadParticles++;
						};
					};

					//If there are any dead particles, replace them with another particle
					if(deadParticles > 0){
						for(let i = 0; i < deadParticles; i++){
							this.particles.push(this.newParticle());
						};
					};
				};
			}
		},
		//SECRET Object
		secret: {
			onSecretPlatform: false,
			//Draws secret monster
			drawSecret: function(){
				let fourFrames = floor(frameCount / 15) % 4;
				if(fourFrames === 0){
					image(secretAni[0], 2465, 205, 32, 32);
				}
				else if(fourFrames === 1)
				{
					image(secretAni[1], 2465, 205, 32, 32);
				}
				else if(fourFrames === 2){
					image(secretAni[2], 2465, 205, 32, 32);
				}
				else{
					image(secretAni[3], 2465, 205, 32, 32);
				};
				//Secret monster speech
				strokeWeight(2);
				stroke(0);
				fill(255);
				textFont(customFont);
				textSize(17)
				text('How did you find me? :|', 2490, 195);
			}
		}
	};

	// Character Object Initialisation
	character = {
		//Game Character Positions
		gameChar_x: width/2,
		gameChar_y: scenery.floorPos_y,

		// Game character states
		isLeft: false,
		isRight: false,
		isFalling: false,
		isPlummeting: false,

		// Draw character
		drawCharacter: function(){
			//Rounds down the frame count divided by 7.5 (cycles through 0-4 every 30 seconds at 60fps)
			//Modulo [number] will account for how many sprites to use
			//4 sprites for walking animations
			let fourFrames = floor(frameCount / 7.5) % 4;

			/////// Jumping Left
			if(this.isLeft && this.isFalling)
			{
				if(fourFrames === 0){
					image(samuraiAni[16], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 1)
				{
					image(samuraiAni[17], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 2){
					image(samuraiAni[18], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else{
					image(samuraiAni[19], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				};
		
			}
			/////// Jumping Right
			else if(this.isRight && this.isFalling)
			{
				if(fourFrames === 0){
					image(samuraiAni[12], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 1)
				{
					image(samuraiAni[13], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 2){
					image(samuraiAni[14], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else{
					image(samuraiAni[15], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				};
		
			}
			/////// Walking Left
			else if(this.isLeft)
			{
				if(fourFrames === 0){
					image(samuraiAni[0], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 1)
				{
					image(samuraiAni[1], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 2){
					image(samuraiAni[2], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else{
					image(samuraiAni[3], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				};
		
			}
			/////// Walking Right
			else if(this.isRight)
			{
				if(fourFrames === 0){
					image(samuraiAni[4], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 1)
				{
					image(samuraiAni[5], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 2){
					image(samuraiAni[6], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else{
					image(samuraiAni[7], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				};
		
			}
			/////// Jumping Forward
			else if(this.isFalling || this.isPlummeting)
			{
				if(fourFrames === 0){
					image(samuraiAni[12], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 1)
				{
					image(samuraiAni[13], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 2){
					image(samuraiAni[14], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else{
					image(samuraiAni[15], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				};
		
			}
			/////// Standing forward
			else
			{
				if(fourFrames === 0){
					image(samuraiAni[8], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 1)
				{
					image(samuraiAni[9], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else if(fourFrames === 2){
					image(samuraiAni[10], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				}
				else{
					image(samuraiAni[11], this.gameChar_x-64, this.gameChar_y-56, 96, 64);
				};
		
			};
	
		},
		//Moves character
		movement: function(){
			//If left/A is pushed, character will move left
			if(character.isLeft == true) {
				if(character.isPlummeting != true) {
					character.gameChar_x -= 5;
				};
			};

			//If right/D is pushed, character will move right
			if(character.isRight == true) {
				if(character.isPlummeting != true) {
					character.gameChar_x += 5;
				};
			};

			//If up/W is pushed, character will start to fall to the ground
			if(character.gameChar_y < scenery.floorPos_y) {
				var isContact = false;
				//Iterate over the platform array
				for(let i = 0; i < scenery.platform.arr.length; i++){
					//If checkContact returns true, change isContact to true (therefore no longer falling)
					if(scenery.platform.arr[i].checkContact(character.gameChar_x, character.gameChar_y)){
						isContact = true;
						break;
					};
				};
				//If there is no platform, fall as normal
				if(isContact === false){
					character.isFalling = true;
					character.gameChar_y +=4;
				}
				//Stop falling if on a platform
				else{
					character.isFalling = false;
				};
			}
			//When it hits the ground the sprite changes back to standing
			else {
				character.isFalling = false;
			};
		}
	};

	//Game Mechanic Initialisation
	mechanics = {
		//For side scrolling
		cameraPosX: 0,
		newBegin: character.gameChar_x - 512,
		newEnd: character.gameChar_x + 512,
		previousGameChar_x: 0,
		allCoinsCollected: 'INCOMPLETE',
		noDeaths: 'COMPLETE!',
		secretFound: 'INCOMPLETE',
		game_score: 0,
		objectivesCompleted: 1,
		//Browsers can stop autoplay of music
		//This will change to true on key press and start playing music
		bgMusicStarted: false,
		startScreen: function(){
			if(this.bgMusicStarted === false){
				strokeWeight(3);
				stroke(0);
				fill(255);
				textFont(customFont);
				textSize(30);
				text("Press any KEY to start", width/2-80, height/2);
			};
		},
		updatePositions: function(){
			this.newBegin = character.gameChar_x - 512;
			this.newEnd = character.gameChar_x + 512;
			this.previousGameChar_x = character.gameChar_x-70;
		},
		//LIVES Object
		lives: {
			livesCount: ['❤️','❤️','❤️'],
			gameOverSoundPlayed: false,
			//Checks if player is out of lives
			outOfLives: function(){
				//Stops background music
				bgMusic.stop();

				//Plays game over sound only once
				if(!this.gameOverSoundPlayed){
					gameoverSound.play();
					this.gameOverSoundPlayed = true;
				};

				//Game Over screen if player dies on ground (to enemy)
				if(character.gameChar_y === scenery.floorPos_y){
					push();
					noStroke();
					fill(0);
					textFont(customFont);
					rect(character.gameChar_x-512,0,width,height+20);
					fill(255);
					textSize(40);
					text("GAME OVER", character.gameChar_x-70,260);
					textSize(20);
					text("Press SPACE to continue", character.gameChar_x-82,310);
					pop();
					gameStatePaused = true;
					return;
				}
				//Game Over screen if player dies to canyon
				else{
					push();
					noStroke();
					fill(0);
					textFont(customFont);
					rect(character.gameChar_x-512,0,width,height+20);
					fill(255);
					textSize(40);
					text("GAME OVER", character.gameChar_x-70,260);
					textSize(20);
					text("Press SPACE to continue", character.gameChar_x-82,310);
					pop();
					gameStatePaused = true;
					return;
				};
			}
		},
		//Checks if player is out of bounds
		checkPlayerBounds: function(){
			if(character.gameChar_y >= 700 || scenery.enemies.dead)
			{	
				//If player still has lives, remove a life and reset character
				if(this.lives.livesCount.length > 1)
				{
					this.lives.livesCount.pop();
					this.resetCharacter();
				}
				//If they're out of lives, end the game
				else
				{
					this.lives.livesCount.pop();
					this.lives.outOfLives();
				};
			};
			//Stops character walking backwards off screen
			if(character.gameChar_x <= 0){
				translate(-mechanics.cameraPosX, 0);
				character.isLeft = false;
				fill(242, 242, 242)
				textSize(30);
				noStroke();
				textFont(customFont);
				text("No secrets back here...", -800, 100);
			};
		},
		//Draws game information at top left
		gameInfo: function(){
			push();
			strokeWeight(2);
			stroke(0);
			fill(255);
			textFont(customFont);
			textSize(15);
			textFont("Arial");
			text(`${this.lives.livesCount.join('')}`, 10, 20);
			textFont(customFont);
			textSize(20);
			text(`Coins: ${this.game_score}`, 13, 45);
			text('Objectives:' , 13, 68);
			text(`- Collect all coins: ${this.allCoinsCollected}`, 20, 88);
			text(`- Hit no enemies:   ${this.noDeaths}`, 20, 108);
			text(`- Find the secret: ${this.secretFound}`, 20, 128);
			pop();
		},
		//Resets character if they fall down a canyon without resetting scenery
		resetCharacter: function(){
			//Reset Game character states
			character.isLeft = false;
			character.isRight = false;
			character.isFalling = false;
			character.isPlummeting = false;

			//Reset player position
			character.gameChar_x = scenery.checkpoint.previousCheckpoint;
			character.gameChar_y = scenery.floorPos_y;

			scenery.cloud.arr = [];
			scenery.cloud.numberOfClouds(5);
			scenery.canyon.canyonSoundPlayed = false;
		},
		//Starts the game
		restartGame: function(){

			clear();
			//Resets music variable so music will play again on death
			mechanics.bgMusicStarted = false;
			mechanics.lives.gameOverSoundPlayed = false;
			scenery.canyon.canyonSoundPlayed = false;
			scenery.flagpole.winSoundPlayed = false;

			//Resets objectives to not completed
			scenery.flagpole.noDeathsObjectiveComplete = false;
			scenery.enemies.noDeathObjectiveFailed = false;
			scenery.platform.secretObjectiveComplete = false;
			scenery.collectable.coinObjectiveComplete = false;
			mechanics.objectivesCompleted = 1;
			scenery.secret.onSecretPlatform = false;

			//Reset Objectives
			mechanics.allCoinsCollected = 'INCOMPLETE';
			mechanics.noDeaths = 'COMPLETE!';
			mechanics.secretFound = 'INCOMPLETE';

			//Reset character positions
			character.gameChar_x = width/2;
			character.gameChar_y = scenery.floorPos_y;

			//Resets variables that track player movement for scenery respawn
			/*If this isn't here, on restart scenery will be spawned based off of
			players previous location*/
			mechanics.newBegin = character.gameChar_x - 512;
			mechanics.newEnd = character.gameChar_x + 512;
			mechanics.previousGameChar_x = 0;

			//Reset Game character states
			character.isLeft = false;
			character.isRight = false;
			character.isFalling = false;
			character.isPlummeting = false;

			// Side scrolling
			this.cameraPosX = character.gameChar_x - (width / 2);

			//Resets scenery arrays
			scenery.cloud.arr = [];
			scenery.enemies.arr = [];

			//Determines number of scenery items drawn
			scenery.stars.numberOfStars(20);
			scenery.cloud.numberOfClouds(5);

			//Re-draws scenery
			scenery.tree.drawTrees();
			scenery.mountain.drawMountains();
			scenery.canyon.drawCanyons();
			scenery.collectable.drawCollectable();
			scenery.collectable.resetCollectables();
			scenery.checkpoint.previousCheckpoint = 512;
			scenery.checkpoint.resetCheckpoints();
			scenery.checkpoint.drawCheckpoints();

			//Platforms
			scenery.platform.arr.push(scenery.platform.createPlatforms(1100, 360, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(1500, 360, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(1600, 300, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(2100, 360, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(2250, 300, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(2400, 360, 100));
			//This is the secret platform, cheater!
			scenery.platform.arr.push(scenery.platform.createPlatforms(2390, 240, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(3000, 360, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(3150, 300, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(3700, 360, 100));
			scenery.platform.arr.push(scenery.platform.createPlatforms(3850, 300, 100));

			//Enemies
			scenery.enemies.arr.push(new scenery.enemies.Enemy(60, scenery.floorPos_y-10, 140));
			scenery.enemies.arr.push(new scenery.enemies.Enemy(1220, scenery.floorPos_y-10, 250));
			scenery.enemies.arr.push(new scenery.enemies.Enemy(1860, scenery.floorPos_y-10, 800));
			scenery.enemies.arr.push(new scenery.enemies.Enemy(2150, scenery.floorPos_y-10, 350));
			scenery.enemies.arr.push(new scenery.enemies.Enemy(3170, scenery.floorPos_y-140, 80));
			scenery.enemies.arr.push(new scenery.enemies.Enemy(3330, scenery.floorPos_y-10, 170));
			scenery.enemies.dead = false;

			//Particles//
			//Canyon Emitters
			for(let i = 0; i < scenery.canyon.arr.length; i++){
				let emitter = new scenery.particles.Emitter(scenery.canyon.arr[i].x_pos+scenery.canyon.arr[i].width/2, height, 0, -2, 2, color(255, 241, 112, 100));
				emitter.addParticlesToEmitter(5, 100);
				scenery.particles.canyonEmitters.push(emitter);
			};

			//Enemy Emitters
			for(let i = 0; i < scenery.enemies.arr.length; i++){
				let emitter = new scenery.particles.Emitter(scenery.enemies.arr[i].currentX, scenery.enemies.arr[i].y+30, 0, 0, 5, color(201, 118, 222,20), color(26, 26, 26,20), true);
				emitter.addParticlesToEmitter(200, 100);
				scenery.particles.enemyEmitters.push(emitter);
			};

			//Reset Flagpole
			scenery.flagpole.isReached = false;

			//Score reset only on Game Over
			this.game_score = 0;

			//Reset lives
			this.lives.livesCount = ['❤️','❤️','❤️'];

			//Unpauses game when game is started
			gameStatePaused = false;
		}
	};

	mechanics.restartGame();
};

function draw()
{
	//Camera Position
	mechanics.cameraPosX = character.gameChar_x-(width/2);

	//Sky
	scenery.drawSky();
	//Ground
	scenery.drawGround();

	///////Scroll Screen Start///////
	push();
	translate(-mechanics.cameraPosX, 0);

	//Clouds
	scenery.cloud.drawClouds();

	//Mountains
	scenery.mountain.drawMountains();

	//Trees
	scenery.tree.drawTrees();

	//Canyons
	scenery.canyon.drawCanyons();

	//Collectables
	scenery.collectable.drawCollectable();

	//Flagpole
	scenery.flagpole.drawFlagpole();

	//Platforms
	scenery.platform.drawPlatforms();

	//Enemies
	scenery.enemies.drawEnemies();

	//Checkpoints
	scenery.checkpoint.drawCheckpoints();
	scenery.checkpoint.checkCheckpoint();

	//Particles//
	//Enemy particles
    for(let i = 0; i < scenery.enemies.arr.length; i++){
		// Update each enemy's emitter position to follow the enemy
        scenery.particles.enemyEmitters[i].x = scenery.enemies.arr[i].currentX + 40;
        scenery.particles.enemyEmitters[i].y = scenery.enemies.arr[i].y + 20;
		//Draw particles
		scenery.particles.enemyEmitters[i].drawParticlesToScreen();
    };

    //Canyon particles
    for(let i = 0; i < scenery.particles.canyonEmitters.length; i++){
        scenery.particles.canyonEmitters[i].drawParticlesToScreen();
    };

	//Draw secret if player has been on secret platform
	if(scenery.secret.onSecretPlatform){
		scenery.secret.drawSecret();
	};

	// Draw Character
	character.drawCharacter();
	mechanics.startScreen();

	//Updates position of character to newBegin and newEnd for reappearing scenery
	mechanics.updatePositions();

	//Checks characters location in comparison to canyon
	scenery.canyon.checkCanyon();

	//Checks characters location in comparison to flagpole
	scenery.flagpole.checkFlagpole();

	//Checks how many collectables have been collected
	scenery.collectable.checkCollectablesCollected();

	//Checks if player has died
	mechanics.checkPlayerBounds();

	pop();
	///////Scroll Screen End/////////

	//Checks if flagpole has been reached
	scenery.flagpole.isFlagpoleReached();

	//Draws lives and coins to top left of screen
	mechanics.gameInfo();

	//Moves character depending on button pressed
	character.movement();
};

function keyPressed()
// Controls what key triggers which movements
{
	//When the game is paused the player cannot be moved
    if (gameStatePaused === true) {
        // Check if the space bar is pressed
        if (keyCode === 32) {
            // Restart the game
            mechanics.restartGame();
        };
        return; // Prevent any other actions when the game is paused
    };
	/* If statements to control the animation of the character when
	keys are pressed. */
	//Use left arrow or A to move left
	if(keyCode == 65 || keyCode == 37) {
		character.isLeft = true;
	}
	//Use right arrow or D to move right
	else if(keyCode == 68 || keyCode == 39) {
		character.isRight = true;
	}
	//Use up arrow, W or space bar to jump
	else if(keyCode == 87 || keyCode == 38 || keyCode == 32) {
		if(character.isPlummeting != true)
		{
			if(character.isFalling == false)
			{
				if(gameStatePaused !== true)
				{
					jumpSound.play();
					character.gameChar_y -= 100;
				};
			};
		};
	};
	
	//Plays the background music when a player presses any key
	if (!mechanics.bgMusicStarted) {
        bgMusic.loop();
        mechanics.bgMusicStarted = true;
    };
};

function keyReleased()
//Stops character moving when key is released
{
	/* If statements to control the animation of the character when
	keys are released. */
	if(keyCode == 65 || keyCode == 37) {
		character.isLeft = false;
	}
	else if(keyCode == 68 || keyCode == 39) {
		character.isRight = false;
	};
};