var boardArray = [];

(function setup(){
  buildBoard();
  // setPieces();
})();

function buildBoard(){
  var board = document.getElementById('checker-board');
  for(var rowId = 0; rowId < 8; rowId++){
    var row = document.createElement('div');
    row.setAttribute('id', 'row' + rowId);
    row.setAttribute('class', 'row');
    var rowArray =[];
    for(var cellId = 0; cellId < 8; cellId++){
      var cellObject = {
        id: rowId + '' + cellId,
        status: 'none',
      };
      var cell = document.createElement('div');
      cell.setAttribute('id', rowId + '' + cellId);
      if(isEven(rowId + cellId)){
        cell.setAttribute('class', 'black-cell');
        cellObject.color = 'black';
      }else{
        cell.setAttribute('class', 'white-cell');
        cellObject.color = 'white';
        cell.addEventListener('click', function (event){
          console.log(event);
          movePiece(event.target.id);
        });
        if(rowId < 3){
          cell.setAttribute('class', 'white-cell red-piece');
          cellObject.piece = 'red';
          cellObject.status = 'piece';
        }else if(rowId > 4){
          cell.setAttribute('class', 'white-cell black-piece');
          cellObject.piece = 'black';
          cellObject.status = 'piece';
        }else{
          cell.setAttribute('class', 'white-cell');
        }
      }
      row.appendChild(cell);
      rowArray.push(cellObject);
    }
    board.appendChild(row);
    boardArray.push(rowArray);
  }
}

function isEven(number){
  return number % 2 === 0;
}

function movePiece(cell){
  var initialCellClicked = cell;
  checkAvailableMoves(cell);
}
function checkAvailableMoves(cell){
  if(boardArray[cell[0]][cell[1]].status === 'piece' && boardArray[cell[0]][cell[1]].piece === 'black'){
    blackCheckLeft(cell);
    blackCheckRight(cell);
  }else if(boardArray[cell[0]][cell[1]].status === 'piece' && boardArray[cell[0]][cell[1]].piece === 'red'){
    redCheckLeft(cell);
    redCheckRight(cell);
  }
}
function blackCheckLeft(cell){
  var row = parseFloat(cell[0]) - 1;
  var cell = parseFloat(cell[1]) - 1;
  var id = row + '' + cell;
  var currentCellArrayPosition = boardArray[row][cell];
  if(id >= 0 && currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
  }
}
function blackCheckRight(cell){
  var row = parseFloat(cell[0]) - 1;
  var cell = parseFloat(cell[1]) + 1;
  var id = row + '' + cell;
  var currentCellArrayPosition = boardArray[row][cell];
  if(currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
  }
}
function redCheckLeft(cell){
  var row = parseFloat(cell[0]) + 1;
  var cell = parseFloat(cell[1]) - 1;
  var id = row + '' + cell;
  var currentCellArrayPosition = boardArray[row][cell];
  if(id >= 0 && currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
  }
}
function redCheckRight(cell){
  var row = parseFloat(cell[0]) + 1;
  var cell = parseFloat(cell[1]) + 1;
  var id = row + '' + cell;
  var currentCellArrayPosition = boardArray[row][cell];
  if(currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
  }
}
