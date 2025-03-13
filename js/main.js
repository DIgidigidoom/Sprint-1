'use strict'
var gBoard = []
var gMatSize = 4
var gMine = '💣'
var gNumOfMines = 2
var isFirstClick = true
var gLives = 3
var gGmaeOverInterval
var gHintOnInterval
var gLightbulbs
var gLightbulbChosen = false
var gTimer
var gTime = 0




function onInit() {
    document.querySelectorAll('.lightbulb-hint button').forEach(element => {
        element.className = '';
    });
    gLightbulbs = []
    isFirstClick = true
    gLives = 3
    gBoard = buildBoard()
    renderBoard(gBoard)
    lightbulbHint()
    updateScore()
    restartButtonStatus('happy')
    clearInterval(gTimer)
    tableInteraction(false)

    timer()
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
    //debugger  
    if (gLightbulbChosen) {
        checkFirstClick(i, j)
        renderBoard(gBoard)
        lightbulbIsOn(i, j, gBoard)
        isFirstClick = false
        gLightbulbChosen = false
    } else {
        checkFirstClick(i, j)

        expandReveal(i, j, gBoard)
        checkIfMine(i, j)
        renderBoard(gBoard)
        checkGameOver()
    }
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
function checkFirstClick(i, j) {
    if (isFirstClick === true) {
        placeMines(gBoard, gNumOfMines, i, j)
        isFirstClick = false
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

function checkIfMine(i, j) {
    if (gBoard[i][j].isMine === true) {
        gBoard[i][j].isCovered = false
        gLives--
        updateScore()
        restartButtonStatus('boom')
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
        revealAll()
        clearInterval(gTimer)
        tableInteraction(true)
    } else {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isCovered === true && gBoard[i][j].isMine === false) return

            }

        }
        restartButtonStatus('cool')
        clearInterval(gTimer)
        revealAll()
        tableInteraction(true)
        storeScore()
    }

}

function lightbulbHint() {

    for (var i = 0; i < 3; i++) {
        gLightbulbs[i] = {
            isOn: true,
            isChosen: false
        }

    }
}


function isLightbulb(i, elIsLbOn) {
    gLightbulbs[i].isChosen = !gLightbulbs[i].isChosen
    if (!gLightbulbs[i].isChosen) {
        elIsLbOn.classList.remove('chosen')
    } else {
        elIsLbOn.classList.add('chosen')
    }
    gLightbulbChosen = !gLightbulbChosen

}

function lightbulbIsOn(cellI, cellJ, mat) {
    var elBulb = document.querySelector(`.lightbulb-hint .chosen`)
    console.log(elBulb)
    elBulb.classList.add('isOn')
    revealLbHint(cellI, cellJ, mat)
    gHintOnInterval = setTimeout(function () {
        hideLbHint(cellI, cellJ, mat);
    }, 2500);

}

function revealLbHint(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (gBoard[i][j].isCovered === true) {
                //debugger
                var elCell = document.querySelector(`.cell[data-i="${i}"][data-j="${j}"]`)
                console.log(elCell)
                elCell.classList.remove('hidden')
            }

        }
    }

}
function hideLbHint(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (gBoard[i][j].isCovered === true) {
                var elCell = document.querySelector(`.cell[data-i="${i}"][data-j="${j}"]`)
                elCell.classList.add('hidden')
            }
        }
    }
    clearInterval(gHintOnInterval)
}
function revealAll() {

    var elAllCellsOnTable = document.querySelectorAll('.cell.hidden')
    console.log(elAllCellsOnTable)
    elAllCellsOnTable.forEach(function (el) {
        el.classList.remove('hidden');
    });
}

function timer() {

    gTimer = setInterval(function () {
        gTime += 0.01;
        document.querySelector('.time').textContent = gTime.toFixed(2)

    }, 10);
}
function tableInteraction(condition) {
    if (condition) {
        var ellboard = document.querySelector('.interactive')
        ellboard.classList.add('non-interactive')

    } else {
        var ellboard = document.querySelector('.interactive')
        ellboard.classList.remove('non-interactive')

    }
}
//TODO: Render cells for ascoreboard, currently replaces best score eachtime
// function storeScore() {
//     if (typeof (Storage) !== "undefined") {
//         // Store
//         var playerName = prompt('Enter your Name :')
//         localStorage.setItem("playername", playerName);
//         localStorage.setItem("score", gTime.toFixed(2));

//         // Retrieve
//         // document.getElementById("storage").innerHTML = localStorage.getItem("playername");
//         var elPlayerName = document.querySelector('.player-name')
//         elPlayerName.innerHTML += localStorage.getItem("playername");
//         var elPlayerName = document.querySelector('.player-score')
//         elPlayerName.innerHTML += localStorage.getItem("score");
//     } else {
//         document.getElementById("storage").innerHTML = "Sorry, your browser does not support Web Storage...";
//     }
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