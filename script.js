// Array of a gameboard in a Gameboard object.
// Gameboard array should be a variable within a module, so we can not directly influence it but with the functions

const gameboard = (function () {
  let boardArray = [
    [null, null, null], [null, null, null], [null, null, null],
  ];

  function checkProgress() {
    function checkLine(coordA, coordB, coordC) {
      if (coordA !== null && (coordA === coordB && coordB === coordC)) {
        return coordA;
      } else {
        return null;
      }
    }
    // Check for winning condition
    // if [0][0] is equal to [1][1] and [2][2] or [0][2] is equal to [1][1] and [2][0]
    // if [0][i] is equal to [1][i] and [2][i] or if [i][0] is equal to [i][1] and [i][2]
    const lines = [[0, 0, 1, 1, 2, 2], [0, 2, 1, 1, 2, 0]];
    for (let i = 0; i < 3; i ++) {
      lines.push([0, i, 1, i, 2, i]);
      lines.push([i, 0, i, 1, i, 2]);
    }
    let result;
    for (const line of lines) {
      result = checkLine(boardArray[line[0]][line[1]], boardArray[line[2]][line[3]], boardArray[line[4]][line[5]]);
      if (result !== null) {
        console.log("WE HAVE A WINNER!")
        return result;
      }
    }
  };

  const playCell = function(x, y, player) {
    boardArray[x][y] = player.symbol;
    console.log(boardArray)
    checkProgress();
  }
  return{ playCell };
})();

