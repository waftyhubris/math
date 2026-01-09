const week1HTML = `
    <h2>
        Week 1: Spectral Sequences
    </h2>
    <h3>
    Date and location to be confirmed
    </h3>
    <p>
        Abstract: The first talk in our reading group! We will define spectral sequences, and use as our motivating example the spectral sequence of a filtered complex. We will then introduce the spectral sequence of a double complex, and produce quick and marvelous proofs of some results in homological algebra, such as the five lemma and the snake lemma.
    </p>
    <p>
        Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_1.png" alt="Horizontal filtration on double complex" class = "weekly">
    <p>
        The notes and video will be made available after the talk.
    </p>
`;

const week1HTMLmobile = `
    <p>
        <i>Week 1: Spectral Sequences</i>. The first talk in our reading group! We will define spectral sequences, and use as our motivating example the spectral sequence of a filtered complex. We will then introduce the spectral sequence of a double complex, and produce quick and marvelous proofs of some results in homological algebra, such as the five lemma and the snake lemma.
    </p>
    <p>
        Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_1.png" alt="Horizontal filtration on double complex" class = "weekly">
    <p>
        The notes and video will be made available after the talk.
    </p>
`;

const week2HTML = `
    <h2>
    Week 2: Steenrod Squares
    </h2>
    <h3>
    Date and location to be confirmed
    </h3>
    <p>
    Abstract: We will concretely introduce the Steenrod squares, which are precisely the stable cohomology operations on the modulo 2 cochains of a topological space. The method we use is a combination of the ones used by Mosher-Tangora and Lurie. We then prove some of the basic properties of Steenrod squares, including the Cartan formula and the Adem relations.
    </p>
    <p>
    Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_2.png" alt="Horizontal filtration on double complex" class = "weekly">
    <p>
    The notes and video will be made available after the talk.
    </p>
`;

const week2HTMLmobile = `
    <p>
    <i>Week 2: Steenrod Squares.</i> We will concretely introduce the Steenrod squares, which are precisely the stable cohomology operations on the modulo 2 cochains of a topological space. The method we use is a combination of the ones used by Mosher-Tangora and Lurie. We then prove some of the basic properties of Steenrod squares, including the Cartan formula and the Adem relations.
    </p>
    <p>
    Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_2.png" alt="Horizontal filtration on double complex" class = "weekly">
    <p>
    The notes and video will be made available after the talk.
    </p>
`;

const week3HTML = `
    <h2>
    Week 3: Hopf Algebras
    </h2>
    <h3>
    Date and location to be confirmed
    </h3>
    <p>
    Abstract: To be confirmed.
    </p>
    <p>
    Speaker: To be confirmed.
    </p>
    <p>
    The notes and video will be made available after the talk.
    </p>
`;

const week3HTMLmobile = `
    <p>
    <i>Week 3: Hopf Algebras.</i> Abstract to be confirmed.
    </p>
    <p>
    Speaker: To be confirmed.
    </p>
    <p>
    The notes and video will be made available after the talk.
    </p>
`;

const week4HTML = `
    <h2>
    Week 4: Spectra
    </h2>
    <h3>
      Date and location to be confirmed
    </h3>
    <p>
    Abstract: To be confirmed.
    </p>
    <p>
    Speaker: To be confirmed.
    </p>
    <p>
    The notes and video will be made available after the talk.
    </p>
`;

const week5HTML = `
    <h2>
    Week 5: Cohomology Theories
    </h2>
    <h3>
      Date and location to be confirmed
    </h3>
    <p>
    Abstract: To be confirmed.
    </p>
    <p>
    Speaker: To be confirmed.
    </p>
    <p>
    The notes and video will be made available after the talk.
    </p>
`;



document.querySelectorAll(".week1").forEach(el => {
  el.innerHTML = week1HTML;
});

document.querySelectorAll(".week1mobile").forEach(el => {
  el.innerHTML = week1HTMLmobile;
});

document.querySelectorAll(".week2").forEach(el => {
  el.innerHTML = week2HTML;
});

document.querySelectorAll(".week2mobile").forEach(el => {
  el.innerHTML = week2HTMLmobile;
});

document.querySelectorAll(".week3").forEach(el => {
  el.innerHTML = week3HTML;
});

document.querySelectorAll(".week3mobile").forEach(el => {
  el.innerHTML = week3HTMLmobile;
});

document.querySelectorAll(".week4").forEach(el => {
  el.innerHTML = week4HTML;
});

document.querySelectorAll(".week5").forEach(el => {
  el.innerHTML = week5HTML;
});