// Array of a gameboard in a Gameboard object.
// Gameboard array should be a variable within a module, so we can not directly influence it but with the functions

const gameboard = (function () {
  let boardArray = [
    [null, null, null], [null, null, null], [null, null, null],
  ];

  function checkProgress() {
    // The array is from 0 to 2, and then within that again from 0 to 2
    // Players win if: Their symbol is in all 0, 1, or 2 fields of the 0, 1, 2 outter arrays, or
    // in all fields of the outter arrays or in 0 0, 11, 22, or 02, 11, 20
    // [0][0], [1][0], [2][0] / [0][1], [1][1], [2][1] / [0][2], [1][2], [2][2]

    // [0][0], [0][1], [0][2] / [1][0], [1][1], [1][2] / [2][0], [2][1], [2][2]

    // [0][0], [1][1], [2][2] / [0][2], [1][1], [2][0]
    for (let i = 0; i < 3; i++) {
      // if [0][i] and [1][i] and [2][i] 
      // if [i][0] and [i][1] and [i][2]
    }
    // if [0][0] and [1][1] and [2][2] or  [0][2] and [1][1] and [2][0]
  };

  const playCell = function(x, y, player) {
    boardArray[x][y] = player.symbol;
    console.log(boardArray)
  }
  return{ playCell };
})();

