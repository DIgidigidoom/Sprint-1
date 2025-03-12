'use strict'
var gBoard = []
var gMatSize = 4
var gMine = '💣'
var gNumOfMines = 2
var isFirstClick = true
var gLives = 3
var gGmaeOverInterval
var gLightbulbs 



function onInit() {
    gLightbulbs = []
    isFirstClick = true
    gLives = 3
    gBoard = buildBoard()
    renderBoard(gBoard)
    lightbulbHint()
    updateScore()
    restartButtonStatus('happy')
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
            const cellCoverClass = currCell.isCovered ? 'hidden' : ''
            const cellMarkedClass = currCell.isMarked ? 'marked' : ''
            strHTML += `<td class="cell ${cellCoverClass} ${cellMarkedClass}" data-i="${i}" data-j="${j}" onclick="onCellClicked(event,this,${i},${j})">`
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
    disableRightClickMenu()
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
function expandReveal(cellI, cellJ, mat) {
    if (mat[cellI][cellJ].isMine) return
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine !== true) {
                gBoard[i][j].isCovered = false
            }
        }
    }
}

function onCellClicked(ev, elCell, i, j) {
    console.log(ev)
    if (isFirstClick === true) {
        placeMines(gBoard, gNumOfMines, i, j)
        isFirstClick = false
    }

    expandReveal(i, j, gBoard)
    checkIfMine(i, j)
    renderBoard(gBoard)
    checkGameOver()
}

function rightClick(ev) {
    const i = ev.target.getAttribute('data-i');
    const j = ev.target.getAttribute('data-j');
    if (gBoard[i][j].isCovered === true) {
        gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    }
    renderBoard(gBoard)
    console.log(gBoard)
}

function placeMines(board, numOfMines, i, j) {
    for (var index = 0; index < numOfMines;) {
        var emptyPos = findEmptyPos(board)
        if (emptyPos.i === i && emptyPos.j === j) continue

        board[emptyPos.i][emptyPos.j].isMine = true
        index++
    }

}

function checkIfMine(i, j) {
    if (gBoard[i][j].isMine === true) {
        gBoard[i][j].isCovered = false
        gLives--
        updateScore()
        restartButtonStatus('boom')
        alert('Thats A Mine!')
    } else {
        restartButtonStatus('happy')
    }

}

function updateScore() {
    var elScore = document.querySelector('.scoreboard span')
    elScore.innerHTML = gLives
    checkGameOver()
}
function restartButtonStatus(status) {
    var elbtn = document.querySelector('.restart-button')
    switch (status) {
        case 'happy':
            elbtn.innerHTML = '😀'
            break
        case 'boom':
            elbtn.innerHTML = '💥'
            break
        case 'cool':
            elbtn.innerHTML = '😎'
            break
        case 'lost':
            elbtn.innerHTML = '😭'
            break
    }

}

function checkGameOver() {
    //debugger
    if (gLives === 0) {
        restartButtonStatus('lost')
    } else {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isCovered === true && gBoard[i][j].isMine === false) return

            }

        }
        restartButtonStatus('cool')
    }

}

function lightbulbHint() {

    for (var i = 0; i < 3; i++) {
        gLightbulbs[i] = {
            isOn: true
        }
        renderLightbulbs(i)
    }
}

function renderLightbulbs(i) {
    var ellightbulb = document.querySelector('.lightbulb-hint')
    const strHTML = gLightbulbs[i].isOn ? '💡' : ''
    //var strHTML = '💡'
    ellightbulb.innerHTML += `<span onclick="isLightbulb(${i})" data-i="${i}">${strHTML}</span>`
}

// function isLightbulb(i){
//     var elhintActive = document.
    
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