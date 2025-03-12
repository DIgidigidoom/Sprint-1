'use strict'
var gBoard = []
var gMatSize = 4
var gMine = '💣'
var gNumOfMines = 2
var isFirstClick = true
var gLives = 3






function onInit() {

    gBoard = buildBoard()
    renderBoard(gBoard)
    updateScore()
    disableRightClickMenu()
    console.log(gBoard)
}

function buildBoard() {
    const board = createMat(gMatSize, gMatSize)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isCovered: true,
                isMine: false,
                isMarked: false
            }
        }
    }
    //placeMines(board, gNumOfMines)

    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            const currCell = board[i][j]
            const cellClass = currCell.isCovered ? 'hidden' : ''
            strHTML += `<td class="cell ${cellClass}" data-i="${i}" data-j="${j}" onclick="onCellClicked(event,this,${i},${j})">`
            if (currCell.isMine === true) {
                strHTML += `<span>${gMine}</span>`

            } else {
                currCell.minesAroundCount = setMinesNegsCount(i, j, board)
                strHTML += `<span>${currCell.minesAroundCount}</span>`
            }
            strHTML += `</td>`
        }
        strHTML += '</tr>'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine === true) negsCount++
        }
    }
    return negsCount
}

function onCellClicked(ev, elCell, i, j) {
    console.log(ev)
    if (isFirstClick === true) {
        placeMines(gBoard, gNumOfMines, i, j)
        renderBoard(gBoard)
        disableRightClickMenu()
        isFirstClick = false
    }
    //MODEL
    gBoard[i][j].isCovered = false
    //FIXME: wornt remove hidden class on first click
    //DOM/
    elCell.classList.remove('hidden')
    elCell.classList.remove('marked')
    //console.log(elCell)
    checkIfMine(ev, elCell, i, j)
}

function rightClick(ev) {
    const i = ev.target.getAttribute('data-i');
    const j = ev.target.getAttribute('data-j');
    if (gBoard[i][j].isCovered === true) {
        ev.target.classList.toggle('marked')
    }
}

function placeMines(board, numOfMines, i, j) {
    for (var index = 0; index < numOfMines;) {
        var emptyPos = findEmptyPos(board)
        if (emptyPos.i === i && emptyPos.j === j) continue

        board[emptyPos.i][emptyPos.j].isMine = true
        index++
    }

}

function checkIfMine(ev, elCell, i, j) {
    if (gBoard[i][j].isMine === true) {
        gLives--
        updateScore()
        alert('Thats A Mine!')
    }
}

function updateScore() {
    var elScore = document.querySelector('.scoreboard span')
    elScore.innerHTML = gLives
}

// TODO: function onCellMarked(elCell) {

// }

// TODO:function checkGameOver(){

// }

// TODO:function expandReveal(board, elCell, i, j) {

// }

function disableRightClickMenu() {
    const cells = document.querySelectorAll('.cell');

    // Add event listener for the contextmenu (right-click) event
    cells.forEach(cell => {
        cell.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            rightClick(event)
            console.log('Right-click disabled on a cell!');
        });
    });
}