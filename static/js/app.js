// Common Functions

function goBack() {
    window.history.back();
}

function goHome() {
    window.location.href = "/";
}

function openUrl(url) {
    window.location.href = url;
}

function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
}

function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

function notify(message) {
    alert(message);
}

window.onload = function () {
    hideLoader();
};
