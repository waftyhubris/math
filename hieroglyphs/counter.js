let counter = 1;
let state = "horizontal";

// Preloading images

const IMAGES = [
  "../../lessons/lesson1/sentences/sentence1/lesson1_sentence1.png",
  "../../lessons/lesson1/sentences/sentence2/lesson1_sentence2.png",
  "../../lessons/lesson1/sentences/sentence3/lesson1_sentence3.png",
  "../../lessons/lesson1/sentences/sentence4/lesson1_sentence4.png",
  "../../lessons/lesson1/sentences/sentence5/lesson1_sentence5.png",
  "../../lessons/lesson1/sentences/sentence6/lesson1_sentence6.png",
  "../../lessons/lesson1/sentences/sentence7/lesson1_sentence7.png",
  "../../lessons/lesson1/sentences/sentence8/lesson1_sentence8.png",
  "../../lessons/lesson1/sentences/sentence9/lesson1_sentence9.png",
  "../../lessons/lesson1/sentences/sentence10/lesson1_sentence10.png",
  "../../speaking_avatars/man.png",
  "../../speaking_avatars/cobra.png",
  "../../speaking_avatars/falcon.png"
];

const imageCache = {};

function preloadImages() {
  IMAGES.forEach(src => {
    const img = new Image();
    img.src = src;
    imageCache[src] = img;
  });
}

// Declaring all the button actions.

document.getElementById("check-button").addEventListener("click", () => {
  const buttons = document.querySelectorAll("#sentence button");
  const flashcard = document.getElementById("flashcard");

  const text = Array.from(buttons)
    .map(b => b.textContent.trim())
    .join(" ");

  flashcard.classList.remove("correct", "incorrect");

  if (text.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim() === document.getElementById("correct-answer").textContent.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim()) {
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
  const flashcard = document.getElementById("vertical-flashcard");
  const continer = document.getElementById("vertical-flashcard-container");

  const text = Array.from(buttons)
    .map(b => b.textContent.trim())
    .join(" ");

  flashcard.classList.remove("correct", "incorrect");

  if (text.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim() === document.getElementById("correct-answer-vertical").textContent.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim()) {
    flashcard.style.backgroundColor = "#7fd877";
    continer.style.backgroundColor = "#7fd877";
    document.getElementById("win-footer-vertical").classList.add("show");
  } else {
    flashcard.style.backgroundColor = "#ffa4a4";
    continer.style.backgroundColor = "#ffa4a4";
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
        { text: "eternity", style: "boldBlue" },
        { text: "tomb"},
        { text: "mother"},
        { text: "the" },
        { text: "for" }
    ],
    7: [
        { text: "your" },
        { text: "brother" },
        { text: "is" },
        { text: "evil"},
        { text: "great"},
        { text: "a"},
        { text: "scribe" },
        { text: "of" }
    ],
    8: [
        { text: "how" },
        { text: "great" },
        { text: "are" },
        { text: "the"},
        { text: "plans"},
        { text: "of"},
        { text: "the" },
        { text: "gods" }
    ],
    9: [
        { text: "how" },
        { text: "beautiful" },
        { text: "is" },
        { text: "Isis"},
        { text: "Thoth"},
        { text: "of"},
        { text: "the" },
        { text: "daughter" }
    ],
    10: [
        { text: "the" },
        { text: "king" },
        { text: "is" },
        { text: "in"},
        { text: "his"},
        { text: "boat", style: "boldBlue" },
        { text: "temple" },
        { text: "god" }
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
    ],
    6: [
        "This is my tomb for eternity"
    ],
    7: [
        "Your brother is evil"
    ],
    8: [
        "How great are the plans of the gods!"
    ],
    9: [
        "How beautiful is Isis!"
    ],
    10: [
        "The king is in his boat"
    ],
};

const avatars = {
    1: [
        "../../speaking_avatars/man.png"
    ],
    2: [
        "../../speaking_avatars/cobra.png"
    ],
    3: [
        "../../speaking_avatars/falcon.png"
    ],
    4: [
        "../../speaking_avatars/man.png",
        "../../speaking_avatars/cobra.png",
        "../../speaking_avatars/falcon.png"
    ],
    5: [
        "../../speaking_avatars/man.png",
        "../../speaking_avatars/cobra.png",
        "../../speaking_avatars/falcon.png"
    ],
    6: [
        "../../speaking_avatars/man.png",
        "../../speaking_avatars/cobra.png",
        "../../speaking_avatars/falcon.png"
    ],
    7: [
        "../../speaking_avatars/man.png",
        "../../speaking_avatars/cobra.png",
        "../../speaking_avatars/falcon.png"
    ],
    8: [
        "../../speaking_avatars/man.png",
        "../../speaking_avatars/cobra.png",
        "../../speaking_avatars/falcon.png"
    ],
    9: [
        "../../speaking_avatars/man.png",
        "../../speaking_avatars/cobra.png",
        "../../speaking_avatars/falcon.png"
    ],
    10: [
        "../../speaking_avatars/man.png",
        "../../speaking_avatars/cobra.png",
        "../../speaking_avatars/falcon.png"
    ],
};

// Going to the next lesson.

document.getElementById("win-next").addEventListener("click", () => {
    counter++;
    if (counter >= 11) {
        counter =1;
        state="horizontal";
    }
    if (counter >= 6) {
        state="vertical";
    }
    updatePage(state);
});

document.getElementById("lose-next").addEventListener("click", () => {
    counter++;
    if (counter >= 11) {
        counter =1;
        state="horizontal";
    }
    if (counter >= 6) {
        state="vertical";
    }
    updatePage(state);
});

document.getElementById("win-next-vertical").addEventListener("click", () => {
    counter++;
    if (counter >= 11) {
        counter =1;
        state="horizontal";
    }
    if (counter >= 6) {
        state="vertical";
    }
    updatePage(state);
});

document.getElementById("lose-next-vertical").addEventListener("click", () => {
    counter++;
    if (counter >= 11) {
        counter =1;
        state="horizontal";
    }
    if (counter >= 6) {
        state="vertical";
    }
    updatePage(state);
});


// Loading the next sentence.

function updatePage(varstate) {

    // Change flashcards

    let img;
    let foot;
    let foot2;
    let flashcard;
    if (varstate === "vertical") {
        document.getElementById("correct-answer-vertical").textContent = answerSet[counter];
        img = document.getElementById('flashcard-image-vertical');
        flashcard = document.getElementById('vertical-flashcard');
        const horizontal = document.getElementById("horizontal-layout");
        const vertical = document.getElementById("vertical-layout");
        horizontal.classList.add("hidden");
        vertical.classList.remove("hidden");
        vertical.classList.add("block");
        horizontal.classList.remove("block");
        const continer = document.getElementById("vertical-flashcard-container");
        continer.style.backgroundColor = "white";
        foot = document.getElementById('win-footer-vertical');
        foot2 = document.getElementById('lose-footer-vertical');
    }
    else {
        document.getElementById("correct-answer").textContent = answerSet[counter];
        img = document.getElementById('flashcard-image');
        flashcard = document.getElementById('flashcard');
        const horizontal = document.getElementById("horizontal-layout");
        const vertical = document.getElementById("vertical-layout");
        vertical.classList.add("hidden");
        horizontal.classList.remove("hidden");
        horizontal.classList.add("block");
        vertical.classList.remove("block");
        foot = document.getElementById('win-footer');
        foot2 = document.getElementById('lose-footer');
    }
    foot.classList.remove('show');
    foot2.classList.remove('show');
    img.src = `../../lessons/lesson1/sentences/sentence${counter}/lesson1_sentence${counter}.png`;
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