'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

function copyMat(mat) {
    var newMat = []
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = []
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j]
        }
    }
    return newMat
}


function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

// function getRandomColor() {

//     // Array of possible colors
//     const colors = ['red', 'blue', 'green', 'purple', 'orange'];
//     // Get a random index from the colors array
//     const randomIndex = Math.floor(Math.random() * colors.length);
//     colors.splice(randomIndex,1)
//     return colors[randomIndex];

// }
function getRandomColor(colors) {
    const randomIndex = Math.floor(Math.random() * colors.length);
    var color = colors.splice(randomIndex, 1)
    // return colors[randomIndex];
    return color[0]

}

function getRandomColorClass() {
    const colorClasses = ['red', 'green', 'blue', 'yellow', 'purple', 'pink', 'orange', 'cyan', 'white', 'brown'];
    const randomIndex = getRandomIntInclusive(0, colorClasses.length - 1);
    return colorClasses[randomIndex];
}


function playSound(name) {
    const sound = new Audio(`sounds/${name}.mp3`)
    sound.play()
}

function openModal(txt) {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove('hide')
    const elTxtModal = document.querySelector('.modal h2')
    elTxtModal.innerHTML = txt

}

function closeModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.add('hide')

}

function findEmptyPos() {

    var emptyPoss = [] //  [{i:0,j:0},{i:0,j:1}]
    
    for (var i = 0; i < gBoard.length; i++) {
        
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j]
            //debugger
            if (cell === FOOD ||
                cell === EMPTY) { // cell === ''
                // console.log('cell:', cell)
                var pos = { i, j } // { i: i, j: j }
                emptyPoss.push(pos)
            }
        }
    }
    // console.log('emptyPoss:', emptyPoss)
    const randIdx = getRandomInt(0, emptyPoss.length)
    // console.log('randIdx:', randIdx)
    var randPos = emptyPoss[randIdx]
    // console.log('randPos:', randPos)

    return randPos
}

function countNegs(cellI, cellJ, mat) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE) negsCount++
        }
    }
    return negsCount
}

function findEmptyPos(board) {

	var emptyPoss = [] //  [{i:0,j:0},{i:0,j:1}]

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board.length; j++) {
			var cell = board[i][j]
			//debugger
			if (cell.isMine !== true) { // cell === ''
				// console.log('cell:', cell)
				var pos = { i, j } // { i: i, j: j }
				emptyPoss.push(pos)
			}
		}
	}
	// console.log('emptyPoss:', emptyPoss)
	const randIdx = getRandomInt(0, emptyPoss.length)
	// console.log('randIdx:', randIdx)
	var randPos = emptyPoss[randIdx]
	// console.log('randPos:', randPos)
	return randPos
}