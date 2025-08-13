// The IIFE to alter the userInterface
const userInterface = (function () {
  // Add userInterface Elements needed 
  const form = document.querySelector('form');
  const gridCells = document.querySelectorAll('.grid-cell');
  const help = document.querySelector('#help');

  // Event Listeners
  form.addEventListener('submit', (event) => {
    // Get the form data and the player name
    event.preventDefault();
    const playerForm = new FormData(form);
    const playerName0 = playerForm.get("name-player-0");
    const playerName1 = playerForm.get("name-player-1");
    if (playerName0 && playerName1) {
      // Update the player section with their name, hide the input and show the scoreboard
      document.querySelector('#name-player-0').textContent = playerName0;
      document.querySelector('#name-player-1').textContent = playerName1;
      form.style.display = "none";
      // Tell gameflow that a new player was added
      gameFlow.registerAndStart(playerName0, playerName1);
    };
  });
  gridCells.forEach(cell => {
    cell.addEventListener('click', () => {
      // If the game is running and the cell is empty
      if (gameFlow.showProgress() && !cell.dataset.symbol) {
        // Get the playerss symbol and place it in the dataset as well as the UI
        let symbol = gameFlow.getCurrentPlayer().playerSymbol;
        cell.dataset.symbol = symbol;
        cell.textContent = symbol.toUpperCase();

        // Tell gameflow that the cell was played
        gameFlow.executeTurn(cell.dataset.x, cell.dataset.y);
      };
    });
  });

  // Update the help text in the UI
  function updateHelp(message) {
    help.textContent = message;
  }

  // Reset the board 
  function resetBoard() {
    gridCells.forEach(cell => {
      cell.removeAttribute("data-symbol");
      cell.textContent = "";
    });
  }
  return { updateHelp, resetBoard };
})();

const gameFlow = (function () {
  // Have a variable to see who's turn it is
  let currentPlayer;
  let gameStart = false;
  // Decide who goes first
  function whoGoesFirst(id) {
    currentPlayer = id;
  }

  // Handle the game end
  function endGame(result) {
    gameStart = false;
    if (result === "draw") {
      userInterface.updateHelp('Draw!');
    } else {
      userInterface.updateHelp(`${result} wins!`);
    }
  }

  // Get the players names and hand them to the players IIFE, start the game if there are 2 players
  function registerAndStart(playerName0, playerName1) {
    players.addPlayer(playerName0);
    players.addPlayer(playerName1);
    setGame();
  }

  // Execute a single turn
  const executeTurn = function(x, y) {
    // Get the current player
    const player = players.getPlayer(currentPlayer);
    // Play the cell
    result = gameboard.playCell(x, y, player);
    console.log(result)
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
  function setGame() {
    whoGoesFirst(0);
    gameStart = true;
    userInterface.updateHelp(`${getCurrentPlayer().name}'s turn`);
  }

  function getCurrentPlayer() {
    return players.getPlayer(currentPlayer);
  }

  return { setGame, showProgress, executeTurn, getCurrentPlayer, registerAndStart };
})();

const players = (function () {
  const playersArray = [];

  // Add a player to the array, if its the first they have o, if second x
  function addPlayer(name) {
    const playerSymbol = playersArray.length === 0 ? "o" : "x";
    playersArray.push({ name, playerSymbol, score: 0 });
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
      if (turns === 9) {
        return "draw";
      }
    } 
    return result;
  };

  const resetBoard = function() {
    boardArray = [
      [null, null, null], [null, null, null], [null, null, null],
    ];
    turns = 0;
  }

  const playCell = function(x, y, player) {
    boardArray[x][y] = player.playerSymbol;
    console.log(boardArray)
    return checkProgress(x, y);

  }
  return { playCell, resetBoard };
})();
