// Array of a gameboard in a Gameboard object.
// Gameboard array should be a variable within a module, so we can not directly influence it but with the functions

const gameboard = (function () {
  let boardArray = [
    [null, null, null], [null, null, null], [null, null, null],
  ];
  const playCell = function(x, y, symbol) {
    boardArray[x][y] = symbol;
    console.log(boardArray)
  }
  return{ playCell };
})();