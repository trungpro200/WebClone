var str = "abcdefgh"

for (var row = 0; row <8; row++){
    var cr = document.getElementById("row"+row)
    var cell = document.getElementById(row+70)
    var num = document.createElement("div")
    var char = document.createElement("div")

    char.innerHTML = str[row]

    num.classList.add("numLabel")

    if (row%2) {
        num.classList.add("black")
        char.classList.add("black")
    } else {
        num.classList.add("white")
        char.classList.add("white")
    }
 
    num.innerHTML = row;
    cr.appendChild(num);
    cell
}