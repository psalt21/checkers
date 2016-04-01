var currentSelectedPiece = 0;
var isFirstClickForTurn = true;
var boardArray = [];
var currentTurn = 0;
var currentColorTurn = 'black';
var moveOnRightPosition = 0;
var moveOnLeftPosition = 0;

(function setup(){
  buildBoard();
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
          var row = parseFloat(event.target.id[0]);
          var cell = parseFloat(event.target.id[1]);
          var id = row + '' + cell;
          if(isFirstClickForTurn === true){
            currentSelectedPiece = id;
            determineCurrentColorTurn();
          }
          var currentSelectedPieceColor = boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].piece;
          if(isFirstClickForTurn === true && currentSelectedPieceColor === currentColorTurn){
            checkAvailableMoves(id);
            isFirstClickForTurn = false;
          }else if(isFirstClickForTurn === false && currentSelectedPieceColor === currentColorTurn && boardArray[id[0]][id[1]].color === 'yellow'){
            movePiece(id);
            isFirstClickForTurn = true;
          }

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
  var cellInfo = getCellInfo(cell);
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  var moveLocation = document.getElementById(id);
  var initialLocation = document.getElementById(currentSelectedPiece);
  var currentSelectedPieceColor = boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].piece;
  if(currentCellArrayPosition.status === 'none' && currentCellArrayPosition.color === 'yellow'){
    changeYellowSquareToWhite();
    moveLocation.setAttribute('class', 'white-cell ' + currentSelectedPieceColor + '-piece');
    currentCellArrayPosition.status = 'piece';
    currentCellArrayPosition.piece = currentSelectedPieceColor;
    currentCellArrayPosition.color = 'white';
    boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].status = 'none';
    boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].piece = '';
    initialLocation.setAttribute('class', 'white-cell');
    isFirstClickForTurn = true;
    currentTurn++;
  }

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
  var cellInfo = getCellInfo(cell, '-', '-');
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  if(cell[1] > 0 && currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
    moveOnLeftPosition = id;
  }
}
function blackCheckRight(cell){
  var cellInfo = getCellInfo(cell, '-', '+');
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  if(cell[1] < 7 && currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
    moveOnRightPosition = id;
  }
}
function redCheckLeft(cell){
  var cellInfo = getCellInfo(cell, '+', '-');
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  if(cell[1] >= 0 && currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
    moveOnLeftPosition = id;
  }
}
function redCheckRight(cell){
  var cellInfo = getCellInfo(cell, '+', '+')
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  if(cell[1] < 7 && currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
    moveOnRightPosition = id;
  }
}
function getCellInfo(cell, rowOperator, cellOperator){
    var row = rowOperator ? eval(parseFloat(cell[0]) + rowOperator + 1) : parseFloat(cell[0]);
    var cell = cellOperator ? eval(parseFloat(cell[1]) + cellOperator + 1) : parseFloat(cell[1]);
    var id = row + '' + cell;
    var cellObj = boardArray[row][cell];
    return {
      id: id,
      cellObj: cellObj
    };
}
function determineCurrentColorTurn(){
  if(currentTurn % 2 === 0){
    currentColorTurn = 'black';
  }else{
    currentColorTurn = 'red';
  }
}
function determineCurrentSelectedPieceColor(){
  var currentSelectedPieceColor = boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].piece;
  return currentSelectedPieceColor;
  console.log(currentSelectedPieceColor);
}
function changeYellowSquareToWhite(){
  var leftSquare = document.getElementById(moveOnLeftPosition);
  var rightSquare = document.getElementById(moveOnRightPosition);
  leftSquare.color = 'white';
  if(boardArray[moveOnLeftPosition[0]][moveOnLeftPosition[1]].status === 'none'){
    leftSquare.setAttribute('class', 'white-cell');
  }
  rightSquare.color = 'white';
  if(boardArray[moveOnRightPosition[0]][moveOnRightPosition[1]].status === 'none'){
    rightSquare.setAttribute('class', 'white-cell');
  }
}
