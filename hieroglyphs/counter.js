let counter = 1;
let state = "multichoice";
let previousAvatar = "";
let availableLessonLength = 15;
let lessonLength = 12;
let randomQuestionOrder;
let draftLessonInformation = {};
let lessonInformation = {};

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
        lessonLength++;
        lessonInformation[lessonLength] = structuredClone(lessonInformation[counter]);
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
                    let newSentenceButtons
                    if (state === "horizontal") {
                        newSentenceButtons = document.querySelectorAll("#sentence button");
                    }
                    else if (state === "vertical") {
                        newSentenceButtons = document.querySelectorAll("#sentence-vertical button");
                    }
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
        lessonLength++;
        lessonInformation[lessonLength] = structuredClone(lessonInformation[counter]);
        selected.classList.add("shake");
        correct.style.backgroundColor = "rgb(162, 255, 153)";
  }
  document.getElementById("check-button-multi").classList.add("hidden");
  document.getElementById("next-multi").classList.remove("hidden");

  document.querySelectorAll(".multichoice-option").forEach(b => {
    b.disabled = true;
  });
});


// Going to the next lesson.

document.getElementById("win-next").addEventListener("click", () => {
    counter++;
    state = lessonInformation[counter].state;
    document.getElementById("flashcard").classList.remove("bounce");
    document.getElementById("flashcard").classList.remove("shake");
    document.getElementById("vertical-flashcard").classList.remove("bounce");
    document.getElementById("vertical-flashcard").classList.remove("shake");
    updatePage(state);
});

document.getElementById("next-multi").addEventListener("click", () => {
    counter++;
    state = lessonInformation[counter].state;
    updatePage(state);
});



// Load all 15 questions first

async function loadAllLessons() {
    const promises = [];

    for (let i = 1; i <= availableLessonLength; i++) {
        const path = `../../lessons/lesson1/questions/question${i}/lesson1_question${i}.txt`;
        promises.push(loadIntoLessonInformation(path, i));
    }

    await Promise.all(promises);

    console.log("All lessons loaded.");
    console.log(lessonInformation);
}

async function loadIntoLessonInformation(url, i) {
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

        else if (key === "avatars") {
            entry.avatars = value.split(", ");
        }

        else if (key === "question") {
            entry.question = value;
        }

        else if (key === "transliteration") {
            entry.transliteration = value;
        }
    }

    entry.questionIndex = i;
    draftLessonInformation[i] = entry;
};


// Randomise lesson order under the instructions of lesson1.txt.

async function randomiseLessons() {
    const response = await fetch("lesson1.txt");
    if (!response.ok) throw new Error(`Failed to fetch lesson1.txt (${response.status})`);

    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(Boolean);

    const config = {};
    for (const line of lines) {
        const [key, value] = line.split(":").map(s => s.trim());
        config[key] = value;
    }

    const available = parseInt(config.availableQuestionCount);
    const desired = parseInt(config.desiredQuestionCount);

    const mandatory = config.mandatory
        ? config.mandatory.split(";").map(s => parseInt(s.trim()))
        : [];

    const allNumbers = Array.from({ length: available }, (_, i) => i + 1);

    const directChains = config.directConsequent
        ? config.directConsequent.split(";").map(s =>
            s.trim().split(",").map(n => parseInt(n.trim()))
        )
        : [];

    const indirectRules = config.indirectConsequent
        ? config.indirectConsequent.split(";").map(s => {
            const [lhs, rhs] = s.trim().split(",");
            return { before: lhs.split(".").map(n => parseInt(n.trim())), after: parseInt(rhs.trim()) };
        })
        : [];

    const selected = new Set(mandatory);
    const shuffled = allNumbers.sort(() => Math.random() - 0.5);
    for (const n of shuffled) {
        if (selected.size >= desired) break;
        selected.add(n);
    }
    if (selected.size !== desired) throw new Error("Not enough questions to satisfy desiredQuestionCount");

    const numberToChain = new Map();
    const chains = [];

    for (const chain of directChains) {
        const filteredChain = chain.filter(n => selected.has(n));
        if (filteredChain.length < 2) continue;
        chains.push(filteredChain);
        for (const n of filteredChain) numberToChain.set(n, filteredChain);
    }

    for (const n of selected) {
        if (!numberToChain.has(n)) {
            const chain = [n];
            chains.push(chain);
            numberToChain.set(n, chain);
        }
    }

    const graph = new Map();
    const indegree = new Map();

    for (const chain of chains) {
        graph.set(chain, new Set());
        indegree.set(chain, 0);
    }

    function addEdgeChain(aChain, bChain) {
        if (!graph.has(aChain) || !graph.has(bChain)) return;
        if (!graph.get(aChain).has(bChain)) {
            graph.get(aChain).add(bChain);
            indegree.set(bChain, indegree.get(bChain) + 1);
        }
    }

    for (const rule of indirectRules) {
        if (!selected.has(rule.after)) continue;
        const afterChain = numberToChain.get(rule.after);
        for (const b of rule.before) {
            if (!selected.has(b)) continue;
            const beforeChain = numberToChain.get(b);
            if (beforeChain !== afterChain) addEdgeChain(beforeChain, afterChain);
        }
    }

    for (const chain of chains) {
        for (let i = 0; i < chain.length - 1; i++) {
            const aChain = numberToChain.get([chain[i]]);
            const bChain = numberToChain.get([chain[i+1]]);
        }
    }

    const result = [];
    const zero = Array.from(graph.keys()).filter(c => indegree.get(c) === 0);

    while (zero.length) {
        zero.sort(() => Math.random() - 0.5);
        const chain = zero.pop();
        result.push(...chain);

        for (const dep of graph.get(chain)) {
            indegree.set(dep, indegree.get(dep) - 1);
            if (indegree.get(dep) === 0) zero.push(dep);
        }
    }

    if (result.length !== selected.size) throw new Error("Cyclic dependency detected");

    return result;
}


