let counter = 1;

document.getElementById("check-button").addEventListener("click", () => {
  const buttons = document.querySelectorAll("#sentence button");
  const flashcard = document.getElementById("flashcard");

  const text = Array.from(buttons)
    .map(b => b.textContent.trim())
    .join(" ");

  flashcard.classList.remove("correct", "incorrect");

  if (text.toLowerCase() === document.getElementById("correct-answer").textContent.toLowerCase()) {
    flashcard.style.backgroundColor = "#7fd877";
    document.getElementById("win-footer").classList.add("show");
  } else {
    flashcard.style.backgroundColor = "#ffa4a4";
    document.getElementById("lose-footer").classList.add("show");
  }

  buttons.forEach(button => {
    button.classList.add("inaccessible");
  });
});


const buttonSets = {
    1: [
        "I", "am", "her", "child", "Egypt", "man", "god", "Ptah"
    ],
    2: [
        "he", "is", "the", "king", "of", "the", "gods", "desert"
    ],
    3: [
        "I", "am", "Horus", "desert", "child", "the", "of", "great"
    ],
    4: [
        "Isis", "is", "a", "great", "goddess", "god", "queen", "of"
    ],
    5: [
        "their", "brother", "is", "a", "scribe", "king", "desert", "daughter"
    ],
};

const answerSet = {
    1: [
        "I am her child"
    ],
    2: [
        "He is the king of the gods"
    ],
    3: [
        "I am Horus"
    ],
    4: [
        "Isis is a great goddess"
    ],
    5: [
        "Their brother is a scribe"
    ]
};

const avatars = {
    1: [
        "../../speaking_avatars/man.svg"
    ],
    2: [
        "../../speaking_avatars/cobra.svg"
    ],
    3: [
        "../../speaking_avatars/falcon.svg"
    ],
    4: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg"
    ],
    5: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg"
    ]
};

document.getElementById("win-next").addEventListener("click", () => {
    counter++;
    if (counter >= 6) {
        // counter = 1;
        const horizontal = document.getElementById("horizontal-layout");
        horizontal.classList.add("hidden");
        const vertical = document.getElementById("vertical-layout");
        vertical.classList.add("block");
    }
    updatePage();
});

document.getElementById("lose-next").addEventListener("click", () => {
    counter++;
    if (counter >= 6) {
        // counter = 1;
        const page = document.getElementById("horizontal-layout");
        page.classList.add("hidden");
        const vertical = document.getElementById("vertical-layout");
        vertical.classList.add("block");
    }
    updatePage();
});

function updatePage() {
    document.getElementById("correct-answer").textContent = answerSet[counter];
    const img = document.getElementById('flashcard-image');
    img.src = `../../lessons/lesson1/sentences/sentence${counter}/lesson1_sentence${counter}.svg`;
    const foot = document.getElementById('win-footer');
    foot.classList.remove('show');
    const foot2 = document.getElementById('lose-footer');
    foot2.classList.remove('show');
    const flashcard = document.getElementById('flashcard');
    flashcard.style.backgroundColor = "white";
    renderButtons();
    randomizeAvatar();
    showCorrectAnswer(counter - 1);
}

function randomizeAvatar() {
    const img = document.getElementById("randomImage");
    const currentAvatars = avatars[counter] || [];

    if (currentAvatars.length === 0) return;

    const randomIndex = Math.floor(Math.random() * currentAvatars.length);
    img.src = currentAvatars[randomIndex];
}

function renderButtons() {
    const container = document.getElementById("buttons");
    container.innerHTML = ""; // remove old buttons

    const sentence = document.getElementById("sentence");
    sentence.innerHTML = ""; // clear old sentence buttons

    const words = buttonSets[counter] || [];
    const buttons = [];

    // Create buttons
    words.forEach(word => {
        const button = document.createElement("button");
        button.className = "word";
        button.dataset.word = word;
        button.textContent = word;

        // Add click behavior for sentence
        button.addEventListener("click", () => {
            const newButton = document.createElement("button");
            newButton.className = "word";
            newButton.textContent = word;

            newButton.addEventListener("click", () => {
                newButton.remove();
                button.disabled = false;
            });

            sentence.appendChild(newButton);
            button.disabled = true;
        });

        buttons.push(button);
    });

    // --- Randomize buttons using Fisher-Yates ---
    for (let i = buttons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }

    // Append buttons in new order
    buttons.forEach(btn => container.appendChild(btn));
}

updatePage();