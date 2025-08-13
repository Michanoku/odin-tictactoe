// Array of a gameboard in a Gameboard object.
// Gameboard array should be a variable within a module, so we can not directly influence it but with the functions

const gameFlow = (function () {
  let currentPlayer;

  const whoGoesFirst = function (id) {
    currentPlayer = id;
  }
  const startGame = function() {
    if (players.playersReady) {
      gameboard.resetBoard();
    }
  }
});

const players = (function () {
  const playersArray = [];

  const addPlayer = function(name) {
    const playerSymbol = playersArray.length === 0 ? "o" : "x";
    return { name, playerSymbol };
  }
  
  const getPlayer = function(id) {
    return playersArray[id];
  }

  const resetPlayers = function() {
    playersArray.splice(0, playersArray.length);
  }

  const playersReady = function() {
    return playersArray.length === 2;
  }

  return { addPlayer, resetPlayers, playersReady };
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

    let result = null;
    // Check all possible combination of lines to see if we have a winner (Could probably be reduced to only checking cells relevant to the one played)
    for (const line of lines) {
      const cell1 = boardArray[line[0]][line[1]];
      const cell2 = boardArray[line[2]][line[3]];
      const cell3 = boardArray[line[4]][line[5]];
      result = checkLine(cell1, cell2, cell3);
      if (result !== null) {
        console.log("WE HAVE A WINNER!")
        return result;
      } 
    }
    return result;
  };

  const resetBoard = function() {
    boardArray = [
      [null, null, null], [null, null, null], [null, null, null],
    ];
  }

  const playCell = function(x, y, player) {
    boardArray[x][y] = player.symbol;
    console.log(boardArray)
    checkProgress(x, y);
  }

  return { playCell, resetBoard };
})();