// Declaring vocabulary: one day, this should be automated


vocabulary = [
    'I', 'am', 'you', 'are', 'he', 'is', 'she', 'it', 'this', 'his', 'her', 'the', 'the', 'of', 'of', 'child', 'children', 'Egypt', 'man', 'god', 'gods', 'Ptah', 'king', 'desert', 'Horus', 'Ptah', 'Isis', 'Osiris', 'Set', 'Bastet', 'Thoth', 'great', 'queen', 'brother', 'daughter', 'scribe', 'eternity', 'tomb', 'evil', 'beautiful', 'plan', 'temple'
];


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
        let flippyIndex = Math.floor(Math.random() * (3));
        if (varstate === "vertical") {
            vertical.classList.remove("flippy");
            flashcard = document.getElementById('vertical-flashcard');
            egyptianSentence = document.getElementById('vertical-flashcard-sentence');
            horizontal.classList.add("hidden");
            vertical.classList.remove("hidden");
            multichoice.classList.add("hidden");
            if (flippyIndex === 2) {
                vertical.classList.add("flippy");
            }
        }
        else {
            flashcard = document.getElementById('flashcard');
            egyptianSentence = document.getElementById('flashcard-sentence');
            vertical.classList.add("hidden");
            horizontal.classList.remove("hidden");
            multichoice.classList.add("hidden");
        }
        if (flippyIndex === 2) {
            flashcard.classList.add("flippy")
        }
        else {
            flashcard.classList.remove("flippy")
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
            img.src = `../../lessons/lesson1/questions/question${lessonInformation[counter].questionIndex}/lesson1_question${lessonInformation[counter].questionIndex}_word${index}.svg`;
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
    const currentAvatars = lessonInformation[counter].avatars || [];

    if (currentAvatars[0].length === 0) {
        currentAvatars = [
        "man",
        "cobra",
        "falcon",
        "owl"
    ];
    };

    let randomIndex = Math.floor(Math.random() * currentAvatars.length);
    let currentAvatar = currentAvatars[randomIndex];
    if (currentAvatars.length > 1) {
        while (currentAvatar === previousAvatar) {
            randomIndex = Math.floor(Math.random() * currentAvatars.length);
            currentAvatar = currentAvatars[randomIndex];
        }
    }
    img.src = '../../speaking_avatars/' + currentAvatar + '.svg';
    previousAvatar = currentAvatar;
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
    img.src = `../../lessons/lesson1/questions/question${lessonInformation[counter].questionIndex}/lesson1_question${lessonInformation[counter].questionIndex}_option${index + 1}.svg`;

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


// Running the main function.

(async () => {
    try {
        await loadAllLessons();
        randomQuestionOrder = await randomiseLessons();
        for (let i = 1; i <= lessonLength; i++) {
            lessonInformation[i] = draftLessonInformation[randomQuestionOrder[i - 1]];
        }
        state = lessonInformation[counter].state;
        updatePage(state);
    } catch (err) {
        console.error(err);
    }
})();