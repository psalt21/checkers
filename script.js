var boardArray = [];
var availMoveCells = [];
var currentSelectedPiece = 'none';
var isFirstClickForTurn = true;
var currentTurn = 0;
var currentColorTurn = 'black';
var moveOnRightPosition = 'none';
var moveOnLeftPosition = 'none';

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
        cellObject.action = 'none';
      }else{
        cell.setAttribute('class', 'white-cell');
        cellObject.color = 'white';
        cellObject.action = 'none';
        cell.addEventListener('click', cellClicked);
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
          cellObject.piece = 'none';
        }
      }
      row.appendChild(cell);
      rowArray.push(cellObject);
    }
    board.appendChild(row);
    boardArray.push(rowArray);
  }
}

function determineAction(event){
  var row = parseFloat(event.target.id[0]);
  var cell = parseFloat(event.target.id[1]);
  var id = row + '' + cell;
  if(boardArray[row][cell].action === 'none' && boardArray[row][cell].piece === currentColorTurn && isFirstClickForTurn === true){
    currentSelectedPiece = id;
    boardArray[row][cell].action = 'clicked';
    isFirstClickForTurn = false;
    checkAvailableMoves(id, row, cell);
  }else if(boardArray[row][cell].action === 'clicked'){
    boardArray[row][cell].action = 'none';
    clearAvailableCells();
    currentSelectedPiece = 'none';
    isFirstClickForTurn = true;
  }else if(boardArray[row][cell].action === 'available'){
    movePiece(id);
  }
}

function checkAvailableMoves(id, row){
  if(row > 0 && boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'black' && isInbounds(id) === true){
    singleMoveBlackCheckLeft(id, row);
    singleMoveBlackCheckRight(id, row);
  }else if(row < 7 && boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'red' && isInbounds(id) === true){
    singleMoveRedCheckLeft(id, row);
    singleMoveRedCheckRight(id, row);
  }
}

function clearAvailableCells(){
  for(var i = 0; i < availMoveCells.length; i++){
  var id = availMoveCells[i];
  var cell = boardArray[id[0]][id[1]];
    if(cell.status === 'none'){
      cell.action = 'none';
      cell.color = 'white';
      resetColor(id);
    }
  }
}

function movePiece(cell){
  var cellInfo = getCellInfo(cell);
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  var moveLocation = document.getElementById(id);
  var initialLocation = document.getElementById(currentSelectedPiece);
  var currentSelectedPieceColor = boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].piece;
  if(currentCellArrayPosition.status === 'none' && currentCellArrayPosition.action === 'available'){
    clearAvailableCells();
    moveLocation.setAttribute('class', 'white-cell ' + currentSelectedPieceColor + '-piece');
    currentCellArrayPosition.status = 'piece';
    currentCellArrayPosition.piece = currentSelectedPieceColor;
    currentCellArrayPosition.color = 'white';
    currentCellArrayPosition.action = 'none';
    boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].status = 'none';
    boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].piece = 'none';
    initialLocation.setAttribute('class', 'white-cell');
    isFirstClickForTurn = true;
    currentTurn++;
    isFirstClickForTurn = true;
  }
}

function singleMoveBlackCheckLeft(cell, row){
  var cellInfo = getCellInfo(cell, '-', '-');
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  if(currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
    currentCellArrayPosition.action = 'available';
    // moveOnLeftPosition = id;
    availMoveCells.push(id);
    isFirstClickForTurn = false;
  }else if(row > 2 && boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'black' && isInbounds(id) === true){
    jumpMoveBlackCheckLeft(cell, row);
  }
}
function jumpMoveBlackCheckLeft(cell, row){
  var jumpCellInfo = getJumpCellInfo(cell, '-', '-');
  var jumpId = jumpCellInfo.id;
  var currentJumpCellArrayPosition = jumpCellInfo.jumpCellObj;
  if(currentCellArrayPosition.status === 'piece' && currentJumpCellArrayPosition.status === 'none'){
    document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
    currentJumpCellArrayPosition.color = 'yellow';
    currentJumpCellArrayPosition.action = 'available';
    // moveOnLeftPosition = jumpId;
    availMoveCells.push(jumpId);
    isFirstClickForTurn = false;
  }
}

