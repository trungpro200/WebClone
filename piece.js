import * as jsChessEngine from './node_modules/js-chess-engine/lib/js-chess-engine.mjs'
const game = new jsChessEngine.Game()
var selecting = true
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
function updateSelectBox(){
    var sbox = document.getElementById("select-box")
    var pos = sbox.className

    if (selecting){
        sbox.style.visibility = "visible"
    } else {
        sbox.style.visibility = "hidden"
    }

    sbox.style.top = `${parseInt(pos[0])*cellSize}px`
    sbox.style.left = `${parseInt(pos[1])*cellSize}px`
}
function updatePiece() {
    document.querySelectorAll(".piece").forEach(element => {
        var classL = element.classList
        var pos = classL[1]
        var type = classL[2]

        element.style.top = `${parseInt(pos[0])*cellSize}px`;
        element.style.left = `${parseInt(pos[1])*cellSize}px`;

        element.style.backgroundImage=`url(${pieceData+type+'.png'})`
    })
}

updatePiece()
updateSelectBox()