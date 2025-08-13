// The IIFE to alter the userInterface
const userInterface = (function () {

  // Add userInterface Elements needed 
  const form = document.querySelector('form');
  const gridCells = document.querySelectorAll('.grid-cell');
  const help = document.querySelector('#help');
  const player0NameDiv = document.querySelector('#name-player-0');
  const player1NameDiv = document.querySelector('#name-player-1');
  const player0Score = document.querySelector('#score-player-0');
  const player1Score = document.querySelector('#score-player-1');
  const firstButtons = document.querySelector('#first-buttons');
  const player0Button = document.querySelector('#button-player-0');
  const player1Button = document.querySelector('#button-player-1');
  const againButtons = document.querySelector('#again-buttons');
  const again = document.querySelectorAll('button[name="again"]');

  // Event Listeners
  form.addEventListener('submit', (event) => {
    // Get the form data and the player name
    event.preventDefault();
    const playerForm = new FormData(form);
    const playerName0 = playerForm.get("name-player-0");
    const playerName1 = playerForm.get("name-player-1");
    if (playerName0 && playerName1) {
      // Update the player section with their name, hide the input and show the scoreboard
      player0NameDiv.textContent = playerName0;
      player1NameDiv.textContent = playerName1;
      form.style.display = "none";
      updateHelp('Who goes first?');
      player0Button.textContent = playerName0;
      player1Button.textContent = playerName1;
      firstButtons.style.display = "flex";
      // Tell gameflow that the players were added
      gameFlow.register(playerName0, playerName1);
    };
    form.reset();
  });
  // The buttons to decide who goes first
  [player0Button, player1Button].forEach(button => {
    button.addEventListener('click', () => {
      firstButtons.style.display = "none";
      // Start the game with the player who is first
      gameFlow.setGame(button.dataset.player);
    });  
  });
  // The cells in the tic tac toe grid
  gridCells.forEach(cell => {
    cell.addEventListener('click', () => {
      // If the game is running and the cell is empty
      if (gameFlow.showProgress() && !cell.dataset.symbol) {
        // Get the playerss symbol and place it in the dataset as well as the UI
        let symbol = gameFlow.getCurrentPlayer().playerSymbol;
        cell.dataset.symbol = symbol;
        cell.textContent = symbol.toUpperCase();
        // Tell gameflow that the cell was played
        gameFlow.executeTurn(parseInt(cell.dataset.x), parseInt(cell.dataset.y));
      };
    });
  });
  // The buttons to let the player decide to play again or not
  again.forEach(button => {
    button.addEventListener('click', () => {
      gameFlow.reset(button.dataset.again);
    });
  });

  // At the end of the game, show the again buttons and update the score
  function endGame(player, newScore) {
    againButtons.style.display = "flex";
    document.querySelector(`#score-player-${player}`).textContent = newScore;
  }

  // Update the help text in the UI
  function updateHelp(message) {
    help.textContent = message;
  }

  // Reset the board 
  function resetBoard(option) {
    // Reset the game board UI
    gridCells.forEach(cell => {
      cell.removeAttribute("data-symbol");
      cell.textContent = "";
    });
    againButtons.style.display = "none";
    // If the player does not want to play again, reset everything
    if (option === "no") {
      player0Score.textContent = 0;
      player1Score.textContent = 0;
      player0NameDiv.textContent = 'Player 1';
      player1NameDiv.textContent = 'Player 2';
      updateHelp('Enter player names');
      form.style.display = 'flex';

    }
  }
  return { updateHelp, endGame, resetBoard };
})();

// The IIFE that handles the flow of the game
const gameFlow = (function () {

  // Have a variable to see who's turn it is and if the game has started or not
  let currentPlayer;
  let gameStart = false;

  // Handle the game end
  function endGame(result) {
    // Set the game to end
    gameStart = false;
    const player = getCurrentPlayer();
    // Add score if there is a winner, otherwise just display the message
    if (result === "draw") {
      userInterface.updateHelp('Draw! Play again?');
    } else {
      userInterface.updateHelp(`${result} wins! Play again?`);
      player.addScore();
    }
    // Call the userInterface to initiate endgame cleanup
    userInterface.endGame(currentPlayer, player.score);
  }

  // Get the players names and hand them to the players IIFE, start the game if there are 2 players
  function register(playerName0, playerName1) {
    players.addPlayer(playerName0);
    players.addPlayer(playerName1);
  }

  // Execute a single turn
  const executeTurn = function(x, y) {
    // Get the current player
    const player = players.getPlayer(currentPlayer);
    // Play the cell
    result = gameboard.playCell(x, y, player);
    // If the result is not null, someone won or it's a draw
    if (result !== null) {  
      endGame(result);
    // Else, update the interface with who's turn it is and switch players
    } else {
      currentPlayer = currentPlayer === 0 ? 1 : 0;
      userInterface.updateHelp(`${gameFlow.getCurrentPlayer().name}'s turn`);
    }
  }

  // Show whether the game is running or not
  const showProgress = function () {
    return gameStart;
  };

  // Set the initial game state
  function setGame(startingPlayer) {
    currentPlayer = parseInt(startingPlayer);
    gameStart = true;
    userInterface.updateHelp(`${getCurrentPlayer().name}'s turn`);
  }

  // Return the current player
  function getCurrentPlayer() {
    return players.getPlayer(currentPlayer);
  }

  // Reset the game, tell all other IIFE's to reset their states as well
  function reset(option) {
    userInterface.resetBoard(option);
    gameboard.resetBoard();
    // If the player wants to play again, don't reset everything, switch players and start over
    if (option === "yes") {
      currentPlayer = currentPlayer === 0 ? 1 : 0;
      setGame(currentPlayer);
    } else {
      players.resetPlayers();
    }
  }
  return { setGame, showProgress, executeTurn, getCurrentPlayer, register, reset };
})();

