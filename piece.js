import * as jsChessEngine from './node_modules/js-chess-engine/lib/js-chess-engine.mjs'
const game = new jsChessEngine.Game()
var whiteTurn = true


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
function updateSelectBox(newPos = "", show=false) {
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
}

/**
 * @param {HTMLElement} element 
 */
function updatePiece(element) { //Update position ONLY
    var pos = element.id.slice(1)

    element.style.top = `${parseInt(pos[0]) * cellSize}px`;
    element.style.left = `${parseInt(pos[1]) * cellSize}px`;
}

function updatePieces() { //Should be called ONLY ONCE
    document.querySelectorAll(".piece").forEach(element => {
        updatePiece(element)
        element.style.backgroundImage = `url(${pieceData + element.classList[2] + '.png'})`
        element.addEventListener("click", function (event){
            if (!whiteTurn){
                return
            }

            var targetPiece = event.target;
            var pos = targetPiece.id.slice(1);

            updateSelectBox(pos, true)
        })
    })
}
/**
 * @param {Number} cel
 */
function int2ChessNot(cel){
    
}

document.addEventListener("click", function (event){
    if (!chessroot.contains(event.target)){
        updateSelectBox()
    }
})

updatePieces()
updateSelectBox()