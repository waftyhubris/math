let counter = 1;

// let answers = []; // list of answers

// async function loadAnswers(counterList) {
//     answers = [];

//     for (let c of counterList) {
//         const path = `../../lessons/lesson${c}/sentences/sentence${c}/lesson${c}_sentence${c}.txt`;
//         const text = await fetch(path).then(res => res.text());

//         const firstLine = text.split(/\r?\n/)[0];
//         const answer = firstLine.split(":").slice(1).join(":").trim();

//         answers.push(answer);
//     }

//     console.log("Loaded answers:", answers);
// }

// function showCorrectAnswer(index) {
//     const answerEl = document.getElementById("correct-answer");
//     answerEl.textContent = answers[index] || "what";
// }

function updateAnswer() {
  fetch(`../../lessons/lesson1/sentences/sentence${counter}/lesson1_sentence${counter}.txt`)
    .then(r => r.text())
    .then(t => {
      const firstLine = t.split('\n')[0];
      const secondHalf = firstLine.split(': ')[1] ?? '';
      document.getElementById("correct-answer").textContent = "hello";
    });
}

function updateText() {
  fetch(`texts/text${counter}.txt`)
    .then(r => r.text())
    .then(t => {
      const firstLine = t.split('\n')[0];
      const secondHalf = firstLine.split(': ')[1] ?? '';
      document.getElementById("text").textContent = secondHalf;
    });
}


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


const buttonSets = {
    1: [
        "I", "am", "a", "child", "Egypt", "man", "god", "Ptah", "enemy", "desert"
    ],
    2: [
        "you", "are", "the", "king", "of", "Upper", "Egypt"
    ]
};

const avatars = {
    1: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg"
    ],
    2: [
        "../../speaking_avatars/man.svg",
        "../../speaking_avatars/cobra.svg",
        "../../speaking_avatars/falcon.svg"
    ]
};

document.getElementById("win-next").addEventListener("click", () => {
    counter++;
    updatePage();
});

document.getElementById("lose-next").addEventListener("click", () => {
    counter++;
    updatePage();
});

async function updatePage() {
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
    updateAnswer();
    await loadAnswers([1, 2]);
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