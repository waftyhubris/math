let counter = 1;
let state = "horizontal";

// Preloading images

const IMAGES = [
  "../../lessons/lesson1/sentences/sentence1/lesson1_sentence1.svg",
  "../../lessons/lesson1/sentences/sentence2/lesson1_sentence2.svg",
  "../../lessons/lesson1/sentences/sentence3/lesson1_sentence3.svg",
  "../../lessons/lesson1/sentences/sentence4/lesson1_sentence4.svg",
  "../../lessons/lesson1/sentences/sentence5/lesson1_sentence5.svg",
  "../../lessons/lesson1/sentences/sentence6/lesson1_sentence6.svg",
  "../../lessons/lesson1/sentences/sentence7/lesson1_sentence7.svg",
  "../../lessons/lesson1/sentences/sentence8/lesson1_sentence8.svg",
  "../../lessons/lesson1/sentences/sentence9/lesson1_sentence9.svg",
  "../../lessons/lesson1/sentences/sentence10/lesson1_sentence10.svg",
  "../../speaking_avatars/man.svg",
  "../../speaking_avatars/cobra.svg",
  "../../speaking_avatars/falcon.svg"
];

const imageCache = {};

async function preloadImages() {
  await Promise.all(
    IMAGES.map(async src => {
      const img = new Image();
      img.src = src;
      await img.decode();
      imageCache[src] = img;
    })
  );
}

// Effect of pressing keyboard buttons.

let typedBuffer = "";

document.addEventListener("keydown", async (e) => {
  const activeTag = document.activeElement.tagName;
  if (["INPUT", "TEXTAREA"].includes(activeTag)) return;

  // BACKSPACE
  if (e.key === "Backspace") {
    if (typedBuffer.length > 0) {
      typedBuffer = typedBuffer.slice(0, -1);
    } else {
      const sentence = document.getElementById("sentence");
      const buttons = sentence.querySelectorAll("button");
      if (buttons.length > 0) {
        const last = buttons[buttons.length - 1];
        if (!last.classList.contains("inaccessible")) {
            last.click();
        }
      }
    }
    e.preventDefault();
    return;
  }

  if (e.key === " ") {
    tryMatchWord();
    typedBuffer = "";
    e.preventDefault();
    return;
  }

    if (e.key === "Enter") {
        let matched = false;
        const nextButton = document.getElementById("win-next");
        if (!nextButton.classList.contains("hidden") && !nextButton.classList.contains("inaccessible")) {
            nextButton.click();
        }
        else {
            if (typedBuffer.length > 0) {
                matched = await tryMatchWord();
            }

            if (typedBuffer.length === 0 || matched) {
                const checkButton = document.getElementById("check-button");
                if (checkButton && !checkButton.classList.contains("hidden")) {
                    checkButton.click();
                }
            }
            typedBuffer = "";
        }

        e.preventDefault();
    }

  if (e.key === "Escape") {
    typedBuffer = "";
  }

  // Normal character typing
  if (e.key.length === 1) {
    typedBuffer += e.key;
  }
});

async function tryMatchWord() {
  if (!typedBuffer) return false;

  const container = document.getElementById("buttons");
  const buttons = container.querySelectorAll("button");

  for (const btn of buttons) {
    if (!btn.classList.contains("inaccessible") && !btn.disabled && btn.dataset.word.toLowerCase() === typedBuffer.toLowerCase()) {

      await new Promise(resolve => {
        btn.addEventListener("animationend", resolve, { once: true });
        btn.click();
      });
      return true;
    }
  }
  return false;
}


// Declaring all the button actions.

