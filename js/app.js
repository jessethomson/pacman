var app = angular.module('myApp', []);

app.controller('gameCtrl', function($scope, $document) {

	// 0 = empty
	// 1 = small dot
	// 2 = large dot
	// 3 = wall
	// 4 = nodown gate
	$scope.level = [
		[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
		[3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3],
		[3, 2, 3, 3, 1, 3, 3, 3, 1, 3, 1, 3, 3, 3, 1, 3, 3, 2, 3],
		[3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
		[3, 1, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 1, 3],
		[3, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 3],
		[3, 3, 3, 3, 1, 3, 3, 3, 1, 3, 1, 3, 3, 3, 1, 3, 3, 3, 3],
		[0, 0, 0, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 0, 0, 0],
		[3, 3, 3, 3, 1, 3, 1, 3, 3, 4, 3, 3, 1, 3, 1, 3, 3, 3, 3],
		[1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1], // temporarily blocked
		[3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3],
		[0, 0, 0, 3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 3, 1, 3, 0, 0, 0],
		[3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3],
		[3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3],
		[3, 2, 3, 3, 1, 3, 3, 3, 1, 3, 1, 3, 3, 3, 1, 3, 3, 2, 3],
		[3, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 3],
		[3, 3, 1, 3, 1, 3, 1, 3, 3, 3, 3, 3, 1, 3, 1, 3, 1, 1, 3],
		[3, 1, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 3, 1, 1, 1, 1, 3],
		[3, 1, 3, 3, 3, 3, 3, 3, 1, 3, 1, 3, 3, 3, 3, 3, 3, 1, 3],
		[3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3],
		[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3]
	];

	function countLevelElements(type) {
		var total = 0;
		for(var i=0; i<$scope.level.length; i++) {
			for(var j=0; j<$scope.level[i].length; j++) {
				if($scope.level[i][j] === type) {
					total++
				}
			}
		}
		return total;
	}

	console.log("total small dots: " + countLevelElements(1));

	$scope.pacman = {};
	$scope.ghosts = [];
	var grid = 25;
	var numGhosts = 4;
	$scope.playing = false;

	$document[0].onkeyup = function(event) {
			switch (event.key) {
				case "ArrowLeft":
					$scope.pacman.moveState = "left";
					$("#pacman").attr("src", "./img/pacman-left.gif");
					break;
				case "ArrowRight":
					$scope.pacman.moveState = "right";
					$("#pacman").attr("src", "./img/pacman-right.gif");
					break;
				case "ArrowUp":
					$scope.pacman.moveState = "up";
					$("#pacman").attr("src", "./img/pacman-up.gif");
					break;
				case "ArrowDown":
					$scope.pacman.moveState = "down";
					$("#pacman").attr("src", "./img/pacman-down.gif");
					break;
				case " ":
					if(!$scope.playing) {
						$scope.startGame();
					}
					else {
						$scope.playing = false;
					}
					break;
				default:
					break;
			}
	}

	function generatePacman() {

		$scope.pacman = {
			id: "pacman",
			img: "pacman-right.png",
			x: 9,
			y: 15
		}

		loadCharacter($scope.pacman);

		// initialize pacman position
		var pacman = $("#pacman")
		pacman.css("left", $scope.pacman.x * 25 + "px");
		pacman.css("top", $scope.pacman.y * 25 + "px");
	}

	$scope.startGame = function() {

		$scope.playing = true; 

		generatePacman();
		for(var j=0; j<numGhosts; j++) {
			generateGhost(j + 1);
		}

		var gameInterval = setInterval(function() {
			if($scope.playing) {
				
				updateCharacter($scope.pacman);

				for(var i=0; i<$scope.ghosts.length; i++) {
					// update ghost position
					if(!updateCharacter($scope.ghosts[i])) {
						$scope.ghosts[i].moveState = getRandomMoveState($scope.ghosts[i]);
					}
					else { // 50/50 chance that he randomly switches directions
						var coinFlip = Math.floor((Math.random() * 4));
						if(coinFlip === 0) {
							$scope.ghosts[i].moveState = getRandomMoveState($scope.ghosts[i]);
						}
					}

					// check for collision
					if(collision($scope.ghosts[i].id, $scope.pacman.id)) {
						console.log("hit!!");
                        clearInterval(gameInterval);
						playerDeath()
						// gameOver
					}
				}

			}
		}, 250);
	}

	function loadCharacter(character) {
		var characterDiv = $("<img class='character' id='" + character.id + "' src='./img/" + character.img + "'>");
		$(".game-container").append(characterDiv);
	}

	function generateGhost(ghostNumber) {

		var numSeconds = Math.floor((Math.random() * 4) + 2);

		setTimeout(function() {
			var id = "ghost" + $scope.ghosts.length;
			var ghost = {
				id: id,
				img: "ghost" + ghostNumber + ".gif",
				x: 9,
				y: 9,
				moveState: "up"
			}

			loadCharacter(ghost);

			// initialize ghost position
			var pacman = $("#" + id)
			pacman.css("left", ghost.x * 25 + "px");
			pacman.css("top", ghost.y * 25 + "px");

			$scope.ghosts.push(ghost);
		}, 1000 * numSeconds);

	}

	function getRandomMoveState(character) {
		var level = $scope.level;
		possibleMoveStates = [];
		if(level[character.y - 1][character.x] !== 3) {
			possibleMoveStates.push("up");
		}
		if(level[character.y + 1][character.x] !== 3 && level[character.y + 1][character.x] !== 4) {
			possibleMoveStates.push("down");
		}
		if(level[character.y][character.x - 1] !== 3) {
			possibleMoveStates.push("left");
		}
		if(level[character.y][character.x + 1] !== 3) {
			possibleMoveStates.push("right");
		}
		var index = Math.floor((Math.random() * possibleMoveStates.length));
		
		return possibleMoveStates[index];
	}

	$scope.startGame();

	function updateCharacter(character) {
		var level = $scope.level;
		var moved = false;
		var element = $("#" + character.id);
		switch(character.moveState) {
			case "up":
				if(level[character.y - 1][character.x] !== 3) {
					character.y -= 1;
					var top = parseInt(element.css("top"));
					element.css("top", top - grid + "px");
					if(character.id === "pacman") {
						$scope.level[character.y][character.x] = 0; //scope not updating
						$("#" + character.y + "-" + character.x).remove();
					}
					moved = true;					
				}
				break;
			case "down":
				if(level[character.y + 1][character.x] !== 3 && level[character.y + 1][character.x] !== 4) {
					character.y += 1;
					var top = parseInt(element.css("top"));
					element.css("top", top + grid + "px");
					if(character.id === "pacman") {
						$scope.level[character.y][character.x] = 0;
						$("#" + character.y + "-" + character.x).remove();
					}
					moved = true;
				}
				break;
			case "left":
				if(level[character.y][character.x - 1] !== 3) {
					var left = parseInt(element.css("left"));
					if(character.y === 9 && character.x === 0) {
						console.log("magic!!!");
						character.x = 18;
						element.css("left", left + grid*18 + "px");
					}
					else {
						character.x -= 1;
						element.css("left", left - grid + "px");
						
					}
					if(character.id === "pacman") {
						$scope.level[character.y][character.x] = 0;
						$("#" + character.y + "-" + character.x).remove();
					}
					moved = true;
				}
				break;
			case "right":
				if(level[character.y][character.x + 1] !== 3) {
					var left = parseInt(element.css("left"));
					if(character.y === 9 && character.x === 18) {
						character.x = 0;
						element.css("left", left - grid*18 + "px");
					}
					else {
						character.x += 1;
						element.css("left", left + grid + "px");
					}
					if(character.id === "pacman") {
						$scope.level[character.y][character.x] = 0;
						$("#" + character.y + "-" + character.x).remove();
					}
					moved = true;
				}
				break;
			default:
				break;
		}
		return moved;
	}

    function playerDeath() {
        setTimeout(function() {
            //$("#pacman").attr("src", "");
            $document[0].onkeyup = null;
        }, 1000);
        $("#pacman").attr("src", "./img/pacmandie.gif");
    }
    
	function collision(name1, name2) {

		var thing1 = $("#" + name1);
		var thing2 = $("#" + name2);
		if(!thing1.length || !thing2.length) {
			return false;
		}

		var r1 = {
			top: parseInt(thing1.css("top")),
			bottom: parseInt(thing1.css("top")) + grid,
			left: parseInt(thing1.css("left")),
			right: parseInt(thing1.css("left")) + grid
		};

		var r2 = {
			top: parseInt(thing2.css("top")),
			bottom: parseInt(thing2.css("top")) + grid,
			left: parseInt(thing2.css("left")),
			right: parseInt(thing2.css("left")) + grid
		};


		var result = !(r2.left > r1.right ||
			r1.left > r2.right ||
			r2.top > r1.bottom ||
			r1.top > r2.bottom);

		return result;
	}



});