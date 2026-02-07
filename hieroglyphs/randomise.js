const container = document.getElementById("buttons");
const nodes = Array.from(container.children);

// Fisher–Yates shuffle
for (let i = nodes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
}

// Re-append nodes in new order (does not break links)
nodes.forEach(node => container.appendChild(node));