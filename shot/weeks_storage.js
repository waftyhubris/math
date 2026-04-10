const week1HTML = `
    <p>
        Abstract: The first talk in our reading group! We will define spectral sequences, and use as our motivating example the spectral sequence of a filtered complex. We will then introduce the spectral sequence of a double complex, and produce quick and marvelous proofs of some results in homological algebra, such as the five lemma and the snake lemma.
    </p>
    <p>
        Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_1.png" alt="Horizontal filtration on double complex" class = "weekly">
    <p>
        Click to access a <a href="https://youtu.be/_6vNPEQPklo">recording</a> of the talk, or notes on the spectral sequence of a <a href="notes/week-1/Filtered Complex.pdf">filtered</a> and <a href="notes/week-1/Double Complex.pdf">double complex</a>.
    </p>
`;

const week2HTML = `
    <p>
    Abstract: We describe the Alexander-Whitney map, and use it to produce the cup product. The cup product is not strictly commutative, but it is commutative up to chain homotopy! Actually, there are two candidates for such a chain homotopy, and again they only agree up to another, higher chain homotopy. It turns out that there is a nice way to package the cup product together with an infinite tower of chain homotopies that live above it.
    </p>
    <p>
    Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_2.png" alt="Steenrod things" class = "weekly">
    <p>
    Click to access a <a href="https://youtu.be/jrol5xuLjsg">recording</a> of the talk.
    </p>
`;

const week3HTML = `
    <p>
    Abstract: We will concretely introduce the Steenrod squares, which are precisely the stable cohomology operations on the modulo 2 cochains of a topological space. We do this by deriving explicit coboundary formulae for the higher cup products introduced by Steenrod in his original paper. We will prove that these operations are additive and well-defined, and begin comparing our results with the axiomatic characterisation of Steenrod squares.
    </p>
    <p>
    Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_3.png" alt="Steenrod things" class = "weekly">
    <p>
    Click to access a <a href="https://youtu.be/MB_SbEkbo-0">recording</a> of the talk.
    </p>
`;

const week4HTML = `
    <p>
    Abstract: We will put our work on solid footing by using Mosher-Tangora's acyclic carrier theorem, and look towards proving all of the axioms which Steenrod squares satisfy. In particular, we prove that the Steenrod squares are natural with respect to topological spaces.
    </p>
    <p>
    Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_4.png" alt="Steenrod things" class = "weekly">
    <p>
    Click to access a <a href="https://youtu.be/zbaXSzkJuTQ">recording</a> of the talk.
    </p>
`;

const week5HTML = `
    <p>
    Abstract: We can always equip the cohomology of a topological space with the notion of multiplication using the cup product. In nice cases, we can also equip the homology of a topological space with a notion of comultiplication. We will describe the comultiplication structure on the homology of infinite real projective space, and use it to deduce the Cartan formula for Steenrod squares.
    </p>
    <p>
    Speaker: <a href="../webpage/index.html">Declan Zammit</a>, Macquarie University
    </p>
    <img src="week_5.png" alt="Steenrod things" class = "weekly">
    <p>
    Click to access a <a href="https://youtu.be/zbaXSzkJuTQ">recording</a> of the talk.
    </p>
`;



document.querySelectorAll(".week1").forEach(el => {
  el.innerHTML = week1HTML;
});

document.querySelectorAll(".week2").forEach(el => {
  el.innerHTML = week2HTML;
});

document.querySelectorAll(".week3").forEach(el => {
  el.innerHTML = week3HTML;
});

document.querySelectorAll(".week4").forEach(el => {
  el.innerHTML = week4HTML;
});

document.querySelectorAll(".week5").forEach(el => {
  el.innerHTML = week5HTML;
});