const AUTH_KEY = "hasSessionActive";
const DASHBOARD_PAGE = "/dashboard.html";
const SIGN_IN_PAGE = "/index.html";

function ensureUserAuthenticated() {
    const sessionStatus = sessionStorage.getItem(AUTH_KEY);
    if (sessionStatus !== "valid") {
        console.warn("User session invalid or missing. Redirecting to login.");
        window.location.replace(SIGN_IN_PAGE);
    }
}

function precludeAccessIfAuthorized() {
    const sessionStatus = sessionStorage.getItem(AUTH_KEY);
    if (sessionStatus === "valid") {
        console.info("User already logged in. Redirecting to dashboard.");
        window.location.replace(DASHBOARD_PAGE);
    }
}

document.addEventListener("click", (evt) => {
    const toggleButton = evt.target.closest("#nav-toggle-btn");
        if (!toggleButton) return;

    const navPanel = document.getElementById("site-navigation");
    if (navPanel) {
        const compactClass = "is-compact";
    if (navPanel.classList.contains(compactClass)) {
            navPanel.classList.remove(compactClass);
        } else {
            navPanel.classList.add(compactClass);
        }
    }
});