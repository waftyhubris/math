let counter = 1;

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

function updatePage() {
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