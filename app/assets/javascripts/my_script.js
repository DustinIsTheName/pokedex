(function($) {
	$(document).ready(function() {

		//begin the game on Fire
		var victoryFire = 'play';
		var flagTrigger = false;
		var firstClick = true;
		var rows = 10;
		var columns = 10;
		var mines = 15;
		var minesLeft = mines;
		var mineField = [];
		mineField[0] = [0,0,0,0,0,0,0,0,0,0];
		mineField[1] = [0,0,0,0,0,0,0,0,0,0];
		mineField[2] = [0,0,0,0,0,0,0,0,0,0];
		mineField[3] = [0,0,0,0,0,0,0,0,0,0];
		mineField[4] = [0,0,0,0,0,0,0,0,0,0];
		mineField[5] = [0,0,0,0,0,0,0,0,0,0];
		mineField[6] = [0,0,0,0,0,0,0,0,0,0];
		mineField[7] = [0,0,0,0,0,0,0,0,0,0];
		mineField[8] = [0,0,0,0,0,0,0,0,0,0];
		mineField[9] = [0,0,0,0,0,0,0,0,0,0];

		function setMines() { //determine the mine placement
			var count = 0; //counts # of mines placed
			for (i = 0; i < columns; i++) {
				for (t = 0; t < rows; t++) {
					mineField[i][t] = 0; //resets the field
				}
			}
			while (count < mines) { //adds 15 random mines
				i = Math.floor(Math.random()*columns); 
				t = Math.floor(Math.random()*rows);
				if (mineField[i][t] != -1) {
					mineField[i][t] = -1;
					count++;
				}
			}
			for (i = 0; i < columns; i++) { //assgins numbers to square according to surrounding mines
				for (t = 0; t < rows; t++) {
					var countAgain = 0;
					if (mineField[i][t] != -1) {
						for (var a = -1; a <=1; a++) {
							for (var b = -1; b <= 1; b++) {
								if((i+a)>=0 && (i+a)<columns && (t+b)>=0 && (t+b)<rows) {
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

		$('#changeField').click(function() {
			var errorRows = [false, 'low'];
			var errorColumns = [false, 'low'];
			var errorMines = [false, 'low'];
			$('.error').remove();
			checkRows = $('#rows').val();
			checkColumns = $('#columns').val();
			checkMines = $('#mines').val();
			if (checkRows<=0) {
				errorRows = [true, 'low'];
			}
			if (checkRows>=21) {
				errorRows = [true, 'high'];
			}
			if (checkColumns<=0) {
				errorColumns = [true, 'low'];
			}
			if (checkColumns>=21) {
				errorColumns = [true, 'high'];
			}
			if (checkMines<=0) {
				errorMines = [true, 'low'];
			}
			if (checkMines>=checkRows*checkColumns) {
				errorMines = [true, 'high'];
			}
			if (errorRows[0]) {
				$('.input-row.rows').append('<div class="error">too '+errorRows[1]+'</div>');
			}
			if (errorColumns[0]) {
				$('.input-row.columns').append('<div class="error">too '+errorColumns[1]+'</div>');
			}
			if (errorMines[0]) {
				$('.input-row.mines').append('<div class="error">too '+errorMines[1]+'</div>');
			}

			if (!errorRows[0] && !errorColumns[0] && !errorMines[0]) {
				rows = checkRows;
				columns = checkColumns;
				mines = checkMines;
				mineField = [];
				for (i = 0; i < columns; i++) {
					mineField[i] = [];
					for (t = 0; t < rows; t++) {
						mineField[i][t] = 0;
					}
				}
				$('.mine-field-inner').empty();
				for (i=0; i < rows*columns; i++) {
					$('.mine-field-inner').append('<div class="mine"><div class="inner"></div></div>');
				}
				$('.mine').css('padding', 50/columns+'%');
				var mineHeight = 920.938*((100/columns)/100);
				$('.mine-field').height(mineHeight*rows+30);
				$('.mine-field-inner').css('height', (mineHeight*rows+10)+'px');
				$('.inner').css('padding-top', mineHeight*.369+'px');
				console.log('mineHeight: '+mineHeight);
				console.log('width: '+100/columns);
				resetFire();
			}
		});

		$('.mine-field-inner').on('click', '.mine', function() {
			var thisMine = $(this);
			var victoryLost = false;
			if (victoryFire === 'play') {
				if (flagTrigger === false && thisMine.hasClass('flag') === false) {									
					var getMinePosition = function() {
						for (i = 0; i < columns; i++) {
							for (t = 0; t < rows; t++) {
								if (thisMine.is('.mine:nth-child('+((i+1)+(t*columns))+')')) {
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
						if ($('.mine:nth-child('+((x+1)+(y*columns))+')').hasClass('flag') === false) {
							switch (mineField[x][y]) {
								case -1:
									victoryLost = true;
									$('.mine-count').text('It all goes boom');					
									for (i = 0; i < columns; i++) {
										for (t = 0; t < rows; t++) {
											if (mineField[i][t] === -1) {
												$('.mine:nth-child('+((i+1)+(t*columns))+')').addClass('boom');
											}
										}
									}
									//$('.boom').css('background-color','red');
									break;
								case 0:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('set-off');
									mineField[x][y] = -2;
									for (var a = -1; a <= 1; a++) {
										for (var b = -1; b <= 1; b++) {
											if ((x+a)>=0 && (x+a)<columns && (y+b)>=0 && (y+b)<rows) {
												setOff(x+a,y+b); //sets off all surrounding spaces
											}
										}
									}
									break;
								case 1:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('one set-off').children('.inner').text('1');
									break;
								case 2:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('two set-off').children('.inner').text('2');
									break;
								case 3:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('three set-off').children('.inner').text('3');
									break;
								case 4:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('four set-off').children('.inner').text('4');
									break;
								case 5:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('five set-off').children('.inner').text('5');
									break;
								case 6:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('six set-off').children('.inner').text('6');
									break;
								case 7:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('seven set-off').children('.inner').text('7');
									break;
								case 8:
									$('.mine:nth-child('+((x+1)+(y*columns))+')').addClass('eight set-off').children('.inner').text('8');
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
				for(i = 0; i < columns; i++) {
					for (t = 0; t < rows; t++) {
						if (mineField[i][t] === -2) {
							victoryCount++
						}
					}
				}
				if (victoryCount >= (rows*columns)-mines) {
					victoryFire = "won";
					$('.mine-count').text('It\'s safe now!');
					for(i = 0; i < columns; i++) {
						for (t = 0; t < rows; t++) {
							if (mineField[i][t] === -1) {
								$('.mine:nth-child('+((i+1)+(t*columns))+')').css('background-color',"#00f700");
							}
						}
					}
				}
			} //end checkForVictory
			if (victoryFire != 'lost') {
				checkForVictory();
			}
		}); //end click on $('.mine')
		function resetFire() {
			victoryFire = 'play';
			flagTrigger = false;
			minesLeft = mines;
			$('.mine-count').text(mines+' REMAIN');
			$('.flag-trigger').removeClass('pushed');
			$('.mine').removeClass('set-off one two three four five six seven eight boom flag').css('background-color','#ccc').children('.inner').text('');
			firstClick = true;
			setMines();
		}
		$('.reset-fire').click(resetFire); // end click on $('.reset-fire')
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