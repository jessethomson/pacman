var app = angular.module('myApp', []);

app.controller('gameCtrl', function($scope, $document) {

	$scope.pacman = {};
	$scope.ghosts = [];
	var grid = 25;
	var numGhosts = 4;
	$scope.playing = false;

	function resetGame() {

		// remove old characters
		removeGhosts();
		$("#pacman").remove();

		// show all dots
		$(".dot").show();

		// reset level //
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
			[1, 1, 1, 1, 1, 1, 1, 3, 0, 0, 0, 3, 1, 1, 1, 1, 1, 1, 1],
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

		$scope.totalSmallDots = countLevelElements(1);
	}

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


	$document[0].onkeyup = function(event) {
			switch (event.key) {
				case "ArrowLeft":
					if($scope.playing) {
						$scope.pacman.moveState = "left";
						$("#pacman").attr("src", "./img/pacman-left.gif");
					}
					break;
				case "ArrowRight":
					if($scope.playing) {
						$scope.pacman.moveState = "right";
						$("#pacman").attr("src", "./img/pacman-right.gif");
					}
					break;
				case "ArrowUp":
					if($scope.playing) {
						$scope.pacman.moveState = "up";
						$("#pacman").attr("src", "./img/pacman-up.gif");
					}
					break;
				case "ArrowDown":
					if($scope.playing) {
						$scope.pacman.moveState = "down";
						$("#pacman").attr("src", "./img/pacman-down.gif");
					}
					break;
				case " ":
					if(!$scope.playing) {
						$scope.startGame();
					}
					break;
				default:
					break;
			}
	}

	function generatePacman() {

		$scope.pacman = {
			id: "pacman",
			img: "pacman-right.gif",
			x: 9,
			y: 15
		}

		loadCharacter($scope.pacman);

		// initialize pacman position
		var pacman = $("#pacman")
		pacman.css("left", $scope.pacman.x * 25 + "px");
		pacman.css("top", $scope.pacman.y * 25 + "px");
	}

	function checkForWinner(callback) {
		if(!$scope.totalSmallDots) {
			callback();
		}
	}

	$scope.startGame = function() {

		$(".game-over").hide();
		$(".winner").hide();
		resetGame();

		playAudio("pacman-beginning");
		$("#pacman-beginning").bind("ended", function() {
			playAudio("pacman-chomp");
		});
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
					else { // 25/75 chance that he randomly switches directions
						var coinFlip = Math.floor((Math.random() * 4));
						if(coinFlip === 0) {
							$scope.ghosts[i].moveState = getRandomMoveState($scope.ghosts[i]);
						}
					}

					// check for collision
					if(collision($scope.ghosts[i].id, $scope.pacman.id)) {
						if(!$scope.superpower) {
							$scope.playing = false;
							stopAudio("pacman-chomp");
							playAudio("pacman-death");
							clearInterval(gameInterval);
							$("#pacman").attr("src", "./img/pacmandie.gif");
							$(".game-over").show();
						}
						else {
							$("#" + $scope.ghosts[i].id).remove();
							//generateGhost()
						}
					}
				}
				checkForWinner(function() {
					$scope.playing = false;
					stopAudio("pacman-chomp");
					clearInterval(gameInterval);
					$(".winner").show();
				});
			}
		}, 250);
	}

	function loadCharacter(character) {
		var characterDiv = $("<img class='character' id='" + character.id + "' src='./img/" + character.img + "'>");
		$(".game-container").append(characterDiv);
	}

	function removeGhosts() {
		for(var i=0; i<$scope.ghosts.length; i++) {
			$("#" + $scope.ghosts[i].id).remove();
		}
		$scope.ghosts = [];
	}

	function generateGhost(ghostNumber, ghost) {

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

		// if eating small dot
		if(character.id === "pacman" && $scope.level[character.y][character.x] === 1) {
			$scope.level[character.y][character.x] = 0;
			$("." + character.y + "-" + character.x).hide();
			$scope.totalSmallDots--;
		}
		// if eating large dot
		if(character.id === "pacman" && $scope.level[character.y][character.x] === 2) {
			$scope.level[character.y][character.x] = 0;
			$("." + character.y + "-" + character.x).hide();
			$scope.superpower = true;
			setTimeout(function() {
				$scope.superpower = false;
			}, 8000);
		}

		switch(character.moveState) {
			case "up":
				if(level[character.y - 1][character.x] !== 3) {
					character.y -= 1;
					var top = parseInt(element.css("top"));
					element.css("top", top - grid + "px");
					moved = true;					
				}
				break;
			case "down":
				if(level[character.y + 1][character.x] !== 3 && level[character.y + 1][character.x] !== 4) {
					character.y += 1;
					var top = parseInt(element.css("top"));
					element.css("top", top + grid + "px");
					moved = true;
				}
				break;
			case "left":
				if(level[character.y][character.x - 1] !== 3) {
					var left = parseInt(element.css("left"));
					if(character.y === 9 && character.x === 0) {
						character.x = 18;
						element.css("left", left + grid*18 + "px");
					}
					else {
						character.x -= 1;
						element.css("left", left - grid + "px");
						
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
					moved = true;
				}
				break;
			default:
				break;
		}
		return moved;
	}
    
	function collision(name1, name2) {

		var thing1 = $("#" + name1);
		var thing2 = $("#" + name2);
		if(!thing1.length || !thing2.length) {
			return false;
		}

		return thing1.css("top") === thing2.css("top") && thing1.css("left") === thing2.css("left");

		var r1 = {
			top: parseInt(thing1.css("top")),
			bottom: parseInt(thing1.css("top")) + grid-5,
			left: parseInt(thing1.css("left")),
			right: parseInt(thing1.css("left")) + grid-5
		};

		var r2 = {
			top: parseInt(thing2.css("top")),
			bottom: parseInt(thing2.css("top")) + grid-5,
			left: parseInt(thing2.css("left")),
			right: parseInt(thing2.css("left")) + grid-5
		};


		var result = !(r2.left > r1.right ||
			r1.left > r2.right ||
			r2.top > r1.bottom ||
			r1.top > r2.bottom);

		return result;
	}

	function playAudio(audioId) {
		document.getElementById(audioId).play();
	}

	function stopAudio(audioId) {
		var sound = document.getElementById(audioId);
		//sound.removeAttribute("loop");
		sound.pause();
		sound.currentTime = 0;
	}

});