
function searchBatch() {
    let input = document
        .getElementById("search")
        .value.toLowerCase();

    let cards =
        document.querySelectorAll(".card");

    cards.forEach(card => {
        if (
            card.innerText
            .toLowerCase()
            .includes(input)
        ) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}
