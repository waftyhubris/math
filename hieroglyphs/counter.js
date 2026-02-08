let counter = 1;
let state = "horizontal";

// Declaring all the button actions.

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

document.getElementById("check-button-vertical").addEventListener("click", () => {
  const buttons = document.querySelectorAll("#sentence-vertical button");
  const flashcard = document.getElementById("vertical-flashcard-container");

  const text = Array.from(buttons)
    .map(b => b.textContent.trim())
    .join(" ");

  flashcard.classList.remove("correct", "incorrect");

  if (text.toLowerCase() === document.getElementById("correct-answer-vertical").textContent.toLowerCase()) {
    flashcard.style.backgroundColor = "#7fd877";
    document.getElementById("win-footer-vertical").classList.add("show");
  } else {
    flashcard.style.backgroundColor = "#ffa4a4";
    document.getElementById("lose-footer-vertical").classList.add("show");
  }

  buttons.forEach(button => {
    button.classList.add("inaccessible");
  });
});


const versentence = document.getElementById("sentence-vertical");
const verbuttons = document.querySelectorAll("#buttons-vertical .word");

verbuttons.forEach(button => {
    button.addEventListener("click", () => {
      const word = button.dataset.word;

      const newButton = document.createElement("button");
      newButton.className = "word";
      newButton.textContent = word;

      newButton.addEventListener("click", () => {
          newButton.remove();
          button.disabled = false;
      });

      versentence.appendChild(newButton);

      button.disabled = true;
  });
});

const horsentence = document.getElementById("sentence");
const horbuttons = document.querySelectorAll("#buttons .word");

horbuttons.forEach(button => {
    button.addEventListener("click", () => {
      const word = button.dataset.word;

      const newButton = document.createElement("button");
      newButton.className = "word";
      newButton.textContent = word;

      newButton.addEventListener("click", () => {
          newButton.remove();
          button.disabled = false;
      });

      horsentence.appendChild(newButton);

      button.disabled = true;
  });
});



// The custom sentence information for this particular lesson.

const buttonSets = {
    1: [
        { text: "I" },
        { text: "am" },
        { text: "her" },
        { text: "child", style: "boldBlue" },
        { text: "Egypt"},
        { text: "man" },
        { text: "god"},
        { text: "Ptah"}
    ],
    2: [
        { text: "he" },
        { text: "is" },
        { text: "the" },
        { text: "king"},
        { text: "of" },
        { text: "the" },
        { text: "gods"},
        { text: "desert" }
    ],
    3: [
        { text: "I" },
        { text: "am" },
        { text: "Horus"},
        { text: "desert" },
        { text: "child" },
        { text: "the" },
        { text: "of" },
        { text: "great"}
    ],
    4: [
        { text: "Isis"},
        { text: "is" },
        { text: "a" },
        { text: "great"},
        { text: "goddess"},
        { text: "god" },
        { text: "queen"},
        { text: "of" }
    ],
    5: [
        { text: "their" },
        { text: "brother" },
        { text: "is" },
        { text: "a" },
        { text: "scribe", style: "boldBlue" },
        { text: "king"},
        { text: "desert" },
        { text: "daughter"}
    ],
    6: [
        { text: "this" },
        { text: "is" },
        { text: "my" },
        { text: "eternal", style: "boldBlue" },
        { text: "tomb"},
        { text: "mother"},
        { text: "the" },
        { text: "of" }
    ]
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
    ],
    6: [
        "This is my eternal tomb"
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
    ],
    6: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/falcon.svg"
    ]
};

// Going to the next lesson.

document.getElementById("win-next").addEventListener("click", () => {
    counter++;
    if (counter >= 6) {
        state="vertical";
        const horizontal = document.getElementById("horizontal-layout");
        const vertical = document.getElementById("vertical-layout");
        horizontal.classList.add("hidden");
        vertical.classList.remove("hidden");
        vertical.classList.add("block");
        horizontal.classList.remove("block");
    }
    updatePage(state);
});

document.getElementById("lose-next").addEventListener("click", () => {
    counter++;
    if (counter >= 6) {
        state="vertical";
        const horizontal = document.getElementById("horizontal-layout");
        const vertical = document.getElementById("vertical-layout");
        horizontal.classList.add("hidden");
        vertical.classList.remove("hidden");
        vertical.classList.add("block");
        horizontal.classList.remove("block");
    }
    updatePage(state);
});


// Loading the next sentence.

function updatePage(varstate) {
    let img;
    if (varstate === "vertical") {
        document.getElementById("correct-answer-vertical").textContent = answerSet[counter];
        img = document.getElementById('flashcard-image-vertical');
    }
    else {
        document.getElementById("correct-answer").textContent = answerSet[counter];
        img = document.getElementById('flashcard-image');
    }
    img.src = `../../lessons/lesson1/sentences/sentence${counter}/lesson1_sentence${counter}.svg`;
    const foot = document.getElementById('win-footer');
    foot.classList.remove('show');
    const foot2 = document.getElementById('lose-footer');
    foot2.classList.remove('show');
    const flashcard = document.getElementById('flashcard');
    flashcard.style.backgroundColor = "white";
    renderButtons(varstate);
    randomizeAvatar(varstate);
}


// Randomising the avatar depending on the counter.

function randomizeAvatar(varstate) {
    let img;
    if (varstate === "vertical") {
        img = document.getElementById("randomImage-vertical");
    }
    else {
        img = document.getElementById("randomImage");
    }
    const currentAvatars = avatars[counter] || [];

    if (currentAvatars.length === 0) return;

    const randomIndex = Math.floor(Math.random() * currentAvatars.length);
    img.src = currentAvatars[randomIndex];
}


// Loading in the buttons at the bottom of the page.

function renderButtons(varstate) {
    let container;
    let sentence;
    if (varstate === "vertical") {
        container = document.getElementById("buttons-vertical");
        sentence  = document.getElementById("sentence-vertical");
    } else {
        container = document.getElementById("buttons");
        sentence  = document.getElementById("sentence");
    }
    
    container.innerHTML = "";
    sentence.innerHTML = "";

    const words = buttonSets[counter] || [];
    const buttons = [];

    // Create buttons
    words.forEach(word => {
        const button = document.createElement("button");
        button.className = "word";
        button.dataset.word = word.text;
        button.textContent = word.text;
        if (word.style === "boldBlue") {
            button.style.fontWeight = "bold";
            button.style.color = "#00a0d7ff";
        }

        // Add click behavior for sentence
        button.addEventListener("click", () => {
            const newButton = document.createElement("button");
            newButton.className = "word";
            newButton.textContent = word.text;
            if (word.style === "boldBlue") {
                newButton.style.fontWeight = "bold";
                newButton.style.color = "#00a0d7ff";
            }

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