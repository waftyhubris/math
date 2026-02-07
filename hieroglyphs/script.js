const sentence = document.getElementById("sentence");
const buttons = document.querySelectorAll("#buttons .word");

buttons.forEach(button => {
    button.addEventListener("click", () => {
      const word = button.dataset.word;

      const newButton = document.createElement("button");
      newButton.className = "word";
      newButton.textContent = word;

      // remove from sentence AND re-enable source button
      newButton.addEventListener("click", () => {
          newButton.remove();
          button.disabled = false;
      });

      sentence.appendChild(newButton);

      // disable source button
      button.disabled = true;
  });
});