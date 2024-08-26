import * as jsChessEngine from './node_modules/js-chess-engine/lib/js-chess-engine.mjs'
const game = new jsChessEngine.Game()
var whiteTurn = true
var aiLevel = 2

var pieceData = "https://assets-themes.chess.com/image/ejgfv/150/"
var chessroot = document.getElementById("chessboard")

var cellSize = 65

var board = [
    ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
    ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
    ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
]

for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 8; col++) {
        if (!board[row][col]) {
            continue
        }

        var piece = document.createElement("div")
        piece.classList.add("piece")
        piece.classList.add(String(row) + col)
        piece.classList.add(board[row][col])

        piece.id = `p${row}${col}`

        chessroot.appendChild(piece)
    }
}



function updateSelectBox(newPos = "", show = false) {
    var sbox = document.getElementById("select-box")

    if (newPos) {
        sbox.className = newPos
    }

    var pos = sbox.className

    if (show) {
        sbox.style.visibility = "visible"
    } else {
        sbox.style.visibility = "hidden"
    }

    sbox.style.top = `${parseInt(pos[0]) * cellSize}px`
    sbox.style.left = `${parseInt(pos[1]) * cellSize}px`
    console.log(show)
    // console.log(chessNot2Int(int2ChessNot(pos)))
}

/**
 * @param {HTMLElement} piece 
 */
function updatePiece(piece) { //Update position ONLY
    var pos = piece.id.slice(1)

    piece.style.top = `${parseInt(pos[0]) * cellSize}px`;
    piece.style.left = `${parseInt(pos[1]) * cellSize}px`;
}
/**
 * @param {Array<String>} moves
 */
function createHints(moves) {
    moves.forEach(function (move) {
        var hint = document.createElement("div")
        move = chessNot2Int(move) //Int notation

        hint.style.top = `${parseInt(move[0]) * cellSize}px`
        hint.style.left = `${parseInt(move[1]) * cellSize}px`
        if (document.getElementById(`p${move}`)) {
            hint.className = "hint-capture"
        } else {
            hint.className = "hint"
        }

        document.getElementById("hints").appendChild(hint)
    })
}

function updatePieces() { //Should be called ONLY ONCE
    document.querySelectorAll(".piece").forEach(element => {
        updatePiece(element)
        element.style.backgroundImage = `url(${pieceData + element.classList[2] + '.png'})`
        element.addEventListener("click", function (event) {
            if (!whiteTurn) {
                return
            }
            clearHints()
            var pos = this.id.slice(1);

            if (this.classList[2][0] == 'w') {
                createHints(game.moves(int2ChessNot(pos)))
            } else if (this.classList[2][0] == 'b'&&document.getElementById("select-box").style.visibility=="visible"){
                return
            }

            updateSelectBox(pos, true)
        })
    })
}

function clearHints() {
    document.getElementById("hints").innerHTML = ''
}

/**
 * @param {string} cel
 */
function int2ChessNot(cel) {
    var lets = "abcdefgh"
    return lets[parseInt(cel[1])] + String(8 - parseInt(cel[0]))
}

/**
 * @param {string} not
 */
function chessNot2Int(not) {
    not = not.toLowerCase()

    return `${8 - not[1]}${not.charCodeAt(0) - 97}`
}
/**
 * 
 * @param {HTMLElement} piece 
 * @param {{ moves: Array.<Array<String>>, captured: String }} infoJson
 */
function movePiece(infoJson) {
    console.log(infoJson)
    infoJson.moves.forEach(([pos1, pos2]) => {
        console.log(pos1, pos2)
        pos1 = chessNot2Int(pos1)
        pos2 = chessNot2Int(pos2)
        var targetPiece = document.getElementById(`p${pos2}`)
        var movingPiece = document.getElementById(`p${pos1}`)


        movingPiece.id = `p${pos2}`
        updatePiece(movingPiece)

        if (targetPiece) {
            targetPiece.remove()
        }
    })

    return new Promise((resolve) => {
        setTimeout(resolve, 200)
    })
}

function robotMove() {
    var aiM = game.aiMove(aiLevel)

    movePiece(aiM)

}

document.addEventListener("click", function (event) {
    if (!chessroot.contains(event.target)) {
        console.log("Cleared cus out of range")
        updateSelectBox()
        clearHints()
    }
})

chessroot.addEventListener("click", async function (event) {
    var selBox = document.getElementById("select-box")

    if (!whiteTurn) {
        return
    }

    console.log(selBox.style.visibility)

    const rect = this.getBoundingClientRect()

    var x = event.clientX - rect.left
    var y = event.clientY - rect.top

    x = Math.floor(x / cellSize)
    y = Math.floor(y / cellSize)

    var posInt = `${y}${x}`
    var selPiece = document.getElementById(`p${posInt}`)


    var posCN = int2ChessNot(posInt)                    //Move to
    var posCNOrigin = int2ChessNot(selBox.className)    //Move from

    //Move
    if (selBox.style.visibility=='hidden'){
        selBox.style.visibility = 'visible'
        return
    }
    

    

    var moved = game.move(posCNOrigin, posCN)

    if (!moved) {
        return
    }

    whiteTurn = false;

    selBox.style.visibility = 'hidden'
    clearHints()

    await movePiece(moved)
    // console.log(moved)

    robotMove()
    whiteTurn = true


})

updatePieces()
updateSelectBox()