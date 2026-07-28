const player = document.getElementById("player");

if (player) {

player.onload = function () {

hideLoader();

};

}

function enterFullscreen() {

const iframe = document.getElementById("player");

if (!iframe) return;

if (iframe.requestFullscreen) {

iframe.requestFullscreen();

}

}