document.getElementById("check-button").addEventListener("click", async () => {
  const buttons = document.querySelectorAll("#sentence button");
  const flashcard = document.getElementById("flashcard");

  const text = Array.from(buttons)
    .map(b => b.textContent.trim())
    .join(" ");

  flashcard.classList.remove("correct", "incorrect");

  const correctAnswer = document.getElementById("correct-answer").textContent.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
  if (text.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim() === correctAnswer) {
    flashcard.style.backgroundColor = "rgb(162, 255, 153)";
    // document.getElementById("win-footer").classList.add("show");
    document.getElementById("check-button").classList.add("hidden");
    document.getElementById("win-next").classList.remove("hidden");
    flashcard.classList.remove("bounce");
    flashcard.classList.remove("shake");
    void flashcard.offsetWidth;
    flashcard.classList.add("bounce");

    buttons.forEach((button, index) => {
        button.style.backgroundColor = "#c1f8bc";
        button.classList.remove("pop")
        button.style.animationDelay = `${index * 0.02}s`;
        button.classList.add("bounce");
    });
    
  } else {
        flashcard.style.backgroundColor = "#ffbaba";
        // document.getElementById("lose-footer").classList.add("show");
        document.getElementById("check-button").classList.add("hidden");
        document.getElementById("win-next").classList.add("inaccessible");
        document.getElementById("win-next").classList.remove("hidden");
        flashcard.classList.remove("shake");
        flashcard.classList.remove("bounce");
        void flashcard.offsetWidth;
        flashcard.classList.add("shake");


        buttons.forEach((button, index) => {
            button.style.backgroundColor = "#fec8c8";
            button.classList.remove("pop");
            button.style.animationDelay = `${index * 0.02}s`;
            button.classList.add("shake");
        });

        await new Promise(resolve => setTimeout(resolve, 500));

        for (let i = buttons.length - 1; i >= 0; i--) {
            const button = buttons[i];
            await new Promise(resolve => setTimeout(resolve, 100));
            button.click();
        }

        await new Promise(resolve => setTimeout(resolve, 150));
        const container = document.getElementById("buttons");
        const unbuttons = container.querySelectorAll("button");
        const words = correctAnswer.trim().split(' ');

        for (const word of words) {
            for (const button of unbuttons) {
                if (
                    !button.disabled &&
                    button.textContent.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim() === word
                ) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    button.click();
                    break; // stop after first match
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        document.getElementById("win-next").classList.remove("inaccessible");
    }

    buttons.forEach(button => {
        button.classList.add("inaccessible");
    });

  const bottomButtons = document.querySelectorAll("#buttons button");
  bottomButtons.forEach(button => {
    button.classList.add("inaccessible");
  })
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


const multibuttons = document.querySelectorAll(".multichoice-option");
multibuttons.forEach(button => {
  button.addEventListener("click", () => {
    multibuttons.forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");
  });
});


document.getElementById("check-button-multi").addEventListener("click", function () {
  const selected = document.querySelector(".multichoice-option.selected");
  if (!selected) return;

  const correct = document.querySelector(".multichoice-option.correct");

  if (selected.classList.contains("correct")) {
    selected.classList.add("correctly-selected");
  } else {
    selected.classList.add("incorrectly-selected");
    correct.classList.add("correctly-selected");
  }
  document.getElementById("check-button-multi").classList.add("hidden");
  document.getElementById("next-multi").classList.remove("hidden");

  document.querySelectorAll(".multichoice-option").forEach(b => {
    b.disabled = true;
  });
});


// The custom sentence information for this particular lesson.

vocabulary = [
    'I', 'am', 'you', 'are', 'he', 'is', 'she', 'it', 'this', 'his', 'her', 'the', 'the', 'of', 'of', 'child', 'children', 'Egypt', 'man', 'god', 'gods', 'Ptah', 'king', 'desert', 'Horus', 'Ptah', 'Isis', 'Osiris', 'Set', 'Bastet', 'Thoth', 'great', 'queen', 'brother', 'daughter', 'scribe', 'eternity', 'tomb', 'evil', 'beautiful', 'plan', 'temple'
];

const buttonSets = {
    1: [
        { text: "I" },
        { text: "am" },
        { text: "her" },
        { text: "child", style: "boldBlue" }
    ],
    2: [
        { text: "he" },
        { text: "is" },
        { text: "the" },
        { text: "king"},
        { text: "of" },
        { text: "the" },
        { text: "gods"}
    ],
    3: [
        { text: "I" },
        { text: "am" },
        { text: "Horus"}
    ],
    4: [
        { text: "Isis"},
        { text: "is" },
        { text: "a" },
        { text: "great"},
        { text: "goddess"}
    ],
    5: [
        { text: "their" },
        { text: "brother" },
        { text: "is" },
        { text: "a" },
        { text: "scribe", style: "boldBlue" }
    ],
    6: [
        { text: "this" },
        { text: "is" },
        { text: "my" },
        { text: "eternity", style: "boldBlue" },
        { text: "tomb"},
        { text: "for" }
    ],
    7: [
        { text: "your" },
        { text: "brother" },
        { text: "is" },
        { text: "evil"}
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
        { text: "Isis"}
    ],
    10: [
        { text: "the" },
        { text: "king" },
        { text: "is" },
        { text: "in"},
        { text: "his"},
        { text: "boat", style: "boldBlue" }
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
    ]
};

const flashcardSet = {
    11: ["Click the symbol representing the sound",  "ḫ."],
    12: ["Click the symbols representing to the sounds",  "ḏd."],
    13: ["Click the logogram representing the word 'scribe'.",  ""],
    14: ["Click the determinative following the word for boat,",  "dpt."],
    15: ["Click the word which means 'plan'.",  ""],
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
        "../../speaking_avatars/owl.svg"
    ],
    5: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg",
        "../../speaking_avatars/owl.svg"
    ],
    6: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg",
        "../../speaking_avatars/owl.svg"
    ],
    7: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg",
        "../../speaking_avatars/owl.svg"
    ],
    8: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg",
        "../../speaking_avatars/owl.svg"
    ],
    9: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg",
        "../../speaking_avatars/owl.svg"
    ],
    10: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg",
        "../../speaking_avatars/owl.svg"
    ]
};