function singleMoveBlackCheckRight(cell, row){
  var cellInfo = getCellInfo(cell, '-', '+');
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  if(currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
    currentCellArrayPosition.action = 'available';
    // moveOnRightPosition = id;
    availMoveCells.push(id);
    isFirstClickForTurn = false;
  }else if(row > 2 && boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'black' && isInbounds(id) === true){
    jumpMoveBlackCheckRight(cell, row);
  }
}
function jumpMoveBlackCheckRight(cell, row){
  var jumpCellInfo = getJumpCellInfo(cell, '-', '+');
  var jumpId = jumpCellInfo.id;
  var currentJumpCellArrayPosition = jumpCellInfo.jumpCellObj;
  if(currentCellArrayPosition.status === 'piece' && currentJumpCellArrayPosition.status === 'none'){
    document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
    currentJumpCellArrayPosition.color = 'yellow';
    currentJumpCellArrayPosition.action = 'available';
    // moveOnLeftPosition = jumpId;
    availMoveCells.push(jumpId);
    isFirstClickForTurn = false;
  }
}

function singleMoveRedCheckLeft(cell, row){
  var cellInfo = getCellInfo(cell, '+', '-');
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  if(currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
    currentCellArrayPosition.action = 'available';
    // moveOnLeftPosition = id;
    availMoveCells.push(id);
    isFirstClickForTurn = false;
  }else if(row < 5 && boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'red' && isInbounds(id) === true){
    jumpMoveRedCheckLeft(cell, row);
  }
}
function jumpMoveRedCheckLeft(cell, row){
  var jumpCellInfo = getJumpCellInfo(cell, '+', '-');
  var jumpId = jumpCellInfo.id;
  var currentJumpCellArrayPosition = jumpCellInfo.jumpCellObj;
  if(currentCellArrayPosition.status === 'piece' && currentJumpCellArrayPosition.status === 'none'){
    document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
    currentJumpCellArrayPosition.color = 'yellow';
    currentJumpCellArrayPosition.action = 'available';
    // moveOnLeftPosition = jumpId;
    availMoveCells.push(jumpId);
    isFirstClickForTurn = false;
  }
}

function singleMoveRedCheckRight(cell, row){
  var cellInfo = getCellInfo(cell, '+', '+')
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  if(currentCellArrayPosition.status === 'none'){
    document.getElementById(id).setAttribute('class', 'yellow-cell');
    currentCellArrayPosition.color = 'yellow';
    currentCellArrayPosition.action = 'available';
    // moveOnRightPosition = id;
    availMoveCells.push(id);
    isFirstClickForTurn = false;
  }else if(row < 5 && boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'red' && isInbounds(id) === true){
    jumpMoveRedCheckRight(cell, row);
  }
}
function jumpMoveRedCheckRight(cell, row){
  var jumpCellInfo = getJumpCellInfo(cell, '+', '+');
  var jumpId = jumpCellInfo.id;
  var currentJumpCellArrayPosition = jumpCellInfo.jumpCellObj;
  if(currentCellArrayPosition.status === 'piece' && currentJumpCellArrayPosition.status === 'none'){
    document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
    currentJumpCellArrayPosition.color = 'yellow';
    currentJumpCellArrayPosition.action = 'available';
    // moveOnLeftPosition = jumpId;
    availMoveCells.push(jumpId);
    isFirstClickForTurn = false;
  }
}

function isInbounds(cell){
  if(cell[1] > 0 && cell[1] < 7 && cell[0] >= 0 && cell[0] <= 7){
    return true;
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
function getJumpCellInfo(cell, rowOperator, cellOperator){
    var row = rowOperator ? eval(parseFloat(cell[0]) + rowOperator + 2) : parseFloat(cell[0]);
    var cell = cellOperator ? eval(parseFloat(cell[1]) + cellOperator + 2) : parseFloat(cell[1]);
    var id = row + '' + cell;
    var jumpCellObj = boardArray[row][cell];
    return {
      id: id,
      jumpCellObj: jumpCellObj
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
  boardArray[moveOnLeftPosition[0]][moveOnLeftPosition[1]].color = 'white';
  boardArray[moveOnLeftPosition[0]][moveOnLeftPosition[1]].action = 'none';
  if(boardArray[moveOnLeftPosition[0]][moveOnLeftPosition[1]].status === 'none'){
    leftSquare.setAttribute('class', 'white-cell');
  }
  boardArray[moveOnRightPosition[0]][moveOnRightPosition[1]].color = 'white';
  boardArray[moveOnRightPosition[0]][moveOnRightPosition[1]].action = 'none';
  if(boardArray[moveOnRightPosition[0]][moveOnRightPosition[1]].status === 'none'){
    rightSquare.setAttribute('class', 'white-cell');
  }
}

function resetColor(id){
  var element = document.getElementById(id);
  element.setAttribute('class', 'white-cell');
}

function cellClicked(event){
  determineCurrentColorTurn();
  determineAction(event);
}

function isEven(number){
  return number % 2 === 0;
}
