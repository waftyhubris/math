let counter = 1;
let state = "horizontal";
const lessonInformation = {};

// Effect of clicking anywhere.

document.addEventListener("click", (event) => {
    if (!event.target.classList.contains("speech")) {
        removeGloss();
    }
});

// Effect of pressing keyboard buttons.

let typedBuffer = "";

document.addEventListener("keydown", async (e) => {
    removeGloss();
  const activeTag = document.activeElement.tagName;
  if (["INPUT", "TEXTAREA"].includes(activeTag)) return;

  if (e.key === "Backspace") {
    if (typedBuffer.length > 0) {
      typedBuffer = typedBuffer.slice(0, -1);
    } else {
        let sentence;
        let buttons;
        if (state === "vertical") {
            sentence = document.getElementById("sentence-vertical");
        }
        else {
            sentence = document.getElementById("sentence");
        }
        buttons = sentence.querySelectorAll("button");
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
        if (state === "multichoice") {
            const checkButton = document.getElementById("check-button-multi");
            if (!checkButton.classList.contains("hidden") && !checkButton.classList.contains("inaccessible")) {
                checkButton.click();
            }
            else {
                const nextButton = document.getElementById("next-multi");
                if (!nextButton.classList.contains("hidden") && !nextButton.classList.contains("inaccessible")) {
                    nextButton.click();
                }
            }
        }
        else {
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
    removeGloss();
    let buttons;
    let flashcard;
    if (state === "vertical") {
        flashcard = document.getElementById("vertical-flashcard");
        buttons = document.querySelectorAll("#sentence-vertical button");
    }
    else {
        flashcard = document.getElementById("flashcard");
        buttons = document.querySelectorAll("#sentence button");
    }
    buttons.forEach(button => {
        button.classList.add("inaccessible");
    });
    const bottomButtons = document.querySelectorAll("#buttons button");
    bottomButtons.forEach(button => {
        button.classList.add("inaccessible");
    })

  const text = Array.from(buttons)
    .map(b => b.textContent.trim())
    .join(" ");

  flashcard.classList.remove("correct", "incorrect");

  const correctAnswer = lessonInformation[counter].answer.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim();
  if (text.toLowerCase().replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ").trim() === correctAnswer) {
    flashcard.style.backgroundColor = "rgb(162, 255, 153)";
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
        flashcard.style.backgroundColor = "#ffc9aa";
        document.getElementById("check-button").classList.add("hidden");
        document.getElementById("win-next").classList.add("inaccessible");
        document.getElementById("win-next").classList.remove("hidden");
        flashcard.classList.remove("shake");
        flashcard.classList.remove("bounce");
        void flashcard.offsetWidth;
        flashcard.classList.add("shake");


        buttons.forEach((button, index) => {
            button.style.backgroundColor = "#ffdbc6";
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
                    const newSentenceButtons = document.querySelectorAll("#sentence button");
                    newSentenceButtons[newSentenceButtons.length - 1].classList.add("inaccessible");
                    break; // stop after first match
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        document.getElementById("win-next").classList.remove("inaccessible");
    }
});


const multibuttons = document.querySelectorAll(".multichoice-option");
multibuttons.forEach(button => {
  button.addEventListener("click", () => {
    multibuttons.forEach(b => {
        b.classList.remove("selected");
        b.style.backgroundColor = "white";
    });
    button.classList.add("selected");
    button.style.backgroundColor = "rgb(193, 238, 255)";
  });
});


document.getElementById("check-button-multi").addEventListener("click", function () {
  const selected = document.querySelector(".multichoice-option.selected");
  if (!selected) return;

  const correct = document.querySelector(".multichoice-option.correct");

    if (selected.classList.contains("correct")) {
        selected.style.backgroundColor = "rgb(162, 255, 153)";
        selected.classList.add("bounce");
    } else {
        selected.style.backgroundColor = "#ffdbc6";
        selected.classList.add("shake");
        correct.style.backgroundColor = "rgb(162, 255, 153)";
  }
  document.getElementById("check-button-multi").classList.add("hidden");
  document.getElementById("next-multi").classList.remove("hidden");

  document.querySelectorAll(".multichoice-option").forEach(b => {
    b.disabled = true;
  });
});


// The custom sentence information for this particular lesson. The formatting resembles the following:

// lessonInformation = {
//     1: {
//         state: "horizontal",
//         words: [
//             {pronunciation: "jnk", translation: "I"},
//             {pronunciation: "ẖrd", translation: "child"},
//             {pronunciation: "=s", translation: "her"}
//         ],
//         mandatoryButtons: [
//             { text: "I" },
//             { text: "am" },
//             { text: "her" },
//             { text: "child", style: "boldBlue" }
//         ]
//     },

//     6: {
//         state: "vertical",
//         words: [
//             {pronunciation: "jz", translation: "tomb"},
//             {pronunciation: "=j", translation: "my"},
//             {pronunciation: "ḏ.t", translation: "eternity"},
//             {pronunciation: "pw", translation: "enclitic particle"},
//         ],
//         mandatoryButtons: [
//             { text: "this" },
//             { text: "is" },
//             { text: "my" },
//             { text: "eternity", style: "boldBlue" },
//             { text: "tomb"},
//             { text: "for" }
//         ]
//     },

//     11: {
//         state: "multichoice",
//         question: "Click the symbol representing the sound",
//         transliteration: "ḫ"
//     }
// }

// Load all 15 files first
async function loadAllLessons() {
    const promises = [];

    for (let i = 1; i <= 15; i++) {
        const path = `../../lessons/lesson1/questions/question${i}/lesson1_question${i}.txt`;
        promises.push(loadIntoLessonInformation(path, i));
    }

    await Promise.all(promises);

    console.log("All lessons loaded.");
    console.log(lessonInformation);
}

async function loadIntoLessonInformation(url, counter) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url} (${response.status})`);
    }

    const text = await response.text();
    const lines = text.split(/\r?\n/);

    const entry = {};

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const colonIndex = trimmed.indexOf(":");
        if (colonIndex === -1) continue;

        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 1).trim();

        if (key === "state") {
            entry.state = value;
        }

        else if (key === "words") {
            entry.words = value.split(";").map(pair => {
                const [pronunciation, translation] = pair.split(",");
                return {
                    pronunciation: pronunciation.trim(),
                    translation: translation.trim()
                };
            });
        }

        else if (key === "mandatoryButtons") {
            entry.mandatoryButtons = value.split(";").map(item => {
                const parts = item.split(",");
                const obj = { text: parts[0].trim() };
                if (parts[1]) obj.style = parts[1].trim();
                return obj;
            });
        }

        else if (key === "answer") {
            entry.answer = value;
        }

        else if (key === "question") {
            entry.question = value;
        }

        else if (key === "transliteration") {
            entry.transliteration = value;
        }
    }

    lessonInformation[counter] = entry;
}

vocabulary = [
    'I', 'am', 'you', 'are', 'he', 'is', 'she', 'it', 'this', 'his', 'her', 'the', 'the', 'of', 'of', 'child', 'children', 'Egypt', 'man', 'god', 'gods', 'Ptah', 'king', 'desert', 'Horus', 'Ptah', 'Isis', 'Osiris', 'Set', 'Bastet', 'Thoth', 'great', 'queen', 'brother', 'daughter', 'scribe', 'eternity', 'tomb', 'evil', 'beautiful', 'plan', 'temple'
];

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
    state = lessonInformation[counter].state;
    updatePage(state);
});

document.getElementById("next-multi").addEventListener("click", () => {
    counter++;
    state = lessonInformation[counter].state;
    updatePage(state);
});


// Loading the next sentence.

function updatePage(varstate) {
    removeSpeech();

    // Change flashcards
    const horizontal = document.getElementById("horizontal-layout");
    const vertical = document.getElementById("vertical-layout");
    const multichoice = document.getElementById("multichoice-layout")
    if (varstate === "multichoice") {
        document.getElementById("translation-footer").classList.add("hidden");
        document.querySelectorAll(".multichoice-option").forEach(b => {
            b.disabled = false;
            b.style.backgroundColor = "white";
            b.classList.remove("selected");
            b.classList.remove("shake");
            b.classList.remove("bounce");
        });
        document.getElementById("check-button-multi").classList.remove("hidden");
        document.getElementById("next-multi").classList.add("hidden");
        horizontal.classList.add("hidden");
        vertical.classList.add("hidden");
        multichoice.classList.remove("hidden");
        document.getElementById("multichoice-stem").textContent = lessonInformation[counter].question;
        document.getElementById("multichoice-variable").textContent = lessonInformation[counter].transliteration;
        randomiseMultichoice();
    }
    else {
        document.getElementById("translation-footer").classList.remove("hidden");
        let flashcard;
        if (varstate === "vertical") {
            flashcard = document.getElementById('vertical-flashcard');
            egyptianSentence = document.getElementById('vertical-flashcard-sentence');
            horizontal.classList.add("hidden");
            vertical.classList.remove("hidden");
            multichoice.classList.add("hidden");
        }
        else {
            flashcard = document.getElementById('flashcard');
            egyptianSentence = document.getElementById('flashcard-sentence');
            vertical.classList.add("hidden");
            horizontal.classList.remove("hidden");
            multichoice.classList.add("hidden");
        }
        document.getElementById("check-button").classList.remove("hidden");
        document.getElementById("win-next").classList.add("hidden");

        flashcard.style.backgroundColor = "white";
        let index = 1;

        function tryLoadNext() {
            const div = Object.assign(document.createElement("div"), {className: "word-gloss", id: `word-index${index}`});
            const subdiv = Object.assign(document.createElement("div"), {className: "gloss", id: `word-index${index}`});
            const pronunciation = document.createElement("i");
            pronunciation.textContent = lessonInformation[counter].words[index-1].pronunciation;
            // egyptianWords[counter][index-1].pronunciation;
            const translation = document.createTextNode(lessonInformation[counter].words[index-1].translation);
            // const translation = document.createTextNode(egyptianWords[counter][index-1].translation);
            subdiv.append(pronunciation, ": ", translation);
            const img = new Image();
            img.src = `../../lessons/lesson1/questions/question${counter}/lesson1_question${counter}_word${index}.svg`;
            img.classList.add("speech");
            img.addEventListener("click", () => {
                if (subdiv.classList.contains("show")) {
                    removeGloss();
                }
                else {
                    removeGloss();
                    subdiv.classList.toggle("show");
                }
            });
            div.appendChild(img);
            div.appendChild(subdiv);
            img.onload = () => {
                egyptianSentence.appendChild(div);
                index++;
                tryLoadNext();
            };
            img.onerror = () => {
            };
        }

        tryLoadNext();
    }
    renderButtons(varstate);
    randomizeAvatar(varstate);
}


// Remove gloss, which should happen whenever most buttons are pressed.

function removeGloss() {
    const glossElements = document.querySelectorAll(".gloss");
    glossElements.forEach(el => {
        el.classList.remove("show");
    });
}


// Remove speech, which should happen when next is pressed.

function removeSpeech() {
    let sentence;
    if (state === "vertical") {
        sentence = document.getElementById("vertical-flashcard-sentence");
    }
    else {
        sentence = document.getElementById("flashcard-sentence");
    }
    sentence.innerHTML = "";
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
    const container = document.getElementById("buttons");
    let sentence;
    if (varstate === "vertical") {
        sentence  = document.getElementById("sentence-vertical");
    }
    else {
        sentence  = document.getElementById("sentence");
    }

    container.innerHTML = "";
    sentence.innerHTML = "";

    const words = lessonInformation[counter].mandatoryButtons;
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
    img.src = `../../lessons/lesson1/questions/question${counter}/lesson1_question${counter}_option${index + 1}.svg`;

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


(async () => {
    try {
        await loadAllLessons();
        updatePage();
    } catch (err) {
        console.error(err);
    }
})();