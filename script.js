var chessroot = document.getElementById("chessboard")

for (let row = 0; row < 8; row++) {
    var nr = document.createElement("div")
    nr.id = "row" + row
    nr.classList.add("chessrow")
    chessroot.appendChild(nr)

    

    if (row % 2) {
        nr.classList.add("black")
    } else {
        nr.classList.add("white")
    }

    nr.style.breakBefore

    for (let col = 0; col < 8; col++) {
        var nc = document.createElement("div");
        nc.id = String(row) + col

        nc.classList.add("cell")

        if ((row + col) % 2) {
            nc.classList.add("black")
        } else {
            nc.classList.add("white")
        }

        nr.appendChild(nc)
    }
}


