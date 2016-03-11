var boardSquares = [
  ['', 'red', '', 'red', '', 'red', '', 'red'],
  ['red', '', 'red', '', 'red', '', 'red', ''],
  ['', 'red', '', 'red', '', 'red', '', 'red'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['black', '', 'black', '', 'black', '', 'black', ''],
  ['', 'black', '', 'black', '', 'black', '', 'black'],
  ['black', '', 'black', '', 'black', '', 'black', ''],
];

(function setup(){
  buildBoard();
  setPieces();
})();

function buildBoard(){
  var colors = ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black',];
  var board = document.getElementById('checker-board');
  var rowId = 0;
  var squareId = 0;
  var currentColor = 0;

  for(var i = 0; i < 8; i++){
    var row = document.createElement('div');
    row.className = 'row';
    row.id = 'row' + rowId;


    for(var j = 0; j < 8; j++){
      if(currentColor >= colors.length){
        currentColor = 0;
      }
      var square = document.createElement('div');
      square.className = 'square';
      square.id = rowId + '' + squareId;
      square.style.backgroundColor = colors[currentColor];
      squareId++;
      row.appendChild(square);
      currentColor++;
      if(squareId > 7){
        squareId = 0;
      }
    }
    rowId++;
    board.appendChild(row);
  }
}

function setPieces(){
  for(var i = 0; i < boardSquares.length; i++){
    for(var j = 0; j < boardSquares[i].length; j++){
      if(boardSquares[i][j] === 'red'){
        var img = document.createElement('img');
        img.src = 'images/red.png';
        img.className = 'checker-piece';
        document.getElementById(i + '' + j).appendChild(img);
      }else if(boardSquares[i][j] === 'black'){
        var img = document.createElement('img');
        img.src = 'images/black.png';
        img.className = 'checker-piece';
        document.getElementById(i + '' + j).appendChild(img);
      }
    }
  }
}
