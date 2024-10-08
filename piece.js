import * as jsChessEngine from './node_modules/js-chess-engine/lib/js-chess-engine.mjs'
var game = new jsChessEngine.Game()
var whiteTurn = true
var aiLevel = 1

var pieceData = "https://assets-themes.chess.com/image/ejgfv/150/"
var chessroot = document.getElementById("chessboard")

var cellSize = 65

var moveSound = new Audio("Sounds/move-self.mp3")
var captSound = new Audio("Sounds/capture.mp3")
var checkSound = new Audio("Sounds/move-check.mp3")
var castSound = new Audio("Sounds/castle.mp3")

function checkCase(char) {
    if (/[A-Z]/.test(char)) {
        return 'w';
    } else if (/[a-z]/.test(char)) {
        return 'b';
    }
}
function createPiece(){
    for (var [pos, piece] of Object.entries(game.board.configuration.pieces)) {
        piece = `${checkCase(piece)}${piece.toLowerCase()}`
        pos = chessNot2Int(pos)

        var p = document.createElement("div")
        p.id = `p${pos}`

        p.classList.add("piece")
        p.classList.add(pos)
        p.classList.add(piece)

        chessroot.appendChild(p)
    }
}
createPiece()

function updateSelectBox(newPos = "", show = false) {
    var sbox = document.getElementById("select-box")

    if (newPos) {
        sbox.className = newPos
    } else {
        sbox.style.visibility = "hidden"
        return
    }

    var pos = sbox.className

    // if (show) {
    //     sbox.style.visibility = "visible"
    // } else {
    //     sbox.style.visibility = "hidden"
    // }

    sbox.style.top = `${parseInt(pos[0]) * cellSize}px`
    sbox.style.left = `${parseInt(pos[1]) * cellSize}px`
    // console.log(show)
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
            } else if (this.classList[2][0] == 'b' && document.getElementById("select-box").style.visibility == "visible") {
                return
            }

            updateSelectBox(pos, true)
        })
    })
}

function clearHints() {
    document.querySelectorAll(".hint, .hint-capture").forEach((element) => {
        element.remove();
    })
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
    // console.log(infoJson)
    var played = false

    if (game.board.hasPlayingPlayerCheck() || game.board.hasNonPlayingPlayerCheck()) {
        played = true;
        checkSound.play();
    }

    infoJson.moves.forEach(([pos1, pos2]) => {
        // console.log(pos1, pos2)
        pos1 = chessNot2Int(pos1)
        pos2 = chessNot2Int(pos2)

        var targetPiece = document.getElementById(`p${pos2}`)
        var movingPiece = document.getElementById(`p${pos1}`)

        movingPiece.id = `p${pos2}`
        updatePiece(movingPiece)

        if (targetPiece) {
            capturePiece(targetPiece, !played)
            played = true
        }
    })
    infoJson.captured.forEach((p) => {
        var tg = document.getElementById(`p${chessNot2Int(p)}`)
        capturePiece(tg)
        played = true
    })
    if (!played) {
        moveSound.play()
    }

    updateLastmoveHint(infoJson.moves[0])


    return new Promise((resolve) => {
        setTimeout(resolve, 200)
    })
}

/**
 * 
 * @param {HTMLElement} piece 
 */
function capturePiece(piece, s = false) {
    if (s) {
        captSound.play()
    }
    piece.remove()
}

function robotMove() {
    if (game.board.configuration.checkMate||whiteTurn){
        console.log(whiteTurn)
        return
    }
    var aiM = game.aiMove(aiLevel)

    movePiece(aiM)
    whiteTurn = true
}

/**
 * @param {String} pos 
 */
function createHighlight(pos) {
    pos = chessNot2Int(pos)

    var hl = document.createElement("div")
    hl.className = "lastMove"

    hl.style.top = `${parseInt(pos[0]) * cellSize}px`
    hl.style.left = `${parseInt(pos[1]) * cellSize}px`

    document.getElementById("hints").appendChild(hl)
}

function removeHighlights() {
    document.querySelectorAll(".lastMove").forEach((element) => {
        element.remove();
    })
}

function removePieces(){
    document.querySelectorAll(".piece").forEach(p=>{
        p.remove()
    })
}


/**
 * @param {String[]} move 
 */
function updateLastmoveHint(move) {
    removeHighlights()

    move.forEach((pos) => {
        createHighlight(pos)
    })
}

document.addEventListener("click", function (event) {
    if (!chessroot.contains(event.target)) {
        // console.log("Cleared cus out of range")
        updateSelectBox()
        clearHints()
    }
})

document.getElementById("restart").addEventListener("click", e=>{
    whiteTurn=true
    removePieces()
    removeHighlights()
    clearHints()

    game = new jsChessEngine.Game()
    createPiece()
    updatePieces()
})

async function onClickBoard(event) {
    

    var selBox = document.getElementById("select-box")

    if (!whiteTurn) {
        return
    }

    // console.log("clicked")

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
    if (selBox.style.visibility == "hidden" && document.getElementById(`p${posInt}`)) {
        selBox.style.visibility = "visible"
        // console.log("coming to life?")
        return
    } else { //being show
        // console.log("trying to move")
        try {
            if (selPiece.classList.item(2)) {
                if (selPiece.classList.item(2)[0] == "w") {
                    updateSelectBox(posInt, true)
                    return;
                }
            }
        } catch (error) {

        }

        var moved = game.move(posCNOrigin, posCN)

        if (!moved) {
            selBox.style.visibility = 'hidden'
            clearHints()
            return
        }

        whiteTurn = false;

        selBox.style.visibility = 'hidden'
        clearHints()

        await movePiece(moved)
        // console.log(moved)

        setTimeout(robotMove, 750)

        

        console.log(game.board.configuration)

        if (game.board.configuration.checkMate) {
            console.log("mated")
            removeHighlights()
            updateSelectBox()
            this.removeEventListener("click", onClickBoard)
        }
    }
}

chessroot.addEventListener("click", onClickBoard)

updatePieces()
updateSelectBox()