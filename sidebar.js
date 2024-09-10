function openNav() {
    document.querySelector(".sidebar").classList.add("active");
    document.querySelector("#main").classList.add("shifted");
    document.querySelector("#navbtn").setAttribute("onclick", "closeNav()")
}

function closeNav() {
    document.querySelector(".sidebar").classList.remove("active");
    document.querySelector("#main").classList.remove("shifted");
    document.querySelector("#navbtn").setAttribute("onclick", "openNav()")
}