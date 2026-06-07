const authScreen = document.getElementById("authScreen");
const appScreen = document.getElementById("appScreen");
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("usernameInput");
const operatorChip = document.getElementById("operatorChip");
const logoutButton = document.getElementById("logoutButton");
const liveClock = document.getElementById("liveClock");
const viewButtons = document.querySelectorAll("[data-view-target]");
const panels = document.querySelectorAll("[data-view]");

function formatClock() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  return `${day}.${month}.${year} | ${hour}:${minute}:${second}`;
}

function updateClock() {
  liveClock.textContent = formatClock();
}

function setView(viewName) {
  viewButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === viewName);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.view !== viewName);
  });

  window.scrollTo(0, 0);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  operatorChip.textContent = usernameInput.value.trim() || "Operatör";
  authScreen.classList.add("is-hidden");
  appScreen.classList.remove("is-hidden");
  setView("dashboard");
});

logoutButton.addEventListener("click", () => {
  appScreen.classList.add("is-hidden");
  authScreen.classList.remove("is-hidden");
  loginForm.reset();
  operatorChip.textContent = "Operatör";
  setView("dashboard");
});

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.viewTarget);
  });
});

updateClock();
window.setInterval(updateClock, 1000);
