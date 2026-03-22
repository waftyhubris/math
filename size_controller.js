main = document.getElementById("main");

function chooseLayout() {
    if (window.innerWidth < 800) {
        main.classList.add("mobile");
    }
    if (window.innerWidth >= 800) {
        main.classList.remove("mobile");
    }
}