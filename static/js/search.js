const searchInput = document.getElementById("searchInput");

if (searchInput) {

searchInput.addEventListener("keyup", function () {

let filter = this.value.toLowerCase();

let cards = document.querySelectorAll(".batch-card");

cards.forEach(card => {

let text = card.innerText.toLowerCase();

card.style.display = text.includes(filter)
? "flex"
: "none";

});

});

}
