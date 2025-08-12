// Array of a gameboard in a Gameboard object.
// Gameboard array should be a variable within a module, so we can not directly influence it but with the functions

const gameboard = (function () {
  let boardArray = [
    [null, null, null], [null, null, null], [null, null, null],
  ];

  function checkProgress() {
    // Check for winning condition
    // if [0][0] is equal to [1][1] and [2][2] or [0][2] is equal to [1][1] and [2][0]
    if ((boardArray[0][0] === boardArray[1][1] && boardArray[1][1] === boardArray[2][2]) || (boardArray[0][2] === boardArray[1][1] && boardArray[1][1] === boardArray[2][0])) {

    } else {

    }
    for (let i = 0; i < 3; i++) {
      // if [0][i] is equal to [1][i] and [2][i] or if [i][0] is equal to [i][1] and [i][2]
      if ((boardArray[0][i] === boardArray[1][i] && boardArray[1][i] === boardArray[2][i]) || (boardArray[i][0] === boardArray[i][1] && boardArray[i][1] === boardArray[i][2])) {

      } 
    }


  };

  const playCell = function(x, y, player) {
    boardArray[x][y] = player.symbol;
    console.log(boardArray)
  }
  return{ playCell };
})();

