var boardArray = [];
var availMoveCells = [];
var currentSelectedPiece = null;
var originalLocation = null;
var currentTurn = 0;
var currentColorTurn = 'black';
var moveOnRightPosition = null;
var moveOnLeftPosition = null;
var firstMoveOnTurn = true;
var pieceJumped = false;
var checkForJumps = false;
var canSwitch = true;

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
        cellObject.type = null;
      }else{
        cell.setAttribute('class', 'white-cell');
        cellObject.color = 'white';
        cellObject.action = null;
        cellObject.type = null;
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

  if(boardArray[row][cell].action === 'clicked' && canSwitch){
    boardArray[row][cell].action = null;
    selectPiece(null);
  }else if(boardArray[row][cell].piece === currentColorTurn && canSwitch){
    currentSelectedPiece = id;
    selectPiece(id);
    boardArray[row][cell].action = 'clicked';
    checkMoves(id);
  }else if(boardArray[row][cell].action === 'available'){
    movePiece(id);
  }
}

function selectPiece(id){
    clearAvailableCells();
    currentSelectedPiece = currentSelectedPiece === id ? id : null;
}

function checkMoves(id){
  getSingleMoves(id);
  getJumpMoves(id);
  if(currentPieceIsKing()){
    getSingleMoves(id, true);
    getJumpMoves(id, true);
  }
}

// function checkKingMoves(id){
//
// }

function currentPieceIsKing(){
  var loc = deconstructId(currentSelectedPiece);
  return boardArray[loc.row][loc.cell].type === 'king';
}

function getSingleMoves(id, isKing){
  getMoves(id, 1, isKing);
}

function getJumpMoves(id, isKing){
  getMoves(id, 2, isKing);
}

function genTargetId(targetRow, currCell, magnitude, hDir){
  targetCell = currCell + magnitude * hDir;
  return constructId(targetRow, targetCell);
}

function getMoves(id, magnitude, isKing){
  var loc = deconstructId(id);
  // var dir = currentColorTurn === 'black' ? -1 : 1;
  if((currentColorTurn === 'black' && !isKing) || (currentColorTurn === 'red' && isKing)){
    var dir = -1;
  }else{
    var dir = 1;
  }
  var targetRow = loc.row + dir * magnitude;
  var targetId = genTargetId(targetRow, loc.cell, magnitude, -1);
  // check left
  if(canMoveToCell(targetId, dir, magnitude, -1)){
    availMoveCells.push(
      constructId(loc.row + dir * magnitude, loc.cell - magnitude)
    );
    markTarget(targetId);
  }
  // check right
  targetId = genTargetId(targetRow, loc.cell, magnitude, 1);
  if(canMoveToCell(targetId, dir, magnitude, 1)){
    availMoveCells.push(
      constructId(loc.row + dir * magnitude, loc.cell + magnitude)
    );
    markTarget(targetId);
  }
}

function determineEnemyLocationToClear(){
  var row = (parseInt(currentSelectedPiece[0]) - parseInt(originalLocation[0])) / 2;
  var cell = (parseInt(currentSelectedPiece[1]) - parseInt(originalLocation[1])) / 2;
  var newRow = parseInt(originalLocation[0]) + parseInt(row);
  var newCell = parseInt(originalLocation[1]) + parseInt(cell);
  return constructId(newRow, newCell);
}

function clearEnemy(id){
  var cell = boardArray[id[0]][id[1]];
  cell.action = null;
  cell.piece = null;
  cell.status = null;
  resetColor(id);
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

function getCellState(id){
  var loc = deconstructId(id);
  var row = loc.row;
  var cell = loc.cell;
  return boardArray[row][cell];
}

function isJumpMove(toId){
  return Math.abs(parseInt(toId[0]) - parseInt(currentSelectedPiece[0])) === 2;
}

function movePiece(toId){
  var newLoc = document.getElementById(toId);
  var oldLoc = document.getElementById(currentSelectedPiece);
  var currCell = getCellState(currentSelectedPiece);
  var newCell = getCellState(toId);
  if(newCell.status === null && newCell.action === 'available'){
    clearAvailableCells();
    newLoc.className = oldLoc.className;
    // newLoc.setAttribute('class', 'white-cell ' + currentColorTurn + '-piece');
    for (var key in currCell) {
      if (currCell.hasOwnProperty(key)) {
        newCell[key] = currCell[key];
      }
    }
    // newCell.type = currCell.type;
    // newCell.status = 'piece';
    // newCell.piece = currentColorTurn;
    // newCell.color = 'white';
    // newCell.action = null;
    currCell.status = null;
    currCell.piece = null;
    currCell.action = null;
    currCell.type = null;
    oldLoc.setAttribute('class', 'white-cell');
    firstMoveOnTurn = false;
    // currentSelectedPiece = toId;
    if(pieceIsOnOppEdge(toId)){
      changeToKing(toId);
    }
    if(isJumpMove(toId)){
      canSwitch = false;
      originalLocation = currentSelectedPiece;
      currentSelectedPiece = toId;
      checkForJumps = true;
      var jumpedCell = determineEnemyLocationToClear();
      clearEnemy(jumpedCell);
    }
    if(checkForJumps && checkAdditionalJumps(toId)){
      changeAvailCellsYellow();
    }else{
      setUpNextTurn();
    }
  }
}

function pieceIsOnOppEdge(id){
  if(currentColorTurn === 'black' && id[0] === '0'){
    return true;
  }else if(currentColorTurn === 'red' && id[0] === '7'){
    return true;
  }else{
    return false;
  }
}

function changeToKing(id){
  var cell = boardArray[id[0]][id[1]];
  cell.type = 'king';
  document.getElementById(id).setAttribute('class', 'white-cell ' + currentColorTurn + '-king-piece');
}

function checkAdditionalJumps(id){
  getJumpMoves(id);
  if(currentPieceIsKing()){
    getJumpMoves(id, true);
  }
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
  return magnitude === 1 ? canSingleMoveToCell(loc) : canJumpToCell(loc.row, loc.cell, dir, hDir);
}

function canSingleMoveToCell(loc){
  if(isOnBoard(loc.row, loc.cell)){
    return cellIsEmpty(loc.row, loc.cell);
  }
}

function canJumpToCell(row, cell, vDir, hDir){
  //check if target is empty and on board
  if(!isOnBoard(row, cell)){
    return false;
  }else if(!cellIsEmpty(row, cell)){
    return false;
  //check if intermediate cell is occupied by the enemy
  }else if(!cellIsEnemy(row - vDir,cell - hDir)){
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
  return row <= 7 && row >= 0 && cell <= 7 && cell >= 0;
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
  checkForJumps = false;
  canSwitch = true;
}

function deconstructId(id){
  return {
    row: parseInt(id[0]),
    cell: parseInt(id[1])
  };
}

function constructId(row, cell){
  return row.toString() + cell.toString();
}
