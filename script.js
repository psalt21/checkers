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
  if(boardArray[row][cell].action === 'none' && boardArray[row][cell].piece === currentColorTurn && isFirstClickForTurn && isInbounds(id)){
    currentSelectedPiece = id;
    boardArray[row][cell].action = 'clicked';
    isFirstClickForTurn = false;
    checkAvailableMoves(id, row);
  }else if(boardArray[row][cell].action === 'clicked'){
    boardArray[row][cell].action = 'none';
    clearAvailableCells();
    currentSelectedPiece = 'none';
    isFirstClickForTurn = true;
  }else if(boardArray[row][cell].action === 'available'){
    movePiece(id);
  }
}

function deconstructId(id){
  return {
    row: id[0],
    cell: id[1]
  };
};

// function checkAvailableMoves(id){
//   var targets = getTargets(id);
//   //use these targets to determine where you can go
// }
//
// function getTargets(id){
//   var loc = deconstructId(id);
//   var dir = currentColorTurn === 'black' ? -1 : 1;
//   var targets = [];
//   //check left no jump
//   if(isOnBoard(loc.row + dir, loc.cell - 1)){
//     targets.push({
//       row: loc.row + dir,
//       cell: loc.cell - 1,
//       move: 'single'
//     });
//   }
//   //check left with jump
//   if(canJumpToCell(loc.row + (dir * 2), loc.cell - 2, dir, -1)){
//     targets.push({
//       row: loc.row + (dir * 2),
//       cell: loc.cell - 2,
//       move: 'jump'
//     });
//   }
//   // check right no jump
//   if(isOnBoard(loc.row - dir, loc.cell + 1)){
//     targets.push({
//       row: loc.row - dir,
//       cell: loc.cell + 1,
//       move: 'single'
//     });
//   }
//   // check right with jump
//   if(canJumpToCell(loc.row - (dir * 2), loc.cell + 2, dir, +1)){
//     targets.push({
//       row: loc.row + (dir * 2),
//       cell: loc.cell - 2,
//       move: 'jump'
//     });
//   }
//   return targets;
// }

function isOnBoard(row,cell){
  return row <= 7 && row >= 0 && cell <= 7 && row >= 0;
}

function canJumpToCell(row,cell,vDir,hDir){
  //check if target is empty and on board
  if(!isOnBoard(row,cell) || !cellIsEmpty(row,cell)){
    return false;
  }
  //check if intermediate cell is occupied by the enemy
  else if(!cellIsEnemy(row - vDir,cell - hDir)){
    return false;
  }
  return true;
}

function cellIsEmpty(row,cell){

}

function cellIsEnemy(row,cell){

}

function checkAvailableMoves(id, row){
  if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'black' && isInbounds(id) === true){
    singleMoveBlackCheckLeft(id, row);
    singleMoveBlackCheckRight(id, row);
  }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'red' && isInbounds(id) === true){
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
  var cellInfo = getCellInfo(cell, null, null, 1);
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
  var cellInfo = getCellInfo(cell, '-', '-', 1);
  if(cellInfo.inBounds){
    var id = cellInfo.id;
    var currentCellArrayPosition = cellInfo.cellObj;
    if(currentCellArrayPosition.status === 'none'){
      document.getElementById(id).setAttribute('class', 'yellow-cell');
      currentCellArrayPosition.color = 'yellow';
      currentCellArrayPosition.action = 'available';
      // moveOnLeftPosition = id;
      availMoveCells.push(id);
      isFirstClickForTurn = false;
    }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'red' && isInbounds(id) === true){
      jumpMoveBlackCheckLeft(cell, row, currentCellArrayPosition);
    }
  }
}
function jumpMoveBlackCheckLeft(cell, row, currentCell){
  var jumpCellInfo = getCellInfo(cell, '-', '-', 2);
  if (jumpCellInfo.inBounds) {
    var jumpId = jumpCellInfo.id;
    var currentJumpCellArrayPosition = jumpCellInfo.jumpCellObj;
    if(currentCell.status === 'piece' && currentJumpCellArrayPosition.status === 'none'){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
      isFirstClickForTurn = false;
    }
  }
}

