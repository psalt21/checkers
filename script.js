var boardArray = [];
var availMoveCells = [];
var currentSelectedPiece = null;
var currentTurn = 0;
var currentColorTurn = 'black';
var moveOnRightPosition = null;
var moveOnLeftPosition = null;
var firstMoveOnTurn = true;
var pieceJumped = false;

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
        status: null,
      };
      var cell = document.createElement('div');
      cell.setAttribute('id', rowId + '' + cellId);
      if(isEven(rowId + cellId)){
        cell.setAttribute('class', 'black-cell');
        cellObject.color = 'black';
        cellObject.action = null;
      }else{
        cell.setAttribute('class', 'white-cell');
        cellObject.color = 'white';
        cellObject.action = null;
        cell.addEventListener('click', cellClicked);
        if(rowId < 3){
          cell.setAttribute('class', 'white-cell red-piece');
          cellObject.piece = 'red';
          cellObject.status = 'piece';
          cellObject.type = 'normal';
        }else if(rowId > 4){
          cell.setAttribute('class', 'white-cell black-piece');
          cellObject.piece = 'black';
          cellObject.status = 'piece';
          cellObject.type = 'normal';
        }else{
          cell.setAttribute('class', 'white-cell');
          cellObject.piece = null;
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
  var id = event.target.id;
  if(boardArray[row][cell].type === 'normal' && boardArray[row][cell].action === null && boardArray[row][cell].piece === currentColorTurn && isInbounds(id)){
    selectPiece(id);
    boardArray[row][cell].action = 'clicked';
    checkMoves(id);
  }else if(boardArray[row][cell].type === 'king'){
  // check available KING moves
  }else if(boardArray[row][cell].action === 'clicked'){
    boardArray[row][cell].action = null;
    clearAvailableCells();
    currentSelectedPiece = null;
  }else if(boardArray[row][cell].action === 'available'){
    movePiece(id);
  }
}

function selectPiece(id){
  clearAvailableCells();
  currentSelectedPiece = currentSelectedPiece === id ? id : null;
}

function deconstructId(id){
  return {
    row: parseInt(id[0]),
    cell: parseInt(id[1])
  };
}

function constructId(row, cell){
  return row + cell;
}

function checkAdditionalJumps(id){
  availMoveCells = getJumpMoves(id);
  return availMoveCells.length;
  //use these targets to determine where you can go
}

function markTarget(id){
  markBoardStateTarget(id);
  markBoardTarget(id);
}

function markBoardStateTarget(id){
  boardArray[id[0]][id[1]].color = 'yellow';
  boardArray[id[0]][id[1]].action = 'available';
}

function markBoardTarget(id){
  document.getElementById(id).setAttribute('class', 'yellow-cell');
}

function changeAvailCellsYellow(){
  for(var i = 0; i < availMoveCells.length; i++){
    var id = availMoveCells[i];
    var cell = boardArray[id[0]][id[1]];
    cell.action = 'available';
    cell.color = 'yellow';
    document.getElementById(id).setAttribute('class', 'yellow-cell');
  }
}

function canMoveToCell(id, dir, magnitude, hDir){
  var loc = deconstructId(id);
  return magnitude === 1 ? canSingleMoveToCell(loc) : canJumpToCell(loc.row + dir * magnitude, loc.cell + hDir * magnitude, dir, hDir);
}

function canSingleMoveToCell(loc){
  return cellIsEmpty(loc.row, loc.cell);
}

function getMoves(id, magnitude){
  var loc = deconstructId(id);
  var dir = currentColorTurn === 'black' ? -1 : 1;
  var targetRow = loc.row + dir * magnitude;
  var targetCell = loc.cell - magnitude;
  var targetId = targetRow.toString() + targetCell.toString();
  // check left
  if(canMoveToCell(targetId, dir, magnitude, -1)){
    availMoveCells.push(
      constructId(loc.row + dir * magnitude, loc.cell - magnitude)
    );
    markTarget(targetId);
  }
  // check right
  if(canMoveToCell(targetId, dir, magnitude, 1)){
    availMoveCells.push(
      constructId(loc.row + dir * magnitude, loc.cell + magnitude)
    );
    markTarget(targetId);
  }
}

function checkMoves(id){
  getSingleMoves(id);
  getJumpMoves(id);
}

function getSingleMoves(id){
  getMoves(id, 1);
}

function getJumpMoves(id){
  getMoves(id, 2);
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

function cellIsEmpty(row, cell){
  return !boardArray[row][cell].status;
}

function cellIsEnemy(row,cell){
  return boardArray[row][cell].status === 'piece' && boardArray[row][cell].piece !== currentColorTurn;
}

function isOnBoard(row,cell){
  return row <= 7 && row >= 0 && cell <= 7 && row >= 0;
}

function getTargets(id){
  var loc = deconstructId(id);
  var dir = currentColorTurn === 'black' ? -1 : 1;
  var targets = [];
  //check left no jump
  if(isOnBoard(loc.row + dir, loc.cell - 1)){
    targets.push({
      row: loc.row + dir,
      cell: loc.cell - 1
    });
  }

  //check left with jump
  if(canJumpToCell(loc.row + (dir * 2), loc.cell - 2, dir, -1)){
    targets.push({
      row: loc.row + (dir * 2),
      cell: loc.cell - 2
    });
  }
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
    if(cell.status === null){
      cell.action = null;
      cell.color = 'white';
      resetColor(id);
    }
  }
  availMoveCells = [];
}

function movePiece(cell){
  var cellInfo = getCellInfo(cell, null, null, 1);
  var id = cellInfo.id;
  var currentCellArrayPosition = cellInfo.cellObj;
  var moveLocation = document.getElementById(id);
  var initialLocation = document.getElementById(currentSelectedPiece);
  var currentSelectedPieceColor = boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].piece;
  if(currentCellArrayPosition.status === null && currentCellArrayPosition.action === 'available'){
    clearAvailableCells();
    moveLocation.setAttribute('class', 'white-cell ' + currentSelectedPieceColor + '-piece');
    currentCellArrayPosition.status = 'piece';
    currentCellArrayPosition.type = 'normal';
    currentCellArrayPosition.piece = currentSelectedPieceColor;
    currentCellArrayPosition.color = 'white';
    currentCellArrayPosition.action = null;
    boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].status = null;
    boardArray[currentSelectedPiece[0]][currentSelectedPiece[1]].piece = null;
    initialLocation.setAttribute('class', 'white-cell');
    // currentTurn++;
    firstMoveOnTurn = false;
    currentSelectedPiece = id;
    clearAvailableCells();
    if(currentCellArrayPosition.isJump && checkAdditionalJumps(id)){
      changeAvailCellsYellow();
    }else{
      setUpNextTurn();
    }
  }
}

