// Function to choose layout
function chooseLayout() {
  const desktop = document.getElementById("desktop-layout");
  const mobile = document.getElementById("mobile-layout");

  if (window.innerWidth < 800) {
    // Show mobile
    mobile.style.display = "block";
    desktop.style.display = "none";

  } else {
    // Show desktop
    desktop.style.display = "block";
    mobile.style.display = "none";
  }
}
