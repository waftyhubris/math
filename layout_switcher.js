// Function to choose layout
function chooseLayout() {
  const desktop = document.getElementById("desktop-layout");
  const mobile = document.getElementById("mobile-layout");

  if (window.innerWidth < 768) {
    // Show mobile
    mobile.style.display = "block";
    desktop.style.display = "none";

    // Mobile-specific code
    maybeAddFooter(); // footer may appear or disappear depending on height
  } else {
    // Show desktop
    desktop.style.display = "block";
    mobile.style.display = "none";

    // Remove footer for desktop
    removeFooter();
  }
}

// Function to choose layout
function chooseLayoutShot() {
  const desktop = document.getElementById("desktop-layout");
  const mobile = document.getElementById("mobile-layout");

  if (window.innerWidth < 768) {
    // Show mobile
    mobile.style.display = "block";
    desktop.style.display = "none";

    // Mobile-specific code
    maybeAddFooterShot(); // footer may appear or disappear depending on height
  } else {
    // Show desktop
    desktop.style.display = "block";
    mobile.style.display = "none";

    // Remove footer for desktop
    removeFooter();
  }
}

// Function to add footer if page height meets condition
function maybeAddFooter() {
  const minHeight = 800; // change this to your desired minimum height
  const pageHeight = document.documentElement.scrollHeight;
  const existingFooter = document.getElementById("fo");

  if (pageHeight >= minHeight) {
    if (!existingFooter) {
      const footer = document.createElement("footer");
      footer.id = "fo";
      footer.innerHTML = `<div class="col"><a href="shot.html">SHoT Group</a></div>`;
      document.body.appendChild(footer);
    }
  } else {
    // Remove footer if page is too short
    if (existingFooter) existingFooter.remove();
  }
}

// Function to add footer if page height meets condition
function maybeAddFooterShot() {
  const minHeight = 800; // change this to your desired minimum height
  const pageHeight = document.documentElement.scrollHeight;
  const existingFooter = document.getElementById("fo");

  if (pageHeight >= minHeight) {
    if (!existingFooter) {
      const footer = document.createElement("footer");
      footer.id = "fo";
      footer.innerHTML = `Come along, we'd love to see you there!`;
      document.body.appendChild(footer);
    }
  } else {
    // Remove footer if page is too short
    if (existingFooter) existingFooter.remove();
  }
}

// Separate function to remove footer
function removeFooter() {
  const existingFooter = document.getElementById("fo");
  if (existingFooter) existingFooter.remove();
}