// Going to the next lesson.

document.getElementById("win-next").addEventListener("click", () => {
    counter++;
    state = updateState(counter);
    updatePage(state);
});

document.getElementById("lose-next").addEventListener("click", () => {
    counter++;
    state = updateState(counter);
    updatePage(state);
});

document.getElementById("win-next-vertical").addEventListener("click", () => {
    counter++;
    state = updateState(counter);
    updatePage(state);
});

document.getElementById("lose-next-vertical").addEventListener("click", () => {
    counter++;
    state = updateState(counter);
    updatePage(state);
});

document.getElementById("next-multi").addEventListener("click", () => {
    counter++;
    state = updateState(counter);
    updatePage(state);
});



// Updating the page state depending on the counter

function updateState(varcounter) {
    if (varcounter < 6) {
        return "horizontal";
    }
    if (6 <= varcounter && 10>= varcounter) {
        return "vertical";
    }
    if (varcounter >= 16) {
        counter =1;
        return "horizontal";
    }
    if (varcounter >= 11) {
        return "multichoice";
    }
}



// Loading the next sentence.

function updatePage(varstate) {

    // Change flashcards
    const horizontal = document.getElementById("horizontal-layout");
    const vertical = document.getElementById("vertical-layout");
    const multichoice = document.getElementById("multichoice-layout")
    if (varstate === "multichoice") {
        document.querySelectorAll(".multichoice-option").forEach(b => {
            b.disabled = false;
            b.classList.remove("correctly-selected");
            b.classList.remove("incorrectly-selected");
            b.classList.remove("selected");
        });
        document.getElementById("check-button-multi").classList.remove("hidden");
        document.getElementById("next-multi").classList.add("hidden");
        horizontal.classList.add("hidden");
        vertical.classList.add("hidden");
        multichoice.classList.remove("hidden");
        document.getElementById("multichoice-stem").textContent =flashcardSet[counter][0];
        document.getElementById("multichoice-variable").textContent =flashcardSet[counter][1];
        randomiseMultichoice();
    }
    else {
        let img;
        let flashcard;
        if (varstate === "vertical") {
            document.getElementById("correct-answer-vertical").textContent = answerSet[counter];
            img = document.getElementById('flashcard-image-vertical');
            img.src = `../../lessons/lesson1/sentences/sentence${counter}/lesson1_sentence${counter}.svg`;
            flashcard = document.getElementById('vertical-flashcard');
            horizontal.classList.add("hidden");
            vertical.classList.remove("hidden");
            multichoice.classList.add("hidden");
            const continer = document.getElementById("vertical-flashcard-container");
            continer.style.backgroundColor = "white";
            foot = document.getElementById('win-footer-vertical');
            foot2 = document.getElementById('lose-footer-vertical');
        }
        else {
            document.getElementById("correct-answer").textContent = answerSet[counter];
            img = document.getElementById('flashcard-image');
            img.src = `../../lessons/lesson1/sentences/sentence${counter}/lesson1_sentence${counter}.svg`;
            flashcard = document.getElementById('flashcard');
            document.getElementById("check-button").classList.remove("hidden");
            document.getElementById("win-next").classList.add("hidden");
            vertical.classList.add("hidden");
            horizontal.classList.remove("hidden");
            multichoice.classList.add("hidden");
            foot = document.getElementById('win-footer');
            foot2 = document.getElementById('lose-footer');
        }
        flashcard.style.backgroundColor = "white";
    }
    foot.classList.remove('show');
    foot2.classList.remove('show');
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

    if (currentAvatars.length === 0) {
        currentAvatars = [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg",
        "../../speaking_avatars/owl.svg"
    ];
    };

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
    fillWordsRandomly(words, vocabulary, 12);
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
            newButton.classList.add("pop");
            newButton.textContent = word.text;
            if (word.style === "boldBlue") {
                newButton.style.fontWeight = "bold";
                newButton.style.color = "#00a0d7ff";
            }

            newButton.addEventListener("click", () => {
                newButton.classList.add("pop-out");

                newButton.addEventListener("animationend", () => {
                    newButton.remove();
                    button.disabled = false;
                    button.classList.remove("pop-out");
                    button.classList.add("pop");
                }, { once: true });
            });

            sentence.appendChild(newButton);
            button.disabled = true;
            button.classList.add("pop-out");
        });

        buttons.push(button);
    });

    // --- Randomize buttons using Fisher-Yates ---
    for (let i = buttons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }
    buttons.forEach(btn => container.appendChild(btn));
}


// Randomly fill up list of buttons with vocabulary list.

function fillWordsRandomly(words, vocabulary, targetLength) {
  const existing = new Set(words.map(w => w.text));
  const available = vocabulary.filter(word => !existing.has(word));
  available.sort(() => Math.random() - 0.5);
  while (words.length < targetLength && available.length > 0) {
    const word = available.pop();
    words.push({ text: word });
  }
}


// Randomising the multiple choice options.

function randomiseMultichoice() {
  const containers = document.querySelectorAll(".multichoice-options");
  const buttons = Array.from(document.querySelectorAll(".multichoice-option"));
  buttons.forEach(b => b.classList.remove("correct"));

  buttons.forEach((button, index) => {
    const img = button.querySelector("img");
    img.src = `../../lessons/lesson1/multichoice/multichoice${counter}/multichoice${counter}_option${index + 1}.svg`;

    if (index === 0) button.classList.add("correct");
  });

  // Shuffle buttons
  for (let i = buttons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
  }
  containers[0].innerHTML = "";
  containers[1].innerHTML = "";

  containers[0].appendChild(buttons[0]);
  containers[0].appendChild(buttons[1]);
  containers[1].appendChild(buttons[2]);
  containers[1].appendChild(buttons[3]);
}



updatePage();