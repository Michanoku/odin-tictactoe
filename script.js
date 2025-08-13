// Array of a gameboard in a Gameboard object.
// Gameboard array should be a variable within a module, so we can not directly influence it but with the functions

const UI = (function () {
  // Add EventListeners to the player name forms
  const forms = document.querySelectorAll('form');
  const gridCells = document.querySelectorAll('.grid-cell');
  const help = document.querySelector('#help');
  forms.forEach(form => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const playerForm = new FormData(form);
      const playerName = playerForm.get("name");
      if (playerName !== "") {
        document.querySelector(`#name-player-${form.dataset.player}`).textContent = playerName;
        form.style.display = "none";
        document.querySelector(`#score-display-player-${form.dataset.player}`).style.display = "block";
        players.addPlayer(playerName);
        if (players.playersReady()) {
          gameFlow.setGame();
        }
      };
    });
  });
  gridCells.forEach(cell => {
    cell.addEventListener('click', () => {
      if (gameFlow.showProgress() && cell.dataset.symbol === "") {
        let symbol = gameFlow.getCurrentPlayer().playerSymbol;
        cell.dataset.symbol = symbol;
        cell.textContent = symbol.toUpperCase();
        gameFlow.executeTurn(cell.dataset.x, cell.dataset.y);
        help.textContent = `${gameFlow.getCurrentPlayer().name}'s turn`;
      };
    });
  });

  function updateHelp(message) {
    help.textContent = message;
  }
  return { updateHelp };
})();

const gameFlow = (function () {
  // Have a variable to see who's turn it is
  let currentPlayer;
  let gameStart = false;
  // Decide who goes first
  function whoGoesFirst(id) {
    currentPlayer = id;
  }

  const executeTurn = function(x, y) {
    const player = players.getPlayer(currentPlayer);
    result = null;
    result = gameboard.playCell(x, y, player);
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    return result
  }

  const showProgress = function () {
    return gameStart;
  };

  // Set the initial game state
  function setGame() {
    console.log("Checking that players are ready")
    console.log("Player 0 goes first.")
    whoGoesFirst(0);
    console.log("Reset the board.")
    gameboard.resetBoard();
    gameStart = true;
    UI.updateHelp(`${getCurrentPlayer().name}'s turn`);
  }


  function getCurrentPlayer() {
    return players.getPlayer(currentPlayer);
  }

  return { setGame, showProgress, executeTurn, getCurrentPlayer };
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
    console.log(playersArray[index]);
    return playersArray[index];
  }

  // Reset players for a new game
  function resetPlayers() {
    playersArray.splice(0, playersArray.length);
  }

  // Check if players are ready (may not be needed)
  const playersReady = function() {
    return playersArray.length === 2;
  }

  return { addPlayer, resetPlayers, playersReady, getPlayer };
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
        return coordA;
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
    if (boardArray[x][y] !== null) {
      return "invalid";
    } else {
      boardArray[x][y] = player.playerSymbol;
      console.log(boardArray)
      return checkProgress(x, y);
    }
  }
  return { playCell, resetBoard };
})();
