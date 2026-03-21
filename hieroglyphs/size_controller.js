function chooseLayout() {
    if (window.innerWidth < 800) {
        flashcard = document.getElementById("flashcard");
        flashcard.classList.add("mobile");
    }
    if (window.innerWidth >= 800) {
        flashcard = document.getElementById("flashcard");
        flashcard.classList.remove("mobile");
    }
}