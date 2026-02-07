document.getElementById("check-button").addEventListener("click", () => {
  const buttons = document.querySelectorAll("#sentence button");
  const flashcard = document.getElementById("flashcard");

  const text = Array.from(buttons)
    .map(b => b.textContent.trim())
    .join(" ");

  flashcard.classList.remove("correct", "incorrect");

  if (text === "I am a child") {
    flashcard.style.backgroundColor = "#63c85a";
  } else {
    flashcard.style.backgroundColor = "#fb7676";
  }
});