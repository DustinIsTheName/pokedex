(function($) {
	$(document).ready(function() {
		
		//change the Site title to the title of the page/post when title is clicked
		var i = 0;
		var t = 0;
		$('.entry-title').click(function() {
			$(this).toggleClass("javascript-baby");
			var text = $(this).text();
			$('.site-title').text(text);
			var textFit = text.replaceAll(" ","");
			if (textFit.length > 12 && textFit.length <= 20) {
				$('.site-title').css('margin-top', '-27px');
			} else if (textFit.length <= 12) {
				$('.site-title').css('margin-top', '0');
				$('.top-header').css('height', '84px');
			} else if (textFit.length > 20) {
				$('.site-title').css('margin-top', '-27px');
				$('.top-header').css('height', '124px');
			}
		});
		//changes site title back when description(tag) is clicked
		$('.site-description').click(function() {
			$('.site-title').text('Dustin Milam');
			$('.site-title').css('margin-top', '0');
			$('.top-header').css('height', '84px');
		});
		//adds another grey button under the pink button when pressed
		$(".funny-button").click(function() {
			$(this).after("<div class='pop-up'></div>");
		});
		//removes grey button when clicked on itself
		$(document).on('click','.pop-up', function() {
			$(this).remove();
		});
		
		//adds unique number-based class to $('.square-box')
		var $square = $('.square-box');
		for (i = 1; i <= $square.length; i++) {
			$('.square-box:nth-child('+i+')').addClass('_'+i);
		}
		
		if ($('#content .page').hasClass('post-2') || $('#content .page').hasClass('post-6') || $('#content .page').hasClass('post-12')) {
			$('.funny-button').css('display','none'); //goodbye funny button!
		}

		//begins the game on page Normal
		var victoryNormal = false;
		$('.square-box').click(function() {
			var $thisBox = $(this);
			var getBoxPosition = function() { //stores which box was clicked
				for (i = 1; i <= $square.length; i++) {
					if ($thisBox.is('.square-box:nth-child('+i+')')) {
						return i;
					}
				}
			}; // end getBoxPosition()
			var boxPosition = getBoxPosition();
			var changeBoxColor = function(offSet) { //changes the color of target boxes
				$('.square-box:nth-child('+(boxPosition+offSet)+')').toggleClass('box-blue box-green');
			}//end changeBoxColor()
			if (victoryNormal === false) {
				changeBoxColor(0);
				if (boxPosition >= 4) {
					changeBoxColor(-3);
				}
				if (boxPosition % 3 != 0) {
					changeBoxColor(1);
				}
				if ((boxPosition-1) % 3 != 0) {
					changeBoxColor(-1);
				}
				if (boxPosition <= $square.length-3) {
					changeBoxColor(3);
				}
			}//end if (victory === false)
			var checkForVictory = function() { //checks to see if all boxes are green
				var victoryCount = 0
				for (i = 1; i <= $square.length; i++) {
					if ($('.square-box:nth-child('+i+')').hasClass('box-green')) {
						victoryCount++;
					}
				}
				if (victoryCount === $square.length) {
					victoryNormal = true;
					for (i = 1; i <= $square.length; i++) {
						$('.square-box:nth-child('+i+')').removeClass('box-green').addClass('box-purple');
					}
					$('.square-box:nth-child(1)').text('Y');
					$('.square-box:nth-child(2)').text('O');
					$('.square-box:nth-child(3)').text('U');
					$('.square-box:nth-child('+($square.length-2)+')').text('W');
					$('.square-box:nth-child('+($square.length-1)+')').text('I');
					$('.square-box:nth-child('+$square.length+')').text('N');
				}
			};//end checkForVictory()
			checkForVictory();
		});//end click on $('.square-box')
		$('.reset-normal').click(function() { //resets the game
			victoryNormal = false;
			for (i = 1; i <= $square.length; i++) {
				$('.square-box:nth-child('+i+')').removeClass('box-purple box-green').addClass('box-blue');
				$('.square-box:nth-child('+i+')').text('');
			}
		});//end click on $('reset-normal')
		//end the game on Normal

		//begin the game on Fire
		var victoryFire = 'play';
		var flagTrigger = false;
		var firstClick = true;
		var minesLeft = 15;
		var column1 = [0,0,0,0,0,0,0,0,0,0];
		var column2 = [0,0,0,0,0,0,0,0,0,0];
		var column3 = [0,0,0,0,0,0,0,0,0,0];
		var column4 = [0,0,0,0,0,0,0,0,0,0];
		var column5 = [0,0,0,0,0,0,0,0,0,0];
		var column6 = [0,0,0,0,0,0,0,0,0,0];
		var column7 = [0,0,0,0,0,0,0,0,0,0];
		var column8 = [0,0,0,0,0,0,0,0,0,0];
		var column9 = [0,0,0,0,0,0,0,0,0,0];
		var column10 = [0,0,0,0,0,0,0,0,0,0];
		var mineField = [];
		mineField[0] = column1;
		mineField[1] = column2;
		mineField[2] = column3;
		mineField[3] = column4;
		mineField[4] = column5;
		mineField[5] = column6;
		mineField[6] = column7;
		mineField[7] = column8;
		mineField[8] = column9;
		mineField[9] = column10;

		function setMines() { //determine the mine placement
			var count = 0; //counts # of mines placed
			for (i = 0; i <= 9; i++) {
				for (t = 0; t <= 9; t++) {
					mineField[i][t] = 0; //resets the field
				}
			}
			while (count <=14) { //adds 15 random mines
				i = Math.floor(Math.random()*10); 
				t = Math.floor(Math.random()*10);
				if (mineField[i][t] != -1) {
					mineField[i][t] = -1;
					count++;
				}
			}
			for (i = 0; i <= 9; i++) { //assgins numbers to square according to surrounding mines
				for (t = 0; t <= 9; t++) {
					var countAgain = 0;
					if (mineField[i][t] != -1) {
						for (var a = -1; a <=1; a++) {
							for (var b = -1; b <= 1; b++) {
								if((i+a)>=0 && (i+a)<=9 && (t+b)>=0 && (t+b)<=9) {
									if (mineField[i+a][t+b] === -1) {
										countAgain++;
									}
								}
							}
						}
						mineField[i][t] = countAgain;
					}
				}
			}
		} //end setMines()

		setMines();

		$('.mine').click(function() {
			var thisMine = $(this);
			var victoryLost = false;
			if (victoryFire === 'play') {
				if (flagTrigger === false && thisMine.hasClass('flag') === false) {									
					var getMinePosition = function() {
						for (i = 0; i <= 9; i++) {
							for (t = 0; t <= 9; t++) {
								if (thisMine.is('.mine:nth-child('+((i+1)+(t*10))+')')) {
									return [i,t];
								}
							}
						}
					}; //end getMinePosition()
					var minePosition = getMinePosition();
					if (firstClick === true) {
						while (mineField[minePosition[0]][minePosition[1]] === -1) {
							setMines();
						}						
					}
					firstClick = false;
					function setOff(x,y) {
						if ($('.mine:nth-child('+((x+1)+(y*10))+')').hasClass('flag') === false) {
							switch (mineField[x][y]) {
								case -1:
									victoryLost = true;						
									for (i = 0; i <= 9; i++) {
										for (t = 0; t <= 9; t++) {
											if (mineField[i][t] === -1) {
												$('.mine:nth-child('+((i+1)+(t*10))+')').addClass('boom');
											}
										}
									}
									//$('.boom').css('background-color','red');
									break;
								case 0:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('set-off');
									mineField[x][y] = -2;
									for (var a = -1; a <= 1; a++) {
										for (var b = -1; b <= 1; b++) {
											if ((x+a)>=0 && (x+a)<=9 && (y+b)>=0 && (y+b)<=9) {
												setOff(x+a,y+b); //sets off all surrounding spaces
											}
										}
									}
									break;
								case 1:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('one set-off').text('1');
									break;
								case 2:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('two set-off').text('2');
									break;
								case 3:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('three set-off').text('3');
									break;
								case 4:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('four set-off').text('4');
									break;
								case 5:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('five set-off').text('5');
									break;
								case 6:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('six set-off').text('6');
									break;
								case 7:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('seven set-off').text('7');
									break;
								case 8:
									$('.mine:nth-child('+((x+1)+(y*10))+')').addClass('eight set-off').text('8');
									break;
								default:
									break;
							} //end switch(mineField[minePosition[0]][minePosition[1]])
							mineField[x][y] = -2;
						} // end if $('.mine:nth-child('+((x+1)+(y*10))+')').hasClass('flag')
					} //end setOff(x,y)
					setOff(minePosition[0],minePosition[1]);//sets thisMine off
				} // end if flagTrigger === (false)
				if (flagTrigger === true && thisMine.hasClass('set-off') === false) {
					if (thisMine.hasClass('flag')) {
						minesLeft++;
					} else {
						minesLeft--;
					}
					thisMine.toggleClass('flag');
					if (minesLeft === 1 || minesLeft === -1) {
						$('.mine-count').text(minesLeft+' REMAINS');
					} else {
						$('.mine-count').text(minesLeft+' REMAIN');
					}
				}
			} //end if (victoryFire === 'play')
			if (victoryLost) {
				victoryFire = "lost";
			}
			var checkForVictory = function() {
				var victoryCount = 0;
				for(i = 0; i <= 9; i++) {
					for (t = 0; t <= 9; t++) {
						if (mineField[i][t] === -2) {
							victoryCount++
						}
					}
				}
				if (victoryCount >= 85) {
					victoryFire = "won";
					for(i = 0; i <= 9; i++) {
						for (t = 0; t <= 9; t++) {
							if (mineField[i][t] === -1) {
								$('.mine:nth-child('+((i+1)+(t*10))+')').css('background-color',"#00f700");
							}
						}
					}
				}
			} //end checkForVictory
			if (victoryFire != 'lost') {
				checkForVictory();
			}
		}); //end click on $('.mine')
		$('.reset-fire').click(function() {
			victoryFire = 'play';
			flagTrigger = false;
			minesLeft = 15;
			$('.mine-count').text('15 REMAIN');
			$('.flag-trigger').removeClass('pushed');
			$('.mine').removeClass('set-off one two three four five six seven eight boom flag').text('').css('background-color','#ccc');
			firstClick = true;
			setMines();
		}); // end click on $('.reset-fire')
		$('.flag-trigger').click(function() {
			if (victoryFire === 'play') {
				$('.flag-trigger').toggleClass('pushed');
				if (flagTrigger === true) {
					flagTrigger = false;
				} else {
					flagTrigger = true;
				}
			}
		}); // end click on $('.flag-trigger')
		//end game on Fire
		//begin game on Steel
		var snake = [];
		
	});
})(jQuery);