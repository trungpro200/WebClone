function openNav() {
    document.querySelector(".sidebar").classList.add("active");
    document.querySelector("#main").classList.add("shifted");
}

function closeNav() {
    document.querySelector(".sidebar").classList.remove("active");
    document.querySelector("#main").classList.remove("shifted");
}