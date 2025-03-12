'use strict'
var gBoard = []
var gMatSize = 4
var gMine = '💣'
var gNumOfMines = 2






function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    setMinesNegsCount(gBoard)
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
    board[0][1].isMine = true
    board[0][2].isMine = true

    
    return board
}

function renderBoard(board) {
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board.length; j++) {
            const currCell = board[i][j]
            const cellClass = currCell.isCovered ? 'hidden' : ''

            //     if (currCell.isMine === true) {
            //         strHTML += `<td class="cell ${cellClass}" data-i="${i}" data-j="${j}"><span>${gMine}</span>
            //     </td>`
            //     } else {
            //         currCell.minesAroundCount = setMinesNegsCount(i, j, board)
            //         strHTML += `<td class="cell ${cellClass}" data-i="${i}" data-j="${j}"> 
            //         <span>${currCell.minesAroundCount}</span>
            //         </td>`
            //     }
            strHTML += `<td class="cell ${cellClass}" data-i="${i}" data-j="${j}" onclick="onCellClicked(this,${i},${j})">`
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

function onCellClicked(elCell, i, j) {

    //MODEL
    gBoard[i][j].isCovered = false

    //DOM
    elCell.classList.remove('hidden')
    console.log(elCell)


}

function placeMines(board, numOfMines) {
    for (var index = 0; index < numOfMines; index++) {
        var emptyPos = findEmptyPos(board)
        board[emptyPos.i][emptyPos.j].isMine = true
    }

}

// TODO: function onCellMarked(elCell) {

// }

// TODO:function checkGameOver(){

// }

// TODO:function expandReveal(board, elCell, i, j) {

// }