// function checkAdditionalJumpMoves(curCell){
//   var id = curCell;
//   color = boardArray[id[0]][id[1]].piece
//   if(color === 'black'){
//     if()
//       jumpMoveBlackCheckLeft(id, null);
//     }
//     jumpMoveBlackCheckRight(id, null);
//   }else if(boardArray[id[0]][id[1]].piece === 'red'){
//     jumpMoveRedCheckLeft(id, null);
//     jumpMoveRedCheckRight(id, null);
//   }
// }

function singleMoveBlackCheckLeft(cell){
  var cellInfo = getCellInfo(cell, '-', '-', 1);
  if(cellInfo.inBounds){
    var id = cellInfo.id;
    var currentCellArrayPosition = cellInfo.cellObj;
    if(currentCellArrayPosition.status === null){
      document.getElementById(id).setAttribute('class', 'yellow-cell');
      currentCellArrayPosition.color = 'yellow';
      currentCellArrayPosition.action = 'available';
      // moveOnLeftPosition = id;
      availMoveCells.push(id);
    }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'red' && isInbounds(id) === true){
      jumpMoveBlackCheckLeft(cell, currentCellArrayPosition);
    }
  }
}
function jumpMoveBlackCheckLeft(cell, currentCell){
  var jumpCellInfo = getCellInfo(cell, '-', '-', 2);
  if (jumpCellInfo.inBounds) {
    var jumpId = jumpCellInfo.id;
    var currentJumpCellArrayPosition = jumpCellInfo.cellObj;
    if(firstMoveOnTurn === true && currentCell.status === 'piece' && currentJumpCellArrayPosition.status === null){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      currentJumpCellArrayPosition.isJump = true; // if(obj.isJump) {}
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
    }else if(firstMoveOnTurn === false){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
    }
  }
}

function singleMoveBlackCheckRight(cell){
  var cellInfo = getCellInfo(cell, '-', '+', 1);
  if(cellInfo.inBounds){
    var id = cellInfo.id;
    var currentCellArrayPosition = cellInfo.cellObj;
    if(currentCellArrayPosition.status === null){
      document.getElementById(id).setAttribute('class', 'yellow-cell');
      currentCellArrayPosition.color = 'yellow';
      currentCellArrayPosition.action = 'available';
      // moveOnRightPosition = id;
      availMoveCells.push(id);
    }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'red' && isInbounds(id) === true){
      jumpMoveBlackCheckRight(cell, currentCellArrayPosition);
    }
  }
}
function jumpMoveBlackCheckRight(cell, currentCell){
  var jumpCellInfo = getCellInfo(cell, '-', '+', 2);
  if(jumpCellInfo.inBounds){
    var jumpId = jumpCellInfo.id;
    var currentJumpCellArrayPosition = jumpCellInfo.cellObj;
    if(firstMoveOnTurn === true && currentCell.status === 'piece' && currentJumpCellArrayPosition.status === null){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      currentJumpCellArrayPosition.isJump = true;
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
    }else if(firstMoveOnTurn === false){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
    }
  }
}