function singleMoveBlackCheckRight(cell, row){
  var cellInfo = getCellInfo(cell, '-', '+', 1);
  if(cellInfo.inBounds){
    var id = cellInfo.id;
    var currentCellArrayPosition = cellInfo.cellObj;
    if(currentCellArrayPosition.status === 'none'){
      document.getElementById(id).setAttribute('class', 'yellow-cell');
      currentCellArrayPosition.color = 'yellow';
      currentCellArrayPosition.action = 'available';
      // moveOnRightPosition = id;
      availMoveCells.push(id);
      isFirstClickForTurn = false;
    }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'red' && isInbounds(id) === true){
      jumpMoveBlackCheckRight(cell, row, currentCellArrayPosition);
    }
  }
}
function jumpMoveBlackCheckRight(cell, row, currentCell){
  var jumpCellInfo = getCellInfo(cell, '-', '+', 2);
  if(jumpCellInfo.inBounds){
    var jumpId = jumpCellInfo.id;
    var currentJumpCellArrayPosition = jumpCellInfo.jumpCellObj;
    if(currentCell.status === 'piece' && currentJumpCellArrayPosition.status === 'none'){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
      isFirstClickForTurn = false;
    }
  }
}

function singleMoveRedCheckLeft(cell, row){
  var cellInfo = getCellInfo(cell, '+', '-', 1);
  if(cellInfo.inBounds){
    var id = cellInfo.id;
    var currentCellArrayPosition = cellInfo.cellObj;
    if(currentCellArrayPosition.status === 'none'){
      document.getElementById(id).setAttribute('class', 'yellow-cell');
      currentCellArrayPosition.color = 'yellow';
      currentCellArrayPosition.action = 'available';
      // moveOnLeftPosition = id;
      availMoveCells.push(id);
      isFirstClickForTurn = false;
    }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'black' && isInbounds(id) === true){
      jumpMoveRedCheckLeft(cell, row, currentCellArrayPosition);
    }
  }
}
function jumpMoveRedCheckLeft(cell, row, currentCell){
  var jumpCellInfo = getCellInfo(cell, '+', '-', 2);
  if(jumpCellInfo.inBounds){
    var jumpId = jumpCellInfo.id;
    var currentJumpCellArrayPosition = jumpCellInfo.jumpCellObj;
    if(currentCell.status === 'piece' && currentJumpCellArrayPosition.status === 'none'){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
      isFirstClickForTurn = false;
    }
  }
}

function singleMoveRedCheckRight(cell, row){
  var cellInfo = getCellInfo(cell, '+', '+', 1);
  if(cellInfo.inBounds){
    var id = cellInfo.id;
    var currentCellArrayPosition = cellInfo.cellObj;
    if(currentCellArrayPosition.status === 'none'){
      document.getElementById(id).setAttribute('class', 'yellow-cell');
      currentCellArrayPosition.color = 'yellow';
      currentCellArrayPosition.action = 'available';
      // moveOnRightPosition = id;
      availMoveCells.push(id);
      isFirstClickForTurn = false;
    }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'black' && isInbounds(id) === true){
      jumpMoveRedCheckRight(cell, row, currentCellArrayPosition);
    }
  }
}
function jumpMoveRedCheckRight(cell, row, currentCell){
  var jumpCellInfo = getCellInfo(cell, '+', '+', 2);
  if(jumpCellInfo.inBounds){
    var jumpId = jumpCellInfo.id;
    var currentJumpCellArrayPosition = jumpCellInfo.jumpCellObj;
    if(currentCell.status === 'piece' && currentJumpCellArrayPosition.status === 'none'){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
      isFirstClickForTurn = false;
    }
  }
}

function isInbounds(cell){
  if(cell[1] >= 0 && cell[1] <= 7 && cell[0] >= 0 && cell[0] <= 7){
    return true;
  }
}

// function getCellInfo(cell, rowOperator, cellOperator){
//     var row = rowOperator ? eval(parseFloat(cell[0]) + rowOperator + 1) : parseFloat(cell[0]);
//     var cell = cellOperator ? eval(parseFloat(cell[1]) + cellOperator + 1) : parseFloat(cell[1]);
//     var id = row + '' + cell;
//     var cellObj = boardArray[row][cell];
//     return {
//       id: id,
//       cellObj: cellObj
//     };
// }
function getCellInfo(cell, rowOperator, cellOperator, distance){
    var row = rowOperator ? eval(parseFloat(cell[0]) + rowOperator + distance) : parseFloat(cell[0]);
    var cell = cellOperator ? eval(parseFloat(cell[1]) + cellOperator + distance) : parseFloat(cell[1]);
    var id = row + '' + cell;
    if(isInbounds(id)) {
      var jumpCellObj = boardArray[row][cell];
      return {
        id: id,
        jumpCellObj: jumpCellObj,
        inBounds: true
      }
    } else {
      return {
        inBounds: false
      }
    }
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
