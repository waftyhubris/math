let counter = 1;
let state = "multichoice";
let previousAvatar = "";
let available;
let desired;
let randomQuestionOrder;
let draftLessonInformation = {};
let lessonInformation = {};
let vocabFlag = [];
let vocabCount;
let lifeCount = 3;
const params = new URLSearchParams(window.location.search);
const chapter = params.get("chapter");
const lesson = params.get("lesson");
const lessonPath = `chapters/chapter` + chapter + 
                        `/lessons` + 
                        `/lesson` + lesson + 
                        `/`;

// Effect of swiping right on iPhone.

let startX = 0;

document.addEventListener("touchstart", e => {
    startX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", async (e) => {
    const endX = e.changedTouches[0].screenX;

    if (startX - endX > 50) {
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
        else if (state === "match") {
            const nextButton = document.getElementById("next-match");
            if (!nextButton.classList.contains("hidden") && !nextButton.classList.contains("inaccessible")) {
                nextButton.click();
            }
        }
        else {
            const nextButton = document.getElementById("win-next");
            if (!nextButton.classList.contains("hidden") && !nextButton.classList.contains("inaccessible")) {
                nextButton.click();
            }
            else {
                const checkButton = document.getElementById("check-button");
                if (checkButton && !checkButton.classList.contains("hidden")) {
                    checkButton.click();
                }
            }
        }
    }
});


// Effect of clicking anywhere.