// The IIFE to handle creation and update of players
const players = (function () {
  const playersArray = [];

  // The player object
  function Player(name, symbol) {
    this.name = name;
    this.playerSymbol = symbol;
    this.score = 0;
  }
  // Add a function so the players can add scores
  Player.prototype.addScore = function() {
    this.score++;
  };

  // Add a player to the array, if its the first they have o, if second x
  function addPlayer(name) {
    const playerSymbol = playersArray.length === 0 ? "o" : "x";
    const player = new Player(name, playerSymbol);
    playersArray.push(player);
  }
  
  // Get the player by the index in the array
  const getPlayer = function(index) {
    return playersArray[index];
  }

  // Reset players for a new game
  function resetPlayers() {
    playersArray.splice(0, playersArray.length);
  }

  return { addPlayer, resetPlayers, getPlayer };
})();

const gameboard = (function () {
  // Gameboard coordinates: 
  //  [0][0] | [0][1] | [0][2]
  //  -------+--------+-------
  //  [1][0] | [1][1] | [1][2]
  //  -------+--------+-------
  //  [2][0] | [2][1] | [2][2]

  // Initiate the game board array
  let boardArray = [
    [null, null, null], [null, null, null], [null, null, null],
  ];
  let turns = 0;
  // This function checks if someone has won the game after this turn
  function checkProgress(x, y) {
    // This function checks 3 coordinates (that form a line on the gameboard)
    function checkLine(coordA, coordB, coordC) {
      // If the first coordinate is not null, and the three coordinates are otherwise the same, return the value (the players symbol)
      if (coordA !== null && (coordA === coordB && coordB === coordC)) {
        return gameFlow.getCurrentPlayer().name;
      } else {
        return null;
      }
    }
    // Winning Condition: if [0][0] is equal to [1][1] and [2][2] or [0][2] is equal to [1][1] and [2][0]
    // or if [0][i] is equal to [1][i] and [2][i] or if [i][0] is equal to [i][1] and [i][2]

    let result = null;

    turns++;
    // A player can only win from turn 5 and onwards, so avoid checking before
    if (turns >= 5) {
      // Prepare an array of coordinates that form the lines we need to check for the winning condition
      // First, only add lines in the x or y position that is relevant
      const lines = [[x, 0, x, 1, x, 2], [0, y, 1, y, 2, y]];
      // If the player played the central field, add both diagonals
      if (x === 1 && y === 1) {
        lines.push([0, 0, 1, 1, 2, 2]);
        lines.push([2, 0, 1, 1, 0, 2]);
      // If the player played the top left or bottom right corner, add that diagonal only
      } else if ((x === 0 || x === 2) && x === y ) {
        lines.push([0, 0, 1, 1, 2, 2]);
      // If the player played the top right or bottom left corner, add that diagonal only
      } else if ((x === 0 && y === 2) || (x === 2 && y === 0)) {
        lines.push([0, 2, 1, 1, 2, 0]);
      }

      // Check all possible combination of lines to see if we have a winner (Could probably be reduced to only checking cells relevant to the one played)
      for (const line of lines) {
        const cell1 = boardArray[line[0]][line[1]];
        const cell2 = boardArray[line[2]][line[3]];
        const cell3 = boardArray[line[4]][line[5]];
        result = checkLine(cell1, cell2, cell3);
        if (result !== null) {
          return result;
        } 
      }
      // If there have been 9 turns, then the board must be full
      if (turns === 9) {
        return "draw";
      }
    } 
    return result;
  };

  // Reset the board and turns
  const resetBoard = function() {
    boardArray = [
      [null, null, null], [null, null, null], [null, null, null],
    ];
    turns = 0;
  }

  // Play a single cell, set the players symbol on the cell
  const playCell = function(x, y, player) {
    boardArray[x][y] = player.playerSymbol;
    return checkProgress(x, y);
  }
  return { playCell, resetBoard };
})();
