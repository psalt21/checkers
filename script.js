(function buildBoard(){
  var colors = ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white', 'white', 'black', 'white', 'black', 'white', 'black', 'white', 'black',];
  var board = document.getElementById('checker-board');
  var rowId = 0;
  var squareId = 0;
  var currentColor = 0;

  for(var i = 0; i < 8; i++){
    var row = document.createElement('div');
    row.className = 'row';
    row.id = 'row' + rowId;
    rowId++;

    for(var j = 0; j < 8; j++){
      if(currentColor >= colors.length){
        currentColor = 0;
      }
      var square = document.createElement('div');
      square.className = 'square';
      square.id = 'square' + squareId;
      square.style.backgroundColor = colors[currentColor];
      squareId++;
      row.appendChild(square);
      currentColor++;
    }
    board.appendChild(row);

  }
})();
