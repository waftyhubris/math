document.getElementById("check-button").addEventListener("click", () => {
  const buttons = document.querySelectorAll("#sentence button");
  const flashcard = document.getElementById("flashcard");

  const text = Array.from(buttons)
    .map(b => b.textContent.trim())
    .join(" ");

  flashcard.classList.remove("correct", "incorrect");

  if (text === "I am a child") {
    flashcard.style.backgroundColor = "#7fd877";
    document.getElementById("win-footer").classList.add("show");
  } else {
    flashcard.style.backgroundColor = "#ffa4a4";
    document.getElementById("lose-footer").classList.add("show");
  }

  buttons.forEach(button => {
    button.classList.add("inaccessible"); // replace "new-class" with your class name
  });
});