function singleMoveRedCheckLeft(cell){
  var cellInfo = getCellInfo(cell, '+', '-', 1);
  if(cellInfo.inBounds){
    var id = cellInfo.id;
    var currentCellArrayPosition = cellInfo.cellObj;
    if(currentCellArrayPosition.status === null){
      document.getElementById(id).setAttribute('class', 'yellow-cell');
      currentCellArrayPosition.color = 'yellow';
      currentCellArrayPosition.action = 'available';
      // moveOnLeftPosition = id;
      availMoveCells.push(id);
    }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'black' && isInbounds(id) === true){
      jumpMoveRedCheckLeft(cell, currentCellArrayPosition);
    }
  }
}
function jumpMoveRedCheckLeft(cell, currentCell){
  var jumpCellInfo = getCellInfo(cell, '+', '-', 2);
  if(jumpCellInfo.inBounds){
    var jumpId = jumpCellInfo.id;
    var currentJumpCellArrayPosition = jumpCellInfo.cellObj;
    if(firstMoveOnTurn === true && currentCell.status === 'piece' && currentJumpCellArrayPosition.status === null){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      currentJumpCellArrayPosition.isJump = true;
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
    }else if(firstMoveOnTurn === false){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
    }
  }
}

function singleMoveRedCheckRight(cell){
  var cellInfo = getCellInfo(cell, '+', '+', 1);
  if(cellInfo.inBounds){
    var id = cellInfo.id;
    var currentCellArrayPosition = cellInfo.cellObj;
    if(currentCellArrayPosition.status === null){
      document.getElementById(id).setAttribute('class', 'yellow-cell');
      currentCellArrayPosition.color = 'yellow';
      currentCellArrayPosition.action = 'available';
      // moveOnRightPosition = id;
      availMoveCells.push(id);
    }else if(boardArray[id[0]][id[1]].status === 'piece' && boardArray[id[0]][id[1]].piece === 'black' && isInbounds(id) === true){
      jumpMoveRedCheckRight(cell, currentCellArrayPosition);
    }
  }
}
function jumpMoveRedCheckRight(cell, currentCell){
  var jumpCellInfo = getCellInfo(cell, '+', '+', 2);
  if(jumpCellInfo.inBounds){
    var jumpId = jumpCellInfo.id;
    var currentJumpCellArrayPosition = jumpCellInfo.cellObj;
    if(firstMoveOnTurn === true && currentCell.status === 'piece' && currentJumpCellArrayPosition.status === null){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      currentJumpCellArrayPosition.isJump = true;
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
    }else if(firstMoveOnTurn === false){
      document.getElementById(jumpId).setAttribute('class', 'yellow-cell');
      currentJumpCellArrayPosition.color = 'yellow';
      currentJumpCellArrayPosition.action = 'available';
      // moveOnLeftPosition = jumpId;
      availMoveCells.push(jumpId);
    }
  }
}

function isInbounds(cell){
  if(cell[1] >= 0 && cell[1] <= 7 && cell[0] >= 0 && cell[0] <= 7){
    return true;
  }
}

function getCellInfo(cell, rowOperator, cellOperator, distance){
    var row = rowOperator ? eval(parseFloat(cell[0]) + rowOperator + distance) : parseFloat(cell[0]);
    var cell = cellOperator ? eval(parseFloat(cell[1]) + cellOperator + distance) : parseFloat(cell[1]);
    var id = row + '' + cell;
    if(isInbounds(id)) {
      var cellObj = boardArray[row][cell];
      return {
        id: id,
        cellObj: cellObj,
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
  boardArray[moveOnLeftPosition[0]][moveOnLeftPosition[1]].action = null;
  if(boardArray[moveOnLeftPosition[0]][moveOnLeftPosition[1]].status === null){
    leftSquare.setAttribute('class', 'white-cell');
  }
  boardArray[moveOnRightPosition[0]][moveOnRightPosition[1]].color = 'white';
  boardArray[moveOnRightPosition[0]][moveOnRightPosition[1]].action = null;
  if(boardArray[moveOnRightPosition[0]][moveOnRightPosition[1]].status === null){
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

function setUpNextTurn(){
  currentTurn++;
}
