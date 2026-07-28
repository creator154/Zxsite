window.addEventListener("load", function () {

const loader = document.getElementById("loader");

if (loader) {

loader.style.display = "none";

}

});

document.addEventListener("readystatechange", function () {

const loader = document.getElementById("loader");

if (!loader) return;

if (document.readyState === "loading") {

loader.style.display = "flex";

} else {

loader.style.display = "none";

}

});