document.addEventListener("click", (event) => {
    if (!event.target.closest(".word-gloss")) {
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
        else if (state === "match") {
            const nextButton = document.getElementById("next-match");
            if (!nextButton.classList.contains("hidden") && !nextButton.classList.contains("inaccessible")) {
                nextButton.click();
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
    flashcard.classList.add("correctly-selected");
    document.getElementById("check-button").classList.add("hidden");
    document.getElementById("win-next").classList.remove("hidden");
    flashcard.classList.remove("bounce");
    flashcard.classList.remove("shake");
    void flashcard.offsetWidth;
    flashcard.classList.add("bounce");

    buttons.forEach((button, index) => {
        button.classList.add("correctly-selected");
        button.classList.remove("pop")
        button.style.animationDelay = `${index * 0.02}s`;
        button.classList.add("bounce");
    });
    
  } else {
        lifeCount -= 1;
        updateLife();
        flashcard.classList.add("incorrectly-selected");
        desired++;
        lessonInformation[desired] = structuredClone(lessonInformation[counter]);
        document.getElementById("check-button").classList.add("hidden");
        document.getElementById("win-next").classList.add("inaccessible");
        document.getElementById("win-next").classList.remove("hidden");
        flashcard.classList.remove("shake");
        flashcard.classList.remove("bounce");
        void flashcard.offsetWidth;
        flashcard.classList.add("shake");


        buttons.forEach((button, index) => {
            button.classList.add("incorrectly-selected");
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
    if (button.classList.contains("selected")) {
        button.classList.remove("selected");
    }
    else {
        multibuttons.forEach(b => {
            b.classList.remove("selected");
        });
        button.classList.add("selected");
    }
  });
});


document.getElementById("check-button-multi").addEventListener("click", function () {
  const selected = document.querySelector(".multichoice-option.selected");
  if (!selected) return;

  const correct = document.querySelector(".multichoice-option.correct");

    if (selected.classList.contains("correct")) {
        selected.classList.add("correctly-selected");
        selected.classList.add("bounce");
    } else {
        lifeCount -= 1;
        updateLife();
        selected.classList.add("incorrectly-selected");
        desired++;
        lessonInformation[desired] = structuredClone(lessonInformation[counter]);
        selected.classList.add("shake");
        correct.classList.add("correctly-selected");
  }
  document.getElementById("check-button-multi").classList.add("hidden");
  document.getElementById("next-multi").classList.remove("hidden");

  document.querySelectorAll(".multichoice-option").forEach(b => {
    b.disabled = true;
  });
});


// Declaring the match button actions, which are a little more complicated.

let selectedSide = null;

document.querySelectorAll(".match-option").forEach(btn => {
    btn.addEventListener("click", handleMatchClick);
});

function handleMatchClick(e) {
    const btn = e.currentTarget;
    if (btn.disabled) return;
    if (btn.classList.contains("incorrectly-selected")) return;

    const side = btn.id.startsWith("left") ? "left" : "right";

    if (btn.classList.contains("selected")) {
        btn.classList.remove("selected");
        return;
    }

    const selected = document.querySelector(".match-option.selected");

    if (!selected) {
        btn.classList.add("selected");
        return;
    }

    const selectedSide = selected.id.startsWith("left") ? "left" : "right";

    if (side === selectedSide) {
        selected.classList.remove("selected");
        btn.classList.add("selected");
        return;
    }

    checkMatch(selected, btn);
}

function checkMatch(a, b) {
    const correct = a.dataset.match === b.dataset.match;

    a.classList.remove("selected");
    b.classList.remove("selected");

    if (correct) {
        a.classList.add("correctly-selected");
        a.classList.add("bounce");
        b.classList.add("correctly-selected");
        setTimeout(() => {
            b.classList.add("bounce");
        }, 30);
        a.disabled = true;
        b.disabled = true;
        checkIfFinished();
    } else {
        lifeCount -= 1;
        updateLife();
        lessonInformation[counter].incorrectFlag = true;
        a.classList.add("incorrectly-selected");
        a.classList.add("shake");
        b.classList.add("incorrectly-selected");
        setTimeout(() => {
            b.classList.add("shake");
        }, 30);
        
        setTimeout(() => {
            a.classList.remove("incorrectly-selected");
            a.classList.remove("shake");
            b.classList.remove("incorrectly-selected");
            b.classList.remove("shake");
        }, 800);
    }
}

function checkIfFinished() {
    const remaining = document.querySelectorAll(".match-option:not(:disabled)");
    if (remaining.length === 0) {
        document.getElementById("next-match").classList.remove("hidden");
        document.getElementById("next-match").classList.remove("inaccessible");
    }
}


// Updating the heart icon.

function updateLife() {
    img = document.getElementById("heart");
    img.classList.add("shake");
    if (lifeCount === 2) {
        img.src = "icons/hearts/heart2.svg";
    }
    if (lifeCount === 1) {
        img.src = "icons/hearts/heart1.svg";
    }
    if (lifeCount === 0) {
        img.src = "icons/hearts/heart0.svg";
    }
}


// Going to the next lesson.

document.getElementById("win-next").addEventListener("click", () => {
    if (lifeCount <= 0) {
        window.location.href = "hieroglyphs.html";
    }
    counter++;
    state = lessonInformation[counter].state;
    document.getElementById("flashcard").classList.remove("bounce");
    document.getElementById("flashcard").classList.remove("shake");
    document.getElementById("vertical-flashcard").classList.remove("bounce");
    document.getElementById("vertical-flashcard").classList.remove("shake");
    updatePage(state);
});

document.getElementById("next-multi").addEventListener("click", () => {
    if (lifeCount <= 0) {
        window.location.href = "hieroglyphs.html";
    }
    counter++;
    state = lessonInformation[counter].state;
    updatePage(state);
});

document.getElementById("next-match").addEventListener("click", () => {
    if (lifeCount <= 0) {
        window.location.href = "hieroglyphs.html";
    }
    if (lessonInformation[counter].incorrectFlag) {
        desired++;
        lessonInformation[desired] = structuredClone(lessonInformation[counter]);
        lessonInformation[desired].incorrectFlag = false;
    }
    counter++;
    state = lessonInformation[counter].state;
    updatePage(state);
});


// Get number of new vocab items zeroth.

async function vocabFlagInitiator() {
    const response = await fetch(lessonPath + "new-vocabulary/text.txt");
    if (!response.ok) throw new Error(`Failed to fetch lesson1.txt (${response.status})`);

    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(Boolean);

    const config = {};
    for (const line of lines) {
        const [key, value] = line.split(":").map(s => s.trim());
        config[key] = value;
    }

    vocabCount = parseInt(config.count);
        for (let i = 0; i < vocabCount; i++) {
        vocabFlag[i] = false;
    }
}

async function getVocabCount(varChapter, varLesson) {
    const response = await fetch(`chapters/chapter` + varChapter + 
                        `/lessons` + 
                        `/lesson` + varLesson + 
                        `/` + "new-vocabulary/text.txt");

    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(Boolean);

    const config = {};
    for (const line of lines) {
        const [key, value] = line.split(":").map(s => s.trim());
        config[key] = value;
    }

    return parseInt(config.count);
}


// Get question count first.

async function loadQuestionCount() {
    const response = await fetch(lessonPath + "text.txt");
    if (!response.ok) throw new Error(`Failed to fetch lesson1.txt (${response.status})`);

    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(Boolean);

    const config = {};
    for (const line of lines) {
        const [key, value] = line.split(":").map(s => s.trim());
        config[key] = value;
    }

    available = parseInt(config.availableQuestionCount);
    desired = parseInt(config.desiredQuestionCount);
}


// Load all questions second.

async function loadAllLessons() {
    const promises = [];

    for (let i = 1; i <= available; i++) {
        const path = lessonPath + `questions/question${i}/text.txt`;
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

        else if (key === "betterWords") {
            const directory = value.split("; ");
            entry.words = [];
            for (const code of directory) {
                const [chapter, lesson, word] = code.split(".");

                const base = `chapters/chapter${chapter}/lessons/lesson${lesson}/new-vocabulary`;
                const textResp = await fetch(`${base}/word${word}/text.txt`);
                const text = await textResp.text();

                const transliterationMatch = text.match(/^transliteration:\s*(.*)$/m);
                const meaningMatch = text.match(/^meaning:\s*(.*)$/m);

                const pronunciation = transliterationMatch ? transliterationMatch[1].trim() : "";
                const meaning = meaningMatch ? meaningMatch[1].trim() : "";

                const htmlResp = await fetch(`${base}/library.html`);
                const htmlText = await htmlResp.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, "text/html");
                let el;
                if (entry.state === "horizontal") {
                    el = doc.getElementById(`word${word}-horizontal`);
                }
                else {
                    el = doc.getElementById(`word${word}-vertical`);
                }
                

                const image = el ? el.innerHTML : "";

                entry.words.push({
                    pronunciation: pronunciation,
                    translation: meaning,
                    image: image,
                    index: code
                });
            }
        }

        else if (key === "option") {
            const [thisChapter, thisLesson, word] = value.split(".");
            //Rejig this so it also works in different chapters.
            const numbers = [];
            for (let k = 1; k <= vocabCount; k++) {
                if (k !== parseInt(word)) numbers.push(k);
            }

            for (let k = numbers.length - 1; k > 0; k--) {
                const j = Math.floor(Math.random() * (k + 1));
                [numbers[k], numbers[j]] = [numbers[j], numbers[k]];
            }

            const chosen = [parseInt(word), ...numbers.slice(0, 3)];
            entry.chosen=chosen;

            const result = [];
            let index = 0;
            for (const i of chosen) {
                index++;
                const wordResponse = await fetch(lessonPath + "new-vocabulary/word" + i + "/text.txt");
                if (!wordResponse.ok) {
                    throw new Error("Failed to fetch word " + i);
                }

                const wordText = await wordResponse.text();
                const lines = wordText.split(/\r?\n/);

                let meaning = "";
                for (const line of lines) {
                    if (line.startsWith("meaning:")) {
                        meaning = line.split(":")[1].trim();
                        break;
                    }
                }

                const base = `chapters/chapter${chapter}/lessons/lesson${lesson}/new-vocabulary`;
                const htmlResp = await fetch(`${base}/library.html`);
                const htmlText = await htmlResp.text();

                const parser = new DOMParser();
                const vocab = parser.parseFromString(htmlText, "text/html");
                const el = vocab.getElementById(`word${i}-horizontal`).innerHTML;

                let correctitude = false;
                if (index === 1) {
                    correctitude = true;
                }
                result.push({
                    valency: correctitude,
                    image: el,
                    meaning: meaning
                });
            }
            entry.entries = result;
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

        else if (key === "new") {
            entry.new = parseInt(value);
        }
    }

    if (entry.state === "match") {
        entry.incorrectFlag = false;

        const numbers = [];
        for (let i = 1; i <= vocabCount; i++) numbers.push({chapter: chapter, lesson: lesson, word: i});
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        let chosen = numbers.slice(0, entry.new).sort((a, b) => a - b);

        function randomPair(chapter, lesson) {
            if (chapter <= 0) return null;

            const chooseCase1 = (parseInt(chapter) === 1)
                ? false
                : Math.random() < 0.5;

            if (chooseCase1) {
                const a = Math.floor(Math.random() * (chapter - 1)) + 1; // 1 ≤ a < chapter
                const b = Math.floor(Math.random() * 4) + 1;             // 1 ≤ b ≤ 4
                return [a, b];
            } else {
                if (lesson <= 1) return null;
                const a = parseInt(chapter);
                const b = Math.floor(Math.random() * (lesson - 1))+1;  // 1 ≤ b < lesson
                return [a, b];
            }
        }

        if (entry.new !== 5) {
            let [newChapter, newLesson] = randomPair(chapter, lesson);
            let newVocabCount = await getVocabCount(newChapter, newLesson);
            entry.newVocabCount = newVocabCount;
            const newNumbers = [];
            for (let i = 1; i <= newVocabCount; i++) newNumbers.push({chapter: newChapter, lesson: newLesson, word: i});
            for (let i = newNumbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newNumbers[i], newNumbers[j]] = [newNumbers[j], newNumbers[i]];
            }
            entry.newNumbers=newNumbers;
            const newChosen = newNumbers.slice(0, 5-entry.new).sort((a, b) => a - b);
            chosen = [...chosen, ...newChosen];
            entry.newChosen=newChosen;
        }

        const result = [];
        for (const i of chosen) {
            const wordResponse = await fetch(`chapters/chapter` + i.chapter + 
                        `/lessons` + 
                        `/lesson` + i.lesson + 
                        `/` + "new-vocabulary/word" + i.word + "/text.txt");
            if (!wordResponse.ok) {
                throw new Error("Failed to fetch word " + i);
            }

            const wordText = await wordResponse.text();
            const lines = wordText.split(/\r?\n/);

            let meaning = "";
            for (const line of lines) {
                if (line.startsWith("meaning:")) {
                    meaning = line.split(":")[1].trim();
                    break;
                }
            }

            const base = `chapters/chapter${i.chapter}/lessons/lesson${i.lesson}/new-vocabulary`;
            const htmlResp = await fetch(`${base}/library.html`);
            const htmlText = await htmlResp.text();

            const parser = new DOMParser();
            const vocab = parser.parseFromString(htmlText, "text/html");
            const el = vocab.getElementById(`word${i.word}-horizontal`).innerHTML;
            result.push({
                image: el,
                meaning: meaning
            });
        }
        entry.chosen = chosen;
        entry.entries = result;
    }

    entry.flippy = Math.floor(Math.random() * (3));

    entry.questionIndex = i;
    draftLessonInformation[i] = entry;
};


// lesson order under the instructions of lesson1.txt.

async function randomiseLessons() {
    const response = await fetch(lessonPath + "text.txt");
    if (!response.ok) throw new Error(`Failed to fetch lesson1.txt (${response.status})`);

    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(Boolean);

    const config = {};
    for (const line of lines) {
        const [key, value] = line.split(":").map(s => s.trim());
        config[key] = value;
    }

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
    document.getElementById("heart").classList.remove("shake");

    // Change flashcards
    const horizontal = document.getElementById("horizontal-layout");
    const vertical = document.getElementById("vertical-layout");
    const multichoice = document.getElementById("multichoice-layout");
    const match = document.getElementById("match-layout");
    if (varstate === "multichoice") {
        document.getElementById("translation-footer").classList.add("hidden");
        document.querySelectorAll(".multichoice-option").forEach(b => {
            b.disabled = false;
            b.style.backgroundColor = "white";
            b.classList.remove("selected");
            b.classList.remove("correctly-selected");
            b.classList.remove("incorrectly-selected");
            b.classList.remove("shake");
            b.classList.remove("bounce");
        });
        document.getElementById("check-button-multi").classList.remove("hidden");
        document.getElementById("next-multi").classList.add("hidden");
        horizontal.classList.add("hidden");
        vertical.classList.add("hidden");
        multichoice.classList.remove("hidden");
        match.classList.add("hidden");
        document.getElementById("multichoice-stem").textContent = lessonInformation[counter].question;
        document.getElementById("multichoice-variable").textContent = lessonInformation[counter].transliteration;
        randomiseMultichoice();
    }
    else if (varstate === "match") {
        document.getElementById("next-match").classList.add("inaccessible");
        document.getElementById("next-match").classList.add("hidden");
        document.getElementById("translation-footer").classList.add("hidden");
        horizontal.classList.add("hidden");
        vertical.classList.add("hidden");
        multichoice.classList.add("hidden");
        match.classList.remove("hidden");

        selectedSide = null;
        document.querySelectorAll(".match-option").forEach(btn => {
            btn.classList.remove("correctly-selected");
            btn.classList.remove("bounce");
            btn.disabled = false;
        });

        let entries = lessonInformation[counter].entries;

        function shuffle(arr) {
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        const left = [...entries];
        const right = [...entries];
        shuffle(left);
        shuffle(right);

        for (let i = 0; i < entries.length; i++) {
            const leftBtn = document.getElementById("left-option" + (i+1));
            const rightBtn = document.getElementById("right-option" + (i+1));
            leftBtn.innerHTML = left[i].image;
            rightBtn.textContent = right[i].meaning;
            leftBtn.dataset.match = left[i].meaning;
            rightBtn.dataset.match = right[i].meaning;
        }
    }
    else {
        document.getElementById("translation-footer").classList.remove("hidden");
        let flashcard;
        
        Math.floor(Math.random() * (3));
        if (varstate === "vertical") {
            vertical.classList.remove("flippy");
            flashcard = document.getElementById('vertical-flashcard');
            egyptianSentence = document.getElementById('vertical-flashcard-sentence');
            horizontal.classList.add("hidden");
            vertical.classList.remove("hidden");
            multichoice.classList.add("hidden");
            match.classList.add("hidden");
        }
        else {
            flashcard = document.getElementById('flashcard');
            egyptianSentence = document.getElementById('flashcard-sentence');
            vertical.classList.add("hidden");
            horizontal.classList.remove("hidden");
            multichoice.classList.add("hidden");
            match.classList.add("hidden");
        }
        document.getElementById("check-button").classList.remove("hidden");
        document.getElementById("win-next").classList.add("hidden");

        flashcard.classList.remove("correctly-selected");
        flashcard.classList.remove("incorrectly-selected");
        let index = 1;

        function tryLoadNext() {
            let blueness = false;
            const word = lessonInformation[counter].words[index - 1];
            const prefix = `${chapter}.${lesson}.`;
            if (typeof word.index === "string" && word.index.startsWith(prefix)) {
                const numberPart = word.index.slice(prefix.length);
                const num = parseInt(numberPart, 10);
                if (!vocabFlag[num-1]) {
                    blueness = true;
                    vocabFlag[num-1] = true;
                }
            }
            const div = Object.assign(document.createElement("div"), {className: "word-gloss", id: `word-index${index}`});
            const subdiv = Object.assign(document.createElement("div"), {className: "gloss", id: `word-index${index}`});
            const pronunciation = document.createElement("i");
            pronunciation.textContent = lessonInformation[counter].words[index-1].pronunciation;
            const translation = document.createTextNode(lessonInformation[counter].words[index-1].translation);
            let flippyIndex = lessonInformation[counter].flippy;
            if (flippyIndex === 2) {
                flashcard.classList.add("flippy");
                vertical.classList.add("flippy");
            }
            else {
                flashcard.classList.remove("flippy");
            }
            subdiv.append(pronunciation, ": ", translation);
            div.innerHTML = lessonInformation[counter].words[index-1].image;
            div.querySelector("svg").classList.add("speech");
            if (blueness) {
                div.querySelector("svg").style.fill = "#00A0D7";
            }
            div.addEventListener("click", () => {
                if (subdiv.classList.contains("show")) {
                    removeGloss();
                }
                else {
                    removeGloss();
                    subdiv.classList.toggle("show");
                }
            });
            div.appendChild(subdiv);
            egyptianSentence.appendChild(div);
            index++;
            try {
                tryLoadNext();
            }
            catch {
                
            }
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
    lessonInformation[counter].avatars = [currentAvatar];
    img.src = 'speaking_avatars/' + currentAvatar + '.svg';
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
    fillWordsRandomly(words, vocabulary, 10);
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
        button.innerHTML = lessonInformation[counter].entries[index].image;
        button.querySelector("svg").classList.add("multichoice-image");
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
        await vocabFlagInitiator();
        await loadQuestionCount();
        await loadAllLessons();
        randomQuestionOrder = await randomiseLessons();
        for (let i = 1; i <= desired; i++) {
            lessonInformation[i] = draftLessonInformation[randomQuestionOrder[i - 1]];
        }
        state = lessonInformation[counter].state;
        updatePage(state);
    } catch (err) {
        console.error(err);
    }